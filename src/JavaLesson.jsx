import React,{useEffect,useState}from"react";
import{Bot,CheckCircle2,ChevronRight,Lightbulb,RotateCcw,Send,Sparkles,Trophy,X}from"lucide-react";

const challengeInfo={
variables:{goal:"Create a String variable for a player's name, then print that variable.",requirements:"Use a String variable to store a player's name. Then print the variable.",hint:"Choose your own valid variable name and your own player name. Do not copy a solution."},
strings:{goal:"Create text and number variables, then print them.",requirements:"Use one String variable and one int variable. Print both values.",hint:"Choose your own variable names and values. The important part is using the correct Java types."},
conditions:{goal:"Use an if/else decision based on a number.",requirements:"Create a number variable, compare it in an if statement, and include an else path.",hint:"Choose your own number, comparison, and messages. Your code needs both if and else."},
methods:{goal:"Create a method that takes a name and prints a greeting, then call it.",requirements:"Define a method with a String parameter. Make it print a greeting, then call the method.",hint:"Choose your own method name, parameter name, person name, and greeting. The method must be defined and called."},
classes:{goal:"Create a class with a name field and create an object from it.",requirements:"Define a class with a name field, then create an object from that class.",hint:"Choose your own class, object, and name. The important idea is class blueprint → new object."},
loops:{goal:"Use a loop to repeat a print action.",requirements:"Use a loop to repeat a print action several times.",hint:"Choose your own loop type, counter, limit, and message. The code must actually repeat the work."},
minecraft:{goal:"Write Java that shows how a mod could react to a Minecraft situation.",requirements:"Write a Java condition that represents a mod reacting to something happening in Minecraft.",hint:"Choose your own Minecraft situation and response. This is a concept exercise, not a real Fabric build yet."},
challenge:{goal:"Make a small Java program that stores a player name and diamond count, then makes a decision.",requirements:"Store a player name and diamond count, then use an if/else decision and print a message.",hint:"Choose your own names, diamond count, condition, and messages. Build the solution yourself."}
};

