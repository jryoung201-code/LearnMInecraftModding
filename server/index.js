import http from "node:http";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
import pg from "pg";

const { Pool } = pg;

const PORT = process.env.PORT || 10000;
const TINYFISH_API_KEY = process.env.TINYFISH_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://jryoung201-code.github.io";

const FREE_PLAN_INPUT_LIMIT = 1500;
const FREE_PLAN_OUTPUT_LIMIT = 280;
const FREE_PLAN_WINDOW_MS = 8 * 60 * 60 * 1000;
const FREE_PLAN_WINDOW_HOURS = 8;

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false }
    })
  : null;

const memoryUsage = new Map();

function send(res,status,payload){
  res.writeHead(status,{
    "Content-Type":"application/json; charset=utf-8",
    "Access-Control-Allow-Origin":ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers":"Content-Type",
    "Access-Control-Allow-Methods":"POST,OPTIONS"
  });
  res.end(JSON.stringify(payload));
}

function wordCount(value){
  return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

function getClientId(req){
  const forwarded = req.headers["x-forwarded-for"];
  return String(forwarded || req.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function newWindow(){
  return {
    startedAt: new Date(),
    input: 0,
    output: 0
  };
}

function quotaError(entry){
  const startedAt = entry.startedAt instanceof Date ? entry.startedAt : new Date(entry.startedAt);
  return {
    error:"Free Plan AI limit reached.",
    upgradeMessage:"You've reached the Free Plan AI limit. Upgrade your plan to chat more without this Free Plan limit.",
    plan:"Free",
    windowHours:FREE_PLAN_WINDOW_HOURS,
    resetAt:new Date(startedAt.getTime()+FREE_PLAN_WINDOW_MS).toISOString(),
    inputRemaining:Math.max(0,FREE_PLAN_INPUT_LIMIT-entry.input),
    outputRemaining:Math.max(0,FREE_PLAN_OUTPUT_LIMIT-entry.output)
  };
}

async function getPersistentUsage(clientId){
  const result = await pool.query(
    "SELECT client_id, window_started_at, input_words, output_words FROM ai_free_usage WHERE client_id = $1",
    [clientId]
  );

  if(!result.rows[0]){
    const entry=newWindow();
    await pool.query(
      "INSERT INTO ai_free_usage (client_id, window_started_at, input_words, output_words) VALUES ($1,$2,0,0) ON CONFLICT (client_id) DO NOTHING",
      [clientId,entry.startedAt]
    );
    return {startedAt:entry.startedAt,input:0,output:0};
  }

  const row=result.rows[0];
  const startedAt=new Date(row.window_started_at);
  if(Date.now()-startedAt.getTime()>=FREE_PLAN_WINDOW_MS){
    const entry=newWindow();
    await pool.query(
      "UPDATE ai_free_usage SET window_started_at=$2,input_words=0,output_words=0,updated_at=NOW() WHERE client_id=$1",
      [clientId,entry.startedAt]
    );
    return {startedAt:entry.startedAt,input:0,output:0};
  }

  return {
    startedAt,
    input:Number(row.input_words),
    output:Number(row.output_words)
  };
}

async function reserveInput(clientId,inputWords){
  if(!pool){
    const now=Date.now();
    let entry=memoryUsage.get(clientId);
    if(!entry || now-entry.startedAt.getTime()>=FREE_PLAN_WINDOW_MS){
      entry=newWindow();
      memoryUsage.set(clientId,entry);
    }
    if(entry.input+inputWords>FREE_PLAN_INPUT_LIMIT) return {ok:false,entry};
    entry.input+=inputWords;
    return {ok:true,entry};
  }

  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const rowResult=await client.query(
      "SELECT window_started_at,input_words,output_words FROM ai_free_usage WHERE client_id=$1 FOR UPDATE",
      [clientId]
    );

    let entry;
    if(!rowResult.rows[0]){
      entry=newWindow();
      await client.query(
        "INSERT INTO ai_free_usage (client_id,window_started_at,input_words,output_words,updated_at) VALUES ($1,$2,$3,0,NOW())",
        [clientId,entry.startedAt,inputWords]
      );
      await client.query("COMMIT");
      return {ok:true,entry:{...entry,input:inputWords}};
    }

    const row=rowResult.rows[0];
    const startedAt=new Date(row.window_started_at);
    if(Date.now()-startedAt.getTime()>=FREE_PLAN_WINDOW_MS){
      entry=newWindow();
      await client.query(
        "UPDATE ai_free_usage SET window_started_at=$2,input_words=$3,output_words=0,updated_at=NOW() WHERE client_id=$1",
        [clientId,entry.startedAt,inputWords]
      );
      await client.query("COMMIT");
      return {ok:true,entry:{...entry,input:inputWords}};
    }

    entry={startedAt,input:Number(row.input_words),output:Number(row.output_words)};
    if(entry.input+inputWords>FREE_PLAN_INPUT_LIMIT){
      await client.query("ROLLBACK");
      return {ok:false,entry};
    }

    await client.query(
      "UPDATE ai_free_usage SET input_words=input_words+$2,updated_at=NOW() WHERE client_id=$1",
      [clientId,inputWords]
    );
    entry.input+=inputWords;
    await client.query("COMMIT");
    return {ok:true,entry};
  }catch(error){
    try{await client.query("ROLLBACK");}catch{}
    throw error;
  }finally{
    client.release();
  }
}

async function refundInput(clientId,inputWords){
  if(inputWords<=0) return;
  if(!pool){
    const entry=memoryUsage.get(clientId);
    if(entry) entry.input=Math.max(0,entry.input-inputWords);
    return;
  }
  await pool.query(
    "UPDATE ai_free_usage SET input_words=GREATEST(0,input_words-$2),updated_at=NOW() WHERE client_id=$1",
    [clientId,inputWords]
  );
}

async function recordOutput(clientId,outputWords){
  if(outputWords<=0) return;
  if(!pool){
    const entry=memoryUsage.get(clientId);
    if(entry) entry.output+=outputWords;
    return;
  }
  await pool.query(
    "UPDATE ai_free_usage SET output_words=output_words+$2,updated_at=NOW() WHERE client_id=$1",
    [clientId,outputWords]
  );
}

async function getUsage(clientId){
  if(!pool){
    const now=Date.now();
    let entry=memoryUsage.get(clientId);
    if(!entry || now-entry.startedAt.getTime()>=FREE_PLAN_WINDOW_MS){
      entry=newWindow();
      memoryUsage.set(clientId,entry);
    }
    return entry;
  }
  return getPersistentUsage(clientId);
}

function javaSourceFor(code,section){
  const source=String(code || "").trim();
  if(!source) return {source:"",mode:"empty"};

  // A complete Java source file is compiled exactly as supplied.
  if(/(?:^|\\n)\\s*(?:public\\s+)?(?:final\\s+)?class\\s+\\w+/.test(source) && /\\bclass\\s+\\w+/.test(source)){
    return {source,mode:"full"};
  }

  // Lesson snippets are wrapped in a real Java main method so javac can
  // catch undeclared variables, bad types, syntax errors, etc.
  if(section==="methods"){
    return {
      source:`public class Main {
${source}
}`,
      mode:"class-body"
    };
  }

  if(section==="classes"){
    return {
      source:`public class Main {
${source}
}`,
      mode:"class-body"
    };
  }

  return {
    source:`public class Main {
  public static void main(String[] args) {
${source.split("\\n").map(line=>"    "+line).join("\\n")}
  }
}`,
    mode:"snippet"
  };
}

function cleanJavacOutput(value){
  return String(value || "")
    .replace(/\\r/g,"")
    .replace(/\\b(?:[A-Za-z]:)?[^\\n]*\\\\Main\\.java(?=:)/g,"Main.java")
    .trim();
}

async function compileJava(code,section){
  const {source,mode}=javaSourceFor(code,section);
  if(!source) return {ok:false,error:"Write some Java code first, then run it."};

  const dir=await mkdtemp(join(tmpdir(),"lmm-java-"));
  const file=join(dir,"Main.java");

  try{
    await writeFile(file,source,"utf8");
    try{
      await execFileAsync("javac",["--release","21","-Xlint:all",file],{
        cwd:dir,
        timeout:5000,
        maxBuffer:128*1024
      });
      return {ok:true,mode,message:"✓ Java compiler: no compilation errors."};
    }catch(error){
      const compilerOutput=cleanJavacOutput(error.stderr || error.stdout || error.message);
      return {
        ok:false,
        mode,
        error:compilerOutput || "javac could not compile the code."
      };
    }
  }finally{
    await rm(dir,{recursive:true,force:true});
  }
}

function limitWords(value,maxWords){
  const words=String(value || "").trim().split(/\s+/).filter(Boolean);
  if(words.length<=maxWords) return String(value || "").trim();
  return words.slice(0,maxWords).join(" ")+"…";
}

async function askTinyFish({message,section,code}){
  if(!TINYFISH_API_KEY) throw new Error("TINYFISH_API_KEY is not configured on the server.");

  const goal = `You are the AI Teacher for a beginner Minecraft Java modding course.
The student is learning Java and may be a complete beginner.
Section: ${section || "Java Foundations"}
Student message: ${message}
Student code (may be empty):
${code || "(none)"}

STRICT TEACHING SAFEGUARD:
- Never give the finished answer to the current exercise or challenge.
- Never provide a complete copy/paste solution, even if the student explicitly asks for it.
- Never fill in every missing line for the student.
- Never give the exact final code with the student's required variables, values, conditions, messages, or structure.
- If asked for the answer, politely refuse the finished answer and switch to coaching.
- Give ONE small hint at a time when the student is stuck.
- You may explain concepts and point out what a line or error means.
- You may show tiny syntax fragments (a few tokens) only when needed to explain a concept.
- If the student provides an attempted solution, explain the mistake without rewriting the whole solution.
- Ask the student to make the next small change themselves.

Answer clearly and encouragingly.
Return only the teacher's response as plain text.`;

  const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse",{
    method:"POST",
    headers:{"X-API-Key":TINYFISH_API_KEY,"Content-Type":"application/json"},
    body:JSON.stringify({
      url:"https://docs.oracle.com/javase/tutorial/",
      goal
    })
  });

  if(!response.ok) throw new Error(`TinyFish returned HTTP ${response.status}`);
  const text=await response.text();
  const events=[];
  for(const line of text.split(/\r?\n/)){
    if(!line.startsWith("data:")) continue;
    try{events.push(JSON.parse(line.slice(5).trim()));}catch{}
  }
  const complete=[...events].reverse().find(e=>e.type==="COMPLETE");
  const result=complete?.result;
  const unwrapResultString = value => {
    if(typeof value !== "string") return value;
    let text=value.trim();
    try{
      const parsed=JSON.parse(text);
      if(typeof parsed === "string") return parsed;
      if(parsed && typeof parsed.result === "string") return parsed.result;
    }catch{}
    return text;
  };

  let answer;
  if(typeof result==="string") answer=unwrapResultString(result);
  else if(result && typeof result==="object"){
    if(typeof result.result==="string") answer=unwrapResultString(result.result);
    else answer=result.response || result.answer || result.message || result.text;
  }else{
    const streamed=[...events].reverse().find(e=>e.type==="PROGRESS" && (e.message||e.text));
    answer=streamed?.message || streamed?.text;
  }

  return safeguardTeacherAnswer(answer,section);
}

