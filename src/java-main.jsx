import React from"react";
import{createRoot}from"react-dom/client";
import{ArrowLeft}from"lucide-react";
import JavaLesson from"./JavaLesson";
import"./styles.css";

function App(){
const[done,setDone]=React.useState(()=>JSON.parse(localStorage.getItem("lmm-done")||"[]"));
const[ai,setAi]=React.useState(true);
React.useEffect(()=>localStorage.setItem("lmm-done",JSON.stringify(done)),[done]);
return <div className="standaloneLesson"><header className="standaloneHeader"><a className="standaloneBrand" href="./index.html"><span><b>Learn Minecraft</b><small>Modding Academy</small></span></a><div className="standaloneMeta">LESSON 1 · JAVA FOUNDATIONS</div></header><main className="standaloneMain"><div className="standaloneTop"><a className="secondary standaloneBack" href="./index.html"><ArrowLeft size={14}/> Back to Academy</a><span className="standaloneStatus">{done.includes("java")?"✓ Lesson complete":"Lesson in progress"}</span></div><article className="lessonArticle"><JavaLesson done={done} setDone={setDone} ai={ai} setAi={setAi}/></article></main></div>
}
createRoot(document.getElementById("root")).render(<App/>);