const sections=[
{id:"welcome",title:"Welcome to Java",body:<><p>Java is the language we will use to build our Minecraft mods. You do <b>not</b> need to know everything about Java before starting.</p><p>Think of Java as a language for giving the computer instructions. Minecraft and Fabric provide useful tools; your job is to combine them.</p><div className="tip"><Lightbulb/><div><b>Beginner rule</b><p>Do not try to memorize every symbol. Learn what each piece does, then practice changing it.</p></div></div></>},
{id:"variables",title:"1. Variables: storing information",body:<><p>A variable is a named place where your program can keep a value.</p><Code text={"String playerName = \"Alex\";\nint diamonds = 12;\ndouble speed = 0.25;\nboolean hasPermission = true;"}/><div className="explainGrid"><div><b>String</b><span>Text such as a player name.</span></div><div><b>int</b><span>Whole numbers such as 12.</span></div><div><b>double</b><span>Numbers that can contain decimals.</span></div><div><b>boolean</b><span>Either true or false.</span></div></div><p>For Minecraft mods, variables might store a player's name, a block count, a setting, or whether something is enabled.</p></>},
{id:"strings",title:"2. Text and numbers",body:<><p>You will constantly work with text and numbers in mods.</p><Code text={"String name = \"Steve\";\nint level = 5;\n\nSystem.out.println(name);\nSystem.out.println(\"Level: \" + level);"}/><p>The <code>+</code> joins text together. This is called <b>concatenation</b>.</p><div className="miniExercise"><b>Try it:</b><span>Change <code>level</code> to <code>10</code>. What do you think the second line prints?</span></div></>},
{id:"conditions",title:"3. Making decisions with if",body:<><p>Mods often need to ask a question: Is the player holding an item? Is a value high enough? Is a setting enabled?</p><Code text={"int diamonds = 12;\n\nif (diamonds >= 10) {\n    System.out.println(\"You have enough!\");\n} else {\n    System.out.println(\"You need more.\");\n}"}/><p>An <code>if</code> runs its code when the condition is true. <code>else</code> handles the other case.</p><div className="tip"><Lightbulb/><div><b>Read it like English</b><p>If diamonds are greater than or equal to 10, say enough. Otherwise, say need more.</p></div></div></>},
{id:"methods",title:"4. Methods: reusable actions",body:<><p>A method is a named group of instructions. Methods keep your code organized and let you reuse an action.</p><Code text={"public static void sayHello(String name) {\n    System.out.println(\"Hello, \" + name);\n}\n\nsayHello(\"Alex\");\nsayHello(\"Sam\");"}/><p>Here, <code>name</code> is a parameter. Each time we call the method, we give it a different value.</p><div className="miniExercise"><b>Think:</b><span>What would <code>sayHello("Steve")</code> print?</span></div></>},
{id:"classes",title:"5. Classes and objects",body:<><p>A class is a blueprint. An object is a real thing created from that blueprint.</p><Code text={"public class Pet {\n    String name;\n\n    public Pet(String name) {\n        this.name = name;\n    }\n}\n\nPet myPet = new Pet(\"Buddy\");"}/><p>In Minecraft, you will work with many objects: players, worlds, items, blocks, entities, and more.</p><div className="analogy"><b>Simple analogy</b><span>Class = blueprint for a house. Object = an actual house built from that blueprint.</span></div></>},
{id:"loops",title:"6. Loops: repeating work",body:<><p>A loop repeats code. This becomes useful when you need to process several things.</p><Code text={"for (int i = 0; i < 5; i++) {\n    System.out.println(\"Count: \" + i);\n}"}/><p>This prints five lines. The counter starts at 0 and increases until it reaches 5.</p><div className="warning"><b>Important for Minecraft:</b><span>Do not put huge loops into game code without understanding how much work they do. Performance matters.</span></div></>},
{id:"minecraft",title:"7. How this connects to Minecraft",body:<><p>Now connect the Java ideas to modding:</p><div className="mapping"><div><b>Java variable</b><span>Stores a setting, name, number, or object.</span></div><div><b>Java method</b><span>Performs one action.</span></div><div><b>Java class</b><span>Organizes related code and represents objects.</span></div><div><b>if statement</b><span>Lets your mod react differently to different situations.</span></div><div><b>loop</b><span>Repeats work when you actually need repetition.</span></div></div></>},
{id:"challenge",title:"8. Your first mini challenge",body:<><p>Write a tiny Java program that stores a player's name and number of diamonds, then prints a message.</p><Code text={"String playerName = \"YOUR_NAME\";\nint diamonds = 15;\n\nif (diamonds >= 10) {\n    System.out.println(playerName + \" has enough diamonds!\");\n} else {\n    System.out.println(playerName + \" needs more diamonds.\");\n}"}/><p><b>Your job:</b> Change the name and number. Then predict which message will print before running it.</p><div className="challengeSteps"><span>1. Change the name.</span><span>2. Change the diamond count.</span><span>3. Predict the output.</span><span>4. Run it and compare.</span></div></>},
{id:"checkpoint",title:"9. Lesson checkpoint",body:<><p>Finish the checkpoint quiz to unlock Lesson 1. You need <b>80% or higher</b> to pass.</p><div className="checklist"><label>☐ I know what a variable is.</label><label>☐ I can recognize String, int, double, and boolean.</label><label>☐ I understand what an if/else statement does.</label><label>☐ I understand what a method is.</label><label>☐ I understand class vs object.</label><label>☐ I know what a loop does.</label></div></>}
];

function Code({text}){return <pre className="code"><code>{text}</code><button onClick={()=>navigator.clipboard?.writeText(text)}>Copy</button></pre>}

export default function JavaLesson({done,setDone,ai,setAi}){
const[section,setSection]=useState("welcome");
const current=sections.find(x=>x.id===section)||sections[0];
const index=sections.findIndex(x=>x.id===section);
const teacherText={
welcome:"Java is the language we'll use to tell Minecraft what your mod should do. You don't need to memorize everything. We'll learn one idea at a time.",
variables:"A variable is a named place where your program stores information. In a Minecraft mod, that could be a player name, an item count, a setting, or almost any value your code needs.",
strings:"Programs work with text and numbers constantly. You'll use Strings for words, ints for whole numbers, doubles for decimals, and operators like + to combine values.",
conditions:"An if statement lets your mod make decisions. Your code can check something about the game and then choose what should happen next.",
methods:"A method is a reusable action. Instead of writing the same instructions over and over, you give them a name and call that method whenever you need the action.",
classes:"A class is a blueprint for related code, while an object is a real thing created from that blueprint. Minecraft uses objects everywhere.",
loops:"A loop repeats instructions. Loops are useful, but in Minecraft you should always think about how much work you're asking the game to do.",
minecraft:"Now we're connecting Java to Minecraft. Variables hold information, methods perform actions, classes organize code, if statements make decisions, and loops repeat work.",
challenge:"Now it's your turn. Write a small Java program that stores a player's name and diamond count, then decides which message to print.",
checkpoint:"This is your checkpoint. Answer the questions and show that you understand the Java foundations before moving on."
}[current.id]||"Let's learn this idea together, then you'll try it yourself in the workspace.";
const[teacherChars,setTeacherChars]=useState(0);
useEffect(()=>{setTeacherChars(0);let i=0;const timer=setInterval(()=>{i+=2;setTeacherChars(Math.min(i,teacherText.length));if(i>=teacherText.length)clearInterval(timer)},22);return()=>clearInterval(timer)},[section,teacherText]);
const quiz=[
{q:"Which type stores text?",a:"String",o:["int","String","boolean","double"]},
{q:"What does int store?",a:"Whole numbers",o:["Text","true/false","Whole numbers","Decimal numbers"]},
{q:"What does an if statement do?",a:"Makes a decision",o:["Repeats forever","Makes a decision","Creates a class","Copies code"]},
{q:"What is a method?",a:"A named group of instructions",o:["A variable type","A named group of instructions","A Minecraft block","A number"]},
{q:"A class is best described as a...",a:"Blueprint",o:["Blueprint","Loop","Number","Condition"]},
{q:"What does a loop do?",a:"Repeats code",o:["Deletes code","Repeats code","Creates a player","Stores text"]},
{q:"Which value is a boolean?",a:"true",o:["12","\"Alex\"","0.25","true"]},
{q:"What does + do in \"Level: \" + level?",a:"Joins values into text",o:["Subtracts","Joins values into text","Creates a loop","Checks permission"]},
{q:"What does new Pet(\"Buddy\") create?",a:"An object",o:["A class","An object","A boolean","A method"]},
{q:"What should you do when an error appears?",a:"Read the first error and check its line",o:["Delete the whole project","Ignore it","Read the first error and check its line","Restart Minecraft only"]}
];
const[reset,setReset]=useState(false);
const[quizAnswers,setQuizAnswers]=useState({});
const[workspaceCode,setWorkspaceCode]=useState("");
const[quizSubmitted,setQuizSubmitted]=useState(false);
const[output,setOutput]=useState([]);
const[chatInput,setChatInput]=useState("");
const[chatMessages,setChatMessages]=useState([{from:"ai",text:"I'm here! You can ask me about the example, your code, or anything in this lesson."}]);
const challenge=challengeInfo[current.id];
const checkCode=()=>{
const code=workspaceCode;
if(!code.trim()){setOutput(["Write some code first, then run it."]);return}
const checks={
variables:/\bString\s+\w+\s*=/.test(code)&&/System\.out\.println\s*\(\s*\w+\s*\)/.test(code),
strings:/\bString\s+\w+\s*=/.test(code)&&/\bint\s+\w+\s*=/.test(code)&&/System\.out\.println/.test(code),
conditions:/\bif\s*\(/.test(code)&&/\belse\\b/.test(code),
methods:/(?:void|int|String|boolean|double)\s+\w+\s*\([^)]*String\s+\w+[^)]*\)/.test(code)&&/\w+\s*\(.*\)\s*;/.test(code),
classes:/\bclass\s+\w+/.test(code)&&/\bnew\s+\w+\s*\(/.test(code),
loops:/\bfor\s*\(/.test(code)||/\bwhile\s*\(/.test(code),
minecraft:/\bif\s*\(/.test(code)&&/(player|Player|sneak|Minecraft|world|item|block)/.test(code),
challenge:/\bString\s+\w+\s*=/.test(code)&&/\bint\s+\w+\s*=/.test(code)&&/\bif\s*\(/.test(code)&&/System\.out\.println/.test(code)
};
const ok=challenge?checks[current.id]!==false:code.includes("System.out");
setOutput(ok?["✓ Your code matches the goal!","The exact variable names, values, and messages can be different.","Keep coding like this — understand the idea, don't just copy the example."]:["✗ Not quite yet.","Your code does not match the goal for this section yet.","You can use different names and values, but the required Java concept still needs to be present."]);
};
const sendTeacher=()=>{
if(!chatInput.trim())return;
const user=chatInput.trim();
const lower=user.toLowerCase();
let reply;
if(lower.includes("different")||lower.includes("username")||lower.includes("name"))reply="Yes! You can use a different variable name. For example, Username works just like playerName as long as it is a valid Java variable name and you use the same name when you print it.";
else if(lower.includes("error")||lower.includes("wrong"))reply="That's okay. Read the first error, check the line it points to, and look for spelling, brackets, semicolons, and mismatched variable names. You can paste the code here and I'll help explain it.";
else if(lower.includes("example")||lower.includes("want"))reply=challenge?challenge.hint:"The example is showing the concept. Your solution does not need to be identical — it needs to use the Java idea correctly.";
else if(lower.includes("why")||lower.includes("how"))reply="Think about what each line is doing, not just what it looks like. Tell me which line you're wondering about and I'll explain it step by step.";
else reply=challenge?challenge.hint:"Ask me about the Java concept you're learning, what a line means, or why your code works.";
setChatMessages(x=>[...x,{from:"user",text:user},{from:"ai",text:reply}]);
setChatInput("");
};

useEffect(()=>setSection("welcome"),[]);
return <div className="javaLesson">
<div className="lessonTop"><div><div className="meta"><span>BEGINNER</span><span>LESSON 1</span><span>45–60 MIN</span></div><h1>Java Foundations</h1><p className="lead">Your first step into Minecraft modding. We will learn Java one small idea at a time, then connect it to Minecraft.</p></div><button className="resetBtn" onClick={()=>setReset(!reset)}><RotateCcw size={14}/> Reset</button></div>
<div className="lessonProgress"><div><i style={{width:((index+1)/sections.length*100)+"%"}}/></div><span>Part {index+1} of {sections.length}</span></div>

<div className="codingStudio">
<div className="studioLeft">
<div className="backLessons">← Back to Lessons</div>
<div className="teacherPanel">
<div className="teacherHeader"><div className="teacherAvatar"><Bot size={18}/></div><div><b>AI Teacher</b><small>Lesson 1 · Java Foundations</small></div><Sparkles size={15}/></div>
<div className="teacherTyping"><span className="teacherLabel">TEACHING</span><h2>{current.title}</h2><div className="typingText"><span>{teacherText.slice(0,teacherChars)}</span><span className="typingCursor">▌</span></div>
<div className="teacherTask"><b>What to do</b><span>{challenge?challenge.goal:current.id==="checkpoint"?"Complete the checkpoint with at least 80%.":"Read the explanation, then change the example in the workspace and see what happens."}</span></div>
{challenge&&<div className="teacherExample"><div><b>WHAT I WANT YOU TO MAKE</b><small>No solution is shown here. Build it yourself.</small></div><pre>{challenge.requirements}</pre></div>}
<div className="teacherChat">
<div className="chatTitle"><span>CHAT WITH YOUR TEACHER</span></div>
<div className="chatMessages">{chatMessages.map((m,i)=><div className={m.from==="ai"?"chatAI":"chatUser"} key={i}><b>{m.from==="ai"?"AI Teacher":"You"}</b><span>{m.text}</span></div>)}</div>
<div className="chatInput"><input value={chatInput} placeholder="Ask your teacher..." onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendTeacher()}/><button onClick={sendTeacher}><Send size={13}/></button></div>
</div>
</div>
<div className="teacherProgress"><span>Part {index+1} of {sections.length}</span><div><i style={{width:((index+1)/sections.length*100)+"%"}}/></div></div>
<div className="teacherNav"><button className="secondary" disabled={index===0} onClick={()=>setSection(sections[Math.max(0,index-1)].id)}>← Previous</button>{index<sections.length-1?<button className="primary" onClick={()=>setSection(sections[index+1].id)}>Next <ChevronRight size={15}/></button>:<span>Checkpoint</span>}</div>
</div>
</div>

<div className="studioEditor">
<div className="studioTitle"><span>CODE</span><b>Workspace</b><small>Write your solution here.</small></div>
<div className="editorActions"><button onClick={()=>setWorkspaceCode("")}><RotateCcw size={13}/> Clear</button><button onClick={()=>navigator.clipboard?.writeText(workspaceCode)}><CheckCircle2 size={13}/> Copy</button><button className="runButton" onClick={checkCode}><ChevronRight size={13}/> Run</button></div>
<textarea className="studioCode" value={workspaceCode} onChange={e=>setWorkspaceCode(e.target.value)} placeholder={"// Write YOUR solution here.\n// Do not copy a solution — build it from the requirements."} spellCheck="false"/>
<div className="studioStatus"><span>Java workspace</span><span>{workspaceCode.split("\n").length} lines</span></div>
</div>

<div className="studioRight">
<div className="previewPanel"><div className="panelHeader"><div><span>PREVIEW</span><b>Lesson preview</b></div><Sparkles size={15}/></div><div className="previewContent"><div className="previewBadge">CURRENT LESSON</div><h3>{current.title}</h3><p>{index===sections.length-1&&done.includes("java")?"Lesson completed!":current.id==="challenge"?"Try the challenge in the code workspace.":"Follow the lesson on the left, then practice it in the workspace."}</p><div className="previewMini"><span>PART {index+1}</span><span>{sections.length} TOTAL PARTS</span></div></div></div>
<div className="outputPanel"><div className="panelHeader"><div><span>OUTPUT</span><b>Console</b></div><button onClick={()=>setOutput([])}><X size={13}/></button></div><div className="console">{output.length?output.map((line,i)=><div key={i}><span>&gt;</span>{line}</div>):<span className="consoleEmpty">Run your code to see output here.</span>}</div></div>
</div>
</div>

{index===sections.length-1&&done.includes("java")&&<div className="completeBanner"><Trophy size={20}/><div><b>Lesson 1 complete!</b><span>Next up: setting up your Fabric mod workspace.</span></div></div>}
</div>
}

function Quiz({quiz,answers,setAnswers,submitted,setSubmitted,onPass}){
const score=quiz.reduce((n,x,i)=>n+(answers[i]===x.a?1:0),0); const percent=Math.round(score/quiz.length*100);
const submit=()=>{setSubmitted(true);if(percent>=80)onPass()};
return <div className="lessonQuiz"><div className="quizHeader"><div><b>80% checkpoint</b><span>10 questions · 8 correct needed to pass</span></div>{submitted&&<strong className={percent>=80?"passScore":"failScore"}>{percent}%</strong>}</div>{quiz.map((x,i)=><div className="quizQuestion" key={x.q}><b>{i+1}. {x.q}</b><div className="quizOptions">{x.o.map(o=><label key={o}><input type="radio" name={"q"+i} checked={answers[i]===o} onChange={()=>{setAnswers(a=>({...a,[i]:o}));setSubmitted(false)}}/>{o}</label>)}</div></div>)}<button className="primary quizSubmit" onClick={submit} disabled={Object.keys(answers).length<quiz.length}>{submitted?(percent>=80?"Passed — Lesson 1 complete!":"Try Again — you need 80%"):"Submit checkpoint"}</button>{submitted&&percent<80&&<p className="quizRetry">You scored {percent}%. Review the lesson or ask the AI Tutor, then try again.</p>}{submitted&&percent>=80&&<p className="quizPass">You passed with {percent}%. Lesson 1 is now completed.</p>}</div>
}

function AITutor({section,onClose}){
const[input,setInput]=useState("");
const[messages,setMessages]=useState([{from:"ai",text:"Hi! I'm your AI Tutor for Lesson 1. Ask me about Java, the current section, an error, or what a piece of code means."}]);
const answer=msg=>{const m=msg.toLowerCase();if(m.includes("variable"))return"A variable is a named place for a value. Example: int diamonds = 12; stores the number 12 under the name diamonds.";if(m.includes("if")||m.includes("else"))return"An if statement makes a decision. The code inside runs when its condition is true. else is what happens when it is false.";if(m.includes("method"))return"A method is a named group of instructions you can call. In sayHello(\"Alex\"), sayHello is the method.";if(m.includes("class")||m.includes("object"))return"A class is a blueprint and an object is an actual thing created from it. Pet is the class; new Pet(\"Buddy\") creates an object.";if(m.includes("loop")||m.includes("for"))return"A loop repeats code. Our for loop starts at 0, checks i < 5, runs the code, then increases i.";if(m.includes("error")||m.includes("broken"))return"Start with the first error message. Check the line number, spelling, brackets, semicolons, and whether your names match.";if(m.includes("minecraft")||m.includes("mod"))return"Java is the foundation. Fabric gives your mod Minecraft-specific APIs. Soon you'll use these Java ideas to register items, blocks, commands, and events.";return "For this section, first explain what you think the code is doing. Then tell me the exact word or line that confuses you."};
const send=()=>{if(!input.trim())return;const user=input.trim();setMessages(x=>[...x,{from:"user",text:user},{from:"ai",text:answer(user)}]);setInput("")};
return <div className="aiTutor"><div className="aiHeader"><div><Bot size={19}/><div><b>AI Tutor</b><small>Lesson 1 helper</small></div></div><button onClick={onClose}><X size={17}/></button></div><div className="aiContext">Section: <b>{section}</b></div><div className="aiMessages">{messages.map((m,i)=><div className={m.from==="ai"?"aiMsg":"userMsg"} key={i}>{m.text}</div>)}</div><div className="aiQuick"><button onClick={()=>setInput("What is a variable?")}>Variable</button><button onClick={()=>setInput("I have an error")}>Error help</button><button onClick={()=>setInput("Explain this")}>Explain</button></div><div className="aiInput"><input value={input} placeholder="Ask for help..." onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}><Send size={15}/></button></div></div>
}