async function ensureDatabase(){
  if(!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_free_usage (
      client_id TEXT PRIMARY KEY,
      window_started_at TIMESTAMPTZ NOT NULL,
      input_words INTEGER NOT NULL DEFAULT 0,
      output_words INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS ai_free_usage_window_started_idx
      ON ai_free_usage (window_started_at)
  `);
}

async function handleJavaCheck(req,res){
  let body="";
  req.on("data",chunk=>{
    body+=chunk;
    if(body.length>30000) req.destroy();
  });
  req.on("end",async()=>{
    try{
      const input=JSON.parse(body||"{}");
      const code=String(input.code || "");
      const section=String(input.section || "variables");
      if(code.length>20000) return send(res,413,{error:"Code is too large."});

      const result=await compileJava(code,section);
      if(result.ok) return send(res,200,{ok:true,message:result.message,mode:result.mode});

      send(res,200,{
        ok:false,
        message:"✗ Java compiler found an error.",
        compilerError:result.error,
        mode:result.mode
      });
    }catch(error){
      console.error("Java compiler error:",error);
      send(res,500,{error:"The Java compiler is temporarily unavailable."});
    }
  });
}

const server=http.createServer(async(req,res)=>{
  if(req.method==="OPTIONS"){res.writeHead(204,{"Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"});return res.end();}
  if(req.method==="GET" && req.url==="/health") return send(res,200,{ok:true});
  if(req.method==="POST" && req.url==="/api/java/check") return handleJavaCheck(req,res);
  if(req.method!=="POST" || req.url!=="/api/teacher") return send(res,404,{error:"Not found"});

  let body="";
  req.on("data",chunk=>{body+=chunk;if(body.length>20000) req.destroy();});
  req.on("end",async()=>{
    let reservedInput=0;
    let clientId="unknown";
    try{
      const input=JSON.parse(body||"{}");
      if(!input.message?.trim()) return send(res,400,{error:"Message is required."});

      clientId=getClientId(req);
      const inputWords=wordCount(input.message)+wordCount(input.code);
      const reservation=await reserveInput(clientId,inputWords);

      if(!reservation.ok){
        return send(res,429,quotaError(reservation.entry));
      }

      reservedInput=inputWords;
      const answer=await askTinyFish(input);
      const usage=await getUsage(clientId);
      const outputRemaining=Math.max(0,FREE_PLAN_OUTPUT_LIMIT-usage.output);
      const limitedAnswer=limitWords(answer,outputRemaining);
      const outputWords=wordCount(limitedAnswer);

      await recordOutput(clientId,outputWords);

      const updated=await getUsage(clientId);
      send(res,200,{
        answer:limitedAnswer,
        plan:"Free",
        inputUsed:updated.input,
        outputUsed:updated.output,
        inputRemaining:Math.max(0,FREE_PLAN_INPUT_LIMIT-updated.input),
        outputRemaining:Math.max(0,FREE_PLAN_OUTPUT_LIMIT-updated.output),
        resetAt:new Date(new Date(updated.startedAt).getTime()+FREE_PLAN_WINDOW_MS).toISOString(),
        windowHours:FREE_PLAN_WINDOW_HOURS
      });
    }catch(error){
      if(reservedInput>0){
        try{await refundInput(clientId,reservedInput);}catch(refundError){console.error(refundError);}
      }
      console.error(error);
      send(res,500,{error:"The AI Teacher is temporarily unavailable."});
    }
  });
});

async function start(){
  try{
    await ensureDatabase();
    server.listen(PORT,()=>console.log(`AI Teacher API listening on ${PORT} (PostgreSQL ${pool ? "enabled" : "fallback memory mode"})`));
  }catch(error){
    console.error("Database initialization failed:",error);
    process.exit(1);
  }
}

start();
