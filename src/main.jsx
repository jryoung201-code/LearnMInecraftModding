import React,{useEffect,useState}from"react";
import{createRoot}from"react-dom/client";
import{BookOpen,CheckCircle2,ChevronRight,Code2,Compass,Download,GraduationCap,Hammer,Play,Search,Sparkles,Trophy}from"lucide-react";
import"./styles.css";

const lesson={id:"java",title:"Java Foundations",level:"Beginner",time:"25 min",description:"Variables, methods, classes, conditionals, loops, and the Java mental model you need for mods.",topics:["Variables & types","Methods","Classes & objects","if / else","Loops"]};
const questions=[["Which keyword creates a new object?",["new","make","build","spawn"],0],["What is a Java method?",["A reusable block of code","A texture","A world","A Gradle task"],0],["Why keep shared gameplay server-authoritative?",["To prevent clients deciding shared game state","To load textures","Because Java requires it","To skip testing"],0]];

const javaUrl="./lesson-java.html";

function App(){
const[page,setPage]=useState("home"),[q,setQ]=useState(""),[done,setDone]=useState(()=>JSON.parse(localStorage.getItem("lmm-done")||"[]"));
useEffect(()=>localStorage.setItem("lmm-done",JSON.stringify(done)),[done]);
const pct=Math.round(done.length/1*100);
const openJava=()=>window.location.href=javaUrl;
return <div className="app"><aside><div className="brand"><div className="brandIcon"><Code2/></div><div><b>Learn Minecraft</b><span>Modding Academy</span></div></div>
{[[Compass,"Roadmap","home"],[BookOpen,"Lessons","lessons"],[GraduationCap,"Practice","practice"],[Hammer,"Project Lab","project"]].map(([I,n,p])=><button className={page===p?"nav active":"nav"} key={p} onClick={()=>setPage(p)}><I/>{n}</button>)}
<div className="sideBottom"><div className="progress"><span>Your progress</span><b>{pct}%</b><div><i style={{width:pct+"%"}}/></div><small>{done.length} of 1 lesson complete</small></div></div></aside>
<main><header><span className="crumb">Minecraft Modding <ChevronRight size={14}/> {page}</span><div className="headRight"><a href="https://fabricmc.net/develop/" target="_blank" rel="noreferrer">Fabric Docs <Download size={13}/></a><label className="search"><Search size={14}/><input value={q} placeholder="Search lessons..." onChange={e=>setQ(e.target.value)}/></label></div></header>
{page==="home"&&<Home openJava={openJava} pct={pct} done={done}/>}
{page==="lessons"&&<Lessons openJava={openJava} done={done}/>}
{page==="practice"&&<Practice/>}
{page==="project"&&<Project openJava={openJava}/>}
</main></div>
}

function Home({openJava,pct,done}){return <section className="page"><div className="hero"><span className="eyebrow">LEARN BY BUILDING</span><h1>Go from “I want to make a mod” to <em>“I made one.”</em></h1><p>A guided Java + Fabric course that teaches the reason behind the code, then makes you use it.</p><div className="actions"><button className="primary" onClick={openJava}><Play size={16}/>Start Java Foundations</button><button className="secondary" onClick={()=>window.location.hash="practice"}><GraduationCap size={16}/>Practice</button></div></div>
<div className="stats"><div><b>1</b><span>lesson</span></div><div><b>Beginner</b><span>skill level</span></div><div><b>{pct}%</b><span>your progress</span></div></div>
<div className="sectionHead"><div><span className="eyebrow">THE ROADMAP</span><h2>Java foundations first</h2></div><span className="pill">1.21.11 starter track</span></div>
<button className="card" onClick={openJava}><span className="num">01</span><div className="lessonIcon"><Code2 size={18}/></div><div><div className="titleRow"><h3>{lesson.title}</h3><small>{lesson.level} · {lesson.time}</small></div><p>{lesson.description}</p><div className="tags">{lesson.topics.map(t=><span key={t}>{t}</span>)}</div></div><span className="check">{done.includes("java")?<CheckCircle2 size={19}/>:<ChevronRight size={19}/>}</span></button></section>}

function Lessons({openJava,done}){return <section className="lessonsPage"><div className="moduleList"><button className="module active" onClick={openJava}><div><Code2 size={16}/></div><span><b>{lesson.title}</b><small>{lesson.level} · {lesson.time}</small></span>{done.includes("java")&&<CheckCircle2 size={16}/>}</button></div><article><div className="meta"><span>{lesson.level}</span><span>{lesson.time}</span></div><h1>{lesson.title}</h1><p className="lead">{lesson.description}</p><div className="callout"><Sparkles size={17}/><div><b>One lesson, built properly</b><p>This is the first completed lesson. Open it to use the full interactive Java learning studio.</p></div></div><h2>What you'll learn</h2><div className="topics">{lesson.topics.map((t,i)=><div key={t}><small>0{i+1}</small>{t}</div>)}</div><div className="articleActions"><button className="primary" onClick={openJava}><Play size={16}/>Open lesson</button></div></article></section>}

function Practice(){const[a,setA]=useState({}),[score,setScore]=useState(null);return <section className="page"><div className="practiceHero"><span className="eyebrow">PRACTICE ARENA</span><h1>Can you explain the code?</h1><p>Try each question, then use your result to decide what to review.</p></div><div className="quiz">{questions.map((x,i)=><div className="q" key={x[0]}><h3>{i+1}. {x[0]}</h3>{x[1].map((o,j)=><label key={o}><input type="radio" name={"q"+i} checked={String(a[i])===String(j)} onChange={()=>setA({...a,[i]:j})}/>{o}</label>)}</div>)}<button className="primary" onClick={()=>setScore(questions.reduce((s,x,i)=>s+(Number(a[i])===x[2]?1:0),0))}>Check answers <ChevronRight size={16}/></button>{score!==null&&<div className="score"><Trophy size={20}/><b>{score}/{questions.length}</b><span>{score===questions.length?"Perfect!":"Review and try again."}</span></div>}</div></section>}

function Project({openJava}){return <section className="page"><div className="projectHero"><span className="eyebrow">PROJECT LAB</span><h1>Build something small enough to finish and real enough to be proud of.</h1><p>The project area will grow as more lessons are created. For now, use Java Foundations as your starting point.</p><button className="primary" onClick={openJava}><Code2 size={16}/>Start with Java Foundations</button></div><div className="gitBox"><div className="gitIcon"><Code2 size={18}/></div><div><b>Git-first workflow</b><p>README → skeleton → working feature → tests → polish → release.</p></div><a href="https://github.com/jryoung201-code/LearnMInecraftModding" target="_blank" rel="noreferrer">Open repository <ChevronRight size={13}/></a></div></section>}

createRoot(document.getElementById("root")).render(<App/>);