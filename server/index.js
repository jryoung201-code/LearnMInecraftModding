import http from "node:http";

const PORT = process.env.PORT || 10000;
const TINYFISH_API_KEY = process.env.TINYFISH_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://jryoung201-code.github.io";

const FREE_PLAN_INPUT_LIMIT = 1500;
const FREE_PLAN_OUTPUT_LIMIT = 280;
const FREE_PLAN_WINDOW_MS = 8 * 60 * 60 * 1000;

// Simple in-memory Free Plan usage tracker.
// Usage resets after 8 hours. A persistent store should be used if strict
// limits must survive Render restarts.
const usage = new Map();

function wordCount(value){
  return String(value || "").trim().split(/\\s+/).filter(Boolean).length;
}

function getClientId(req){
  const forwarded = req.headers["x-forwarded-for"];
  return String(forwarded || req.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function getUsage(req){
  const id=getClientId(req);
  const now=Date.now();
  let entry=usage.get(id);
  if(!entry || now-entry.startedAt>=FREE_PLAN_WINDOW_MS){
    entry={startedAt:now,input:0,output:0};
    usage.set(id,entry);
  }
  return entry;
}

function quotaError(entry){
  return {
    error:"Free Plan AI limit reached.",
    plan:"Free",
    resetAt:new Date(entry.startedAt+FREE_PLAN_WINDOW_MS).toISOString(),
    inputRemaining:Math.max(0,FREE_PLAN_INPUT_LIMIT-entry.input),
    outputRemaining:Math.max(0,FREE_PLAN_OUTPUT_LIMIT-entry.output)
  };
}

function send(res,status,data){
  res.writeHead(status,{"Content-Type":"application/json","Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"});
  res.end(JSON.stringify(data));
}

function safeTeacherFallback(section){
  return `I won't give you the finished answer for this exercise. I'll help you build it yourself.

For ${section || "this section"}, start by identifying the required Java concept from the challenge. Then write the smallest part you know. If you're stuck, tell me what part is confusing and I'll give you one hint at a time.`;
}

function safeguardTeacherAnswer(answer,section){
  if(typeof answer !== "string") return safeTeacherFallback(section);
  const text=answer.trim();
  const lower=text.toLowerCase();

  const forbiddenPhrases=[
    "here's the solution","here is the solution","here's the answer","here is the answer",
    "the complete solution","complete solution","copy this","copy the following",
    "use this exact code","paste this","just use this code","the answer is:"
  ];

  const hasForbiddenPhrase=forbiddenPhrases.some(x=>lower.includes(x));
  const hasFullCodeFence=/```[\\s\\S]*```/.test(text);
  const hasMultiLineJavaSolution=/(?:^|\\n)\\s*(?:String|int|double|boolean|public|private|class|if|for|while)\\b[^\\n]*[;{][\\s\\S]*\\n\\s*(?:System\\.out|else|return|new\\s+)\\b/.test(text);

  if(hasForbiddenPhrase||hasFullCodeFence||hasMultiLineJavaSolution){
    return safeTeacherFallback(section);
  }

  // Never let a response turn the student's exercise into a copy/paste solution.
  if(text.length>1800){
    return safeTeacherFallback(section);
  }

  return text;
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

const server=http.createServer(async(req,res)=>{
  if(req.method==="OPTIONS"){res.writeHead(204,{"Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"});return res.end();}
  if(req.method==="GET" && req.url==="/health") return send(res,200,{ok:true});
  if(req.method!=="POST" || req.url!=="/api/teacher") return send(res,404,{error:"Not found"});

  let body="";
  req.on("data",chunk=>{body+=chunk;if(body.length>20000) req.destroy();});
  req.on("end",async()=>{
    try{
      const input=JSON.parse(body||"{}");
      if(!input.message?.trim()) return send(res,400,{error:"Message is required."});
      const answer=await askTinyFish(input);
      send(res,200,{answer});
    }catch(error){
      console.error(error);
      send(res,500,{error:"The AI Teacher is temporarily unavailable."});
    }
  });
});

server.listen(PORT,()=>console.log(`AI Teacher API listening on ${PORT}`));
