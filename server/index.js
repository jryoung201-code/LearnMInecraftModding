import http from "node:http";

const PORT = process.env.PORT || 10000;
const TINYFISH_API_KEY = process.env.TINYFISH_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://jryoung201-code.github.io";

function send(res,status,data){
  res.writeHead(status,{"Content-Type":"application/json","Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"});
  res.end(JSON.stringify(data));
}

async function askTinyFish({message,section,code}){
  if(!TINYFISH_API_KEY) throw new Error("TINYFISH_API_KEY is not configured on the server.");

  const goal = `You are the AI Teacher for a beginner Minecraft Java modding course.
The student is learning Java and may be a complete beginner.
Section: ${section || "Java Foundations"}
Student message: ${message}
Student code (may be empty):
${code || "(none)"}

Answer the student's question clearly and encouragingly.
Teach the concept step by step.
Do NOT dump the complete solution to the current coding challenge.
Do NOT tell the student to copy an answer.
If they are stuck, give one small hint at a time.
You may show tiny syntax fragments when needed, but avoid completing their whole exercise.
If they share code, explain what is wrong and how to think about fixing it.
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
  if(typeof result==="string") return result;
  if(result && typeof result==="object"){
    return result.response || result.answer || result.message || result.text || JSON.stringify(result);
  }
  const streamed=[...events].reverse().find(e=>e.type==="PROGRESS" && (e.message||e.text));
  return streamed?.message || streamed?.text || "I couldn't get a teacher response right now. Please try again.";
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
