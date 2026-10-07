import React,{useEffect,useState}from"react";
import ReactMarkdown from"react-markdown";
import remarkGfm from"remark-gfm";
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

const learningScenarios={
variables:[
["Player name","Your mod needs to remember which player opened a menu.","What kind of Java value would store a player name?"],
["Diamond count","You want to remember how many diamonds a player has.","Would a whole-number type or a text type make more sense?"],
["Mod enabled","A setting decides whether a feature is turned on.","Which Java type naturally represents on/off?"],
["Walk speed","A setting stores a value such as 0.25.","Would an integer be able to represent every possible value?"]
],
strings:[
["Welcome message","Your mod wants to display a player's name inside a message.","How could you combine fixed text with a String variable?"],
["Item label","You need text that says what item a player is holding.","Which part of the program should store the words?"],
["Score display","A message needs to show a player's score.","What happens when you join text and an int with +?"],
["Server status","Your UI needs to display the words 'Online' or 'Offline'.","Is this information better represented as text or a number?"]
],
conditions:[
["Enough diamonds","A player can open a feature only when they have at least 10 diamonds.","What comparison would separate enough from not enough?"],
["Permission check","A command should behave differently when a player has permission.","What boolean-like question could the if statement ask?"],
["Item check","Your mod should react differently depending on what the player is holding.","What information would the condition need to check?"],
["Setting check","A feature should only run when a setting is enabled.","Which value could the if statement test?"]
],
methods:[
["Send a message","Several parts of your mod need to send the same kind of message.","What reusable action could become a method?"],
["Calculate reward","Different events need the same reward calculation.","What information would the method need as a parameter?"],
["Open menu","More than one command needs to open the same menu.","How could a method keep that action in one place?"],
["Format player info","You want one reusable action that builds a player information message.","What input should the method receive?"]
],
classes:[
["Custom item","You want to organize data for a custom item.","What information might an object created from the class need?"],
["Player profile","Your mod needs a small object containing a player's name and score.","What would the class represent?"],
["Quest","Each quest object needs a title and progress value.","Which fields belong in the blueprint?"],
["Shop item","A shop entry needs a name and price.","What would one ShopItem object represent?"]
],
loops:[
["Five messages","You need to repeat a small print action five times.","What part of the loop controls how many times it runs?"],
["List of items","You need to process several items one after another.","Why might a loop be better than writing the same code repeatedly?"],
["Countdown","You want to count down from a number.","What should change each time the loop repeats?"],
["Checking positions","A program needs to inspect several nearby positions.","What work belongs inside the repeated section?"]
],
minecraft:[
["Player sneaks","A feature should react when a player is sneaking.","What Minecraft situation would your Java condition represent?"],
["Block interaction","Your mod should react when a player interacts with a block.","What event or game situation would trigger your logic?"],
["Item use","A custom item should do something when used.","What information would your code need to know before reacting?"],
["World setting","A feature should behave differently depending on the world.","What Minecraft object or value might your code inspect?"],
["Custom command","A command should check a value and then choose what happens.","Which Java concepts from this lesson could combine here?"]
],
challenge:[
["Diamond reward","A player has a name and a diamond count. Print a different message depending on whether they reached a target.","Which variables and decision structure do you need?"],
["Player rank","Store a player name and a numeric rank level, then choose a message based on the level.","Which value belongs in the condition?"],
["Item stock","Store an item name and stock count, then print whether the item is available.","What type fits the item name and what type fits stock?"],
["Quest progress","Store a player name and progress number, then report whether the quest is complete.","What comparison would separate complete from incomplete?"],
["Level requirement","Store a player name and level, then decide whether they can enter an area.","What should the if statement compare?"]
],
welcome:[
["Minecraft mod idea","Imagine a mod that reacts when a player uses a special item.","Which Java concepts do you think you would need?"],
["Simple feature","Imagine a setting that turns a feature on or off.","What kind of information would the program need to remember?"],
["Player information","Imagine a screen showing a player's name and score.","What kinds of values would the program store?"]
],
checkpoint:[
["Debugging situation","Your program reports an error near a variable declaration.","What should you inspect first: the first error message, spelling, punctuation, or all of them?"],
["Learning situation","You forgot what a boolean means.","Can you describe it as a value with only two possible states?"],
["Minecraft situation","You want code to react differently in two cases.","Which Java structure from this lesson would be a natural starting point?"]
]
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
const storageKey="lmm-java-lesson-v2";
const defaultChat=[{from:"ai",text:"I'm here! You can ask me about the example, your code, or anything in this lesson."}];
const[reset,setReset]=useState(false);
const[quizAnswers,setQuizAnswers]=useState({});
const[workspaceCode,setWorkspaceCode]=useState("");
const[quizSubmitted,setQuizSubmitted]=useState(false);
const[output,setOutput]=useState([]);
const[chatInput,setChatInput]=useState("");
const[chatMessages,setChatMessages]=useState(defaultChat);
const[chatTyping,setChatTyping]=useState(null);
const[autocomplete,setAutocomplete]=useState({open:false,items:[],index:0,start:0,end:0});
const[restored,setRestored]=useState(false);
const challenge=challengeInfo[current.id];
const autocompleteWords=[
"abstract","boolean","break","class","continue","double","else","extends","final","float","for","if","implements","import","int","interface","new","null","package","private","protected","public","return","static","String","super","this","true","void","while",
"System","out","println","print","printf","Math","Minecraft","Player","world","item","block","entity","StringBuilder"
];
const getAutocomplete=(value,pos)=>{
 const before=value.slice(0,pos);
 const match=before.match(/[A-Za-z_][A-Za-z0-9_]*$/);
 if(!match)return null;
 const word=match[0];
 if(!word)return null;
 const items=[...new Set(autocompleteWords.filter(x=>x.toLowerCase().startsWith(word.toLowerCase())&&x!==word))].slice(0,8);
 return items.length?{open:true,items,index:0,start:pos-word.length,end:pos}:null;
};
const insertAutocomplete=(item)=>{
 const s=workspaceCode.slice(0,autocomplete.start);
 const e=workspaceCode.slice(autocomplete.end);
 const next=s+item+e;
 setWorkspaceCode(next);
 setAutocomplete({open:false,items:[],index:0,start:0,end:0});
 requestAnimationFrame(()=>{const el=document.querySelector(".studioCode");if(el){const p=s.length+item.length;el.focus();el.setSelectionRange(p,p)}})
};
const handleEditorKeyDown=e=>{
 if(!autocomplete.open)return;
 if(e.key==="ArrowDown"){e.preventDefault();setAutocomplete(a=>({...a,index:(a.index+1)%a.items.length}));return}
 if(e.key==="ArrowUp"){e.preventDefault();setAutocomplete(a=>({...a,index:(a.index-1+a.items.length)%a.items.length}));return}
 if(e.key==="Escape"){e.preventDefault();setAutocomplete({open:false,items:[],index:0,start:0,end:0});return}
 if(e.key==="Tab"||e.key==="Enter"){e.preventDefault();insertAutocomplete(autocomplete.items[autocomplete.index])}
};

const checkCode=()=>{
const code=workspaceCode;
if(!code.trim()){setOutput(["Write some code first, then run it."]);return}

const declaredNames=new Set();
for(const match of code.matchAll(/\b(?:String|int|double|boolean|float|long)\s+(\w+)\s*=\s*/g))declaredNames.add(match[1]);

const printlnRefs=[...code.matchAll(/System\.out\.println\s*\(\s*([A-Za-z_]\w*)\s*\)/g)].map(m=>m[1]);
const missingRefs=printlnRefs.filter(name=>!declaredNames.has(name));

const missingSemicolonLines=code.split("\n").filter(line=>{
 const trimmed=line.trim();
 if(!trimmed||trimmed.startsWith("//")||trimmed.endsWith("{")||trimmed.endsWith("}"))return false;
 if(/^(if|else|for|while|class)\b/.test(trimmed))return false;
 return /^(?:String|int|double|boolean|float|long)\b/.test(trimmed)||/System\.out\.println/.test(trimmed)||/^return\b/.test(trimmed);
}).filter(line=>!line.endsWith(";"));

const syntaxProblems=[];
if(missingSemicolonLines.length)syntaxProblems.push("Add a semicolon (;) to the end of: "+missingSemicolonLines[0].trim());
if(missingRefs.length)syntaxProblems.push("The variable "+missingRefs[0]+" is used in println, but it has not been declared. Check the variable name.");

const checks={
variables:declaredNames.size>0&&/\bString\s+\w+\s*=/.test(code)&&printlnRefs.length>0&&missingRefs.length===0,
strings:/\bString\s+\w+\s*=/.test(code)&&/\bint\s+\w+\s*=/.test(code)&&/System\.out\.println/.test(code)&&missingRefs.length===0,
conditions:/\bif\s*\(/.test(code)&&/\belse\b/.test(code),
methods:/(?:void|int|String|boolean|double)\s+\w+\s*\([^)]*String\s+\w+[^)]*\)/.test(code)&&/\w+\s*\(.*\)\s*;/.test(code),
classes:/\bclass\s+\w+/.test(code)&&/\bnew\s+\w+\s*\(/.test(code),
loops:/\bfor\s*\(/.test(code)||/\bwhile\s*\(/.test(code),
minecraft:/\bif\s*\(/.test(code)&&/(player|Player|sneak|Minecraft|world|item|block)/.test(code),
challenge:/\bString\s+\w+\s*=/.test(code)&&/\bint\s+\w+\s*=/.test(code)&&/\bif\s*\(/.test(code)&&/System\.out\.println/.test(code)&&missingRefs.length===0
};

const conceptOk=challenge?checks[current.id]!==false:code.includes("System.out");
const ok=conceptOk&&syntaxProblems.length===0;

if(ok){
 setOutput(["✓ Your code matches the goal!","The exact variable names, values, and messages can be different.","Keep coding like this — understand the idea, don't just copy the example."]);
}else{
 const details=syntaxProblems.length?syntaxProblems:["Your code does not match the goal for this section yet."];
 setOutput(["✗ Not quite yet.",...details,"Fix the issue above and run it again."]);
}
};
const sendTeacher=async()=>{
if(!chatInput.trim()||chatTyping)return;
const user=chatInput.trim();
setChatMessages(x=>[...x,{from:"user",text:user},{from:"ai",text:"Thinking..."}]);
setChatInput("");
setChatTyping({text:"Thinking...",pos:0});
try{
 const response=await fetch("https://learn-minecraft-modding-ai.onrender.com/api/teacher",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:user,section:current.title,code:workspaceCode})});
 const data=await response.json();
 let answer=data.answer||data.error||"I couldn't answer that right now.";
 if(typeof answer!=="string")answer=String(answer);
 try{
   const parsed=JSON.parse(answer);
   if(typeof parsed==="string")answer=parsed;
   else if(parsed&&typeof parsed.result==="string")answer=parsed.result;
 }catch{}
 setChatMessages(x=>{
   const next=[...x];
   const i=next.length-1;
   if(i>=0&&next[i].from==="ai")next[i]={from:"ai",text:""};
   return next;
 });
 setChatTyping({text:answer,pos:0});
}catch{
 const answer="I couldn't reach the AI Teacher right now. You can keep working on the lesson and try again in a moment.";
 setChatMessages(x=>{
   const next=[...x];
   const i=next.length-1;
   if(i>=0&&next[i].from==="ai")next[i]={from:"ai",text:""};
   return next;
 });
 setChatTyping({text:answer,pos:0});
}
};

useEffect(()=>{
 try{
   const saved=JSON.parse(localStorage.getItem(storageKey)||"null");
   if(saved){
     if(saved.section)setSection(saved.section);
     if(typeof saved.workspaceCode==="string")setWorkspaceCode(saved.workspaceCode);
     if(saved.quizAnswers&&typeof saved.quizAnswers==="object")setQuizAnswers(saved.quizAnswers);
     if(typeof saved.quizSubmitted==="boolean")setQuizSubmitted(saved.quizSubmitted);
     if(Array.isArray(saved.output))setOutput(saved.output);
     if(Array.isArray(saved.chatMessages)&&saved.chatMessages.length)setChatMessages(saved.chatMessages);
   }
 }catch{}
 setRestored(true);
},[]);

useEffect(()=>{
 if(!chatTyping)return;
 if(chatTyping.pos>=chatTyping.text.length){
   setChatMessages(x=>{
     const next=[...x];
     const aiIndexes=next.map((m,i)=>m.from==="ai"?i:-1).filter(i=>i>=0);
     const i=aiIndexes[aiIndexes.length-1];
     if(i>=0)next[i]={from:"ai",text:chatTyping.text};
     return next;
   });
   setChatTyping(null);
   return;
 }
 const timer=setTimeout(()=>{
   const nextPos=Math.min(chatTyping.pos+2,chatTyping.text.length);
   setChatMessages(x=>{
     const next=[...x];
     const aiIndexes=next.map((m,i)=>m.from==="ai"?i:-1).filter(i=>i>=0);
     const i=aiIndexes[aiIndexes.length-1];
     if(i>=0)next[i]={from:"ai",text:chatTyping.text.slice(0,nextPos)};
     return next;
   });
   setChatTyping({...chatTyping,pos:nextPos});
 },18);
 return()=>clearTimeout(timer);
},[chatTyping]);

useEffect(()=>{
 if(!restored)return;
 const timer=setTimeout(()=>{
   try{
     localStorage.setItem(storageKey,JSON.stringify({
       version:2,
       section,
       workspaceCode,
       quizAnswers,
       quizSubmitted,
       output,
       chatMessages
     }));
   }catch{}
 },300);
 return()=>clearTimeout(timer);
},[restored,section,workspaceCode,quizAnswers,quizSubmitted,output,chatMessages]);

useEffect(()=>{if(reset){localStorage.removeItem(storageKey);window.location.reload()}},[reset]);
return <div className="javaLesson">
<div className="lessonTop"><div><div className="meta"><span>BEGINNER</span><span>LESSON 1</span><span>45–60 MIN</span></div><h1>Java Foundations</h1><p className="lead">Your first step into Minecraft modding. We will learn Java one small idea at a time, then connect it to Minecraft.</p></div><button className="resetBtn" onClick={()=>setReset(!reset)}><RotateCcw size={14}/> Reset</button></div>
<div className="lessonProgress"><div><i style={{width:((index+1)/sections.length*100)+"%"}}/></div><span>Part {index+1} of {sections.length}</span></div>

<div className="codingStudio">
<div className="studioLeft">
<div className="backLessons">← Back to Lessons</div>
<div className="teacherPanel">
<div className="teacherHeader"><div className="teacherAvatar"><Bot size={18}/></div><div><b>AI Teacher</b><small>Lesson 1 · Java Foundations</small></div><Sparkles size={15}/></div>
<div className="teacherTyping"><span className="teacherLabel">TEACHING</span><h2>{current.title}</h2><div className="typingText"><span>{teacherText.slice(0,teacherChars)}</span><span className="typingCursor">▌</span></div>
<div className="lessonTeacherContent">
<div className="lessonNarration">{chatMessages.map((m,i)=>{const aiMessage=m.from==="ai";const aiMessages=chatMessages.filter(x=>x.from==="ai");const aiIndex=aiMessages.indexOf(m);return <div className={aiMessage?"teacherMessage aiTeacherMessage":"teacherMessage userTeacherMessage"} key={i}><div className="chatSpeaker">{aiMessage?"AI:":"You:"}</div><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>{aiMessage&&chatTyping&&aiIndex===aiMessages.length-1&&<span className="chatTypingCursor">▌</span>}</div>})}</div>
<div className="teacherPractice">{challenge?challenge.requirements:current.id==="checkpoint"?"Complete the checkpoint with at least 80%.":"Try the idea in the workspace."}</div>
<div className="scenarioBox">
<div className="scenarioTitle"><Lightbulb size={13}/><span>REAL-WORLD SCENARIOS</span></div>
{(learningScenarios[current.id]||learningScenarios.welcome).map(([title,situation,hint],i)=><div className="scenarioCard" key={title+i}><b>{title}</b><p>{situation}</p><small><strong>Think:</strong> {hint}</small></div>)}
</div>
<div className="teacherAsk"><input value={chatInput} placeholder="Talk to your teacher..." onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendTeacher()}/><button onClick={sendTeacher} disabled={!!chatTyping}><Send size={13}/></button></div>
</div>
</div>
<div className="teacherProgress"><span>Part {index+1} of {sections.length}</span><div><i style={{width:((index+1)/sections.length*100)+"%"}}/></div></div>
<div className="teacherNav"><button className="secondary" disabled={index===0} onClick={()=>setSection(sections[Math.max(0,index-1)].id)}>← Previous</button>{index<sections.length-1?<button className="primary" onClick={()=>setSection(sections[index+1].id)}>Next <ChevronRight size={15}/></button>:<span>Checkpoint</span>}</div>
</div>
</div>

<div className="studioEditor">
<div className="studioTitle"><div className="studioTitleInfo"><span>CODE</span><b>Workspace</b><small>Write your solution here. <em className="saveIndicator">● Auto-saved</em></small></div><div className="editorActions"><button onClick={()=>setWorkspaceCode("")}><RotateCcw size={13}/> Clear</button><button onClick={()=>navigator.clipboard?.writeText(workspaceCode)}><CheckCircle2 size={13}/> Copy</button><button className="runButton" onClick={checkCode}><ChevronRight size={13}/> Run</button></div></div>
<div className="editorWrap"><textarea className="studioCode" value={workspaceCode} onChange={e=>{setWorkspaceCode(e.target.value);const a=getAutocomplete(e.target.value,e.target.selectionStart);setAutocomplete(a||{open:false,items:[],index:0,start:0,end:0})}} onKeyDown={handleEditorKeyDown} onClick={e=>{const a=getAutocomplete(e.target.value,e.target.selectionStart);setAutocomplete(a||{open:false,items:[],index:0,start:0,end:0})}} placeholder={"// Write YOUR solution here.\n// Do not copy a solution — build it from the requirements."} spellCheck="false"/>{autocomplete.open&&<div className="autocompleteMenu">{autocomplete.items.map((item,i)=><button className={i===autocomplete.index?"selected":""} key={item} onMouseDown={e=>{e.preventDefault();insertAutocomplete(item)}}><span>{item}</span><small>Java</small></button>)}</div>}</div>
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
const[messages,setMessages]=useState([{from:"ai",text:"Hi! I'm your AI Tutor for Lesson 1. I'll coach you without giving away the finished answer. Ask about a concept, an error, or what a piece of code means."}]);
const answer=msg=>{
 const m=msg.toLowerCase();
 if(m.includes("answer")||m.includes("solution")||m.includes("solve")||m.includes("code for")||m.includes("give me")){
   return "I won't give you the finished answer. I'll give you one small hint instead: identify the Java concept the exercise requires, then write the smallest part you already understand. Tell me which part is confusing and I'll help with the next step.";
 }
 if(m.includes("variable"))return"A variable is a named place for a value. Think about which Java type matches the kind of information your exercise asks you to store.";
 if(m.includes("if")||m.includes("else"))return"An if statement makes a decision. Ask yourself: what value should your condition check, and what should happen in each branch?";
 if(m.includes("method"))return"A method is a named group of instructions you can call. For your exercise, identify what information the method needs as a parameter before writing its body.";
 if(m.includes("class")||m.includes("object"))return"A class is a blueprint and an object is an instance made from that blueprint. Start by deciding what data your class needs to hold.";
 if(m.includes("loop")||m.includes("for"))return"A loop repeats code. Decide what should repeat, what starts the loop, and what condition should make it stop.";
 if(m.includes("error")||m.includes("broken"))return"Start with the first error message. Check its line number, spelling, brackets, semicolons, and whether your variable or method names match.";
 if(m.includes("minecraft")||m.includes("mod"))return"Java is the foundation. Fabric adds Minecraft-specific APIs. For this exercise, focus on the Java concept first rather than trying to build the whole mod at once.";
 return "For this section, first explain what you think the code is doing. Then tell me the exact word or line that confuses you, and I'll give you one hint without completing the exercise.";
};
const send=()=>{if(!input.trim())return;const user=input.trim();setMessages(x=>[...x,{from:"user",text:user},{from:"ai",text:answer(user)}]);setInput("")};
return <div className="aiTutor"><div className="aiHeader"><div><Bot size={19}/><div><b>AI Tutor</b><small>Lesson 1 helper</small></div></div><button onClick={onClose}><X size={17}/></button></div><div className="aiContext">Section: <b>{section}</b></div><div className="aiMessages">{messages.map((m,i)=><div className={m.from==="ai"?"aiMsg":"userMsg"} key={i}>{m.text}</div>)}</div><div className="aiQuick"><button onClick={()=>setInput("What is a variable?")}>Variable</button><button onClick={()=>setInput("I have an error")}>Error help</button><button onClick={()=>setInput("Explain this")}>Explain</button></div><div className="aiInput"><input value={input} placeholder="Ask for coaching..." onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}><Send size={15}/></button></div></div>
}