"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  { icon:"🌱", label:"Beginner",  sub:"Cloud Basics",    color:"#38b2ac", light:"#e6f9f8", glow:"rgba(56,178,172,.2)"  },
  { icon:"📚", label:"Learner",   sub:"AWS Services",    color:"#0073BB", light:"#e8f4fd", glow:"rgba(0,115,187,.18)"  },
  { icon:"🛠",  label:"Builder",   sub:"Real Projects",   color:"#FF9900", light:"#fff3e0", glow:"rgba(255,153,0,.22)"  },
  { icon:"🏅",  label:"Certified", sub:"AWS Credentials", color:"#1e2d3d", light:"#edf2f7", glow:"rgba(30,45,61,.18)"  },
  { icon:"🚀",  label:"Expert",    sub:"Cloud Leader",    color:"#E68900", light:"#fff8e8", glow:"rgba(230,137,0,.2)"   },
];
const DESCS = [
  "Join AWS SBG REC, explore cloud fundamentals and set up your first AWS services.",
  "Follow structured courses and roadmaps. Learn by doing alongside driven peers.",
  "Ship real AWS projects, join hackathons and build a portfolio that stands out.",
  "Prep with Quiz Arena and mock exams, then earn your AWS certifications.",
  "Mentor others, lead projects and launch your cloud career with confidence.",
];

export default function JourneyCard() {
  const [active, setActive] = useState(0);
  const [hov, setHov] = useState<number|null>(null);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a+1)%STAGES.length), 2400);
    return () => clearInterval(t);
  }, []);

  const cur = STAGES[active];

  return (
    <div
      style={{
        width:"100%",maxWidth:500,
        background:"#ffffff",border:"1.5px solid #f0ebe3",
        borderRadius:26,overflow:"hidden",
        boxShadow:"0 20px 60px rgba(30,45,61,.1)",
      }}>
      {/* gradient top bar — draws in */}
      <motion.div
        initial={{ scaleX:0 }}
        animate={{ scaleX:1 }}
        transition={{ duration:.9, ease:"easeOut" }}
        style={{ height:5, background:"linear-gradient(90deg,#FF9900,#E68900,#0073BB,#1e2d3d)", transformOrigin:"left" }}/>

      <div style={{padding:"32px 30px 28px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontWeight:800,fontSize:16,color:"#1d2939",marginBottom:6}}>
            Your Journey with AWS SBG REC
          </div>
          <div style={{fontSize:12,color:"#9ca3af"}}>From beginner to cloud professional</div>
        </div>

        {/* nodes */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22}}>
          {STAGES.map((st,i)=>{
            const isA=i===active, isP=i<active, isH=hov===i;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",flex:i<STAGES.length-1?1:"none"}}>
                <motion.div
                  onClick={()=>setActive(i)}
                  onMouseEnter={()=>setHov(i)}
                  onMouseLeave={()=>setHov(null)}
                  whileHover={{ scale:1.12 }}
                  whileTap={{ scale:.95 }}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flexShrink:0,cursor:"pointer"}}>
                  <motion.div
                    animate={isA ? { scale:[1,1.08,1] } : {}}
                    transition={{ duration:1.5, repeat:Infinity }}
                    style={{
                      width:isA?66:48, height:isA?66:48,
                      borderRadius:"50%",
                      background:isA?st.color:isP?st.light:isH?st.light:"#fafafa",
                      border:`2.5px solid ${isA||isP||isH?st.color:"#e0d8cf"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:isA?"1.65rem":"1.1rem",
                      boxShadow:isA?`0 0 0 8px ${st.glow},0 6px 22px ${st.glow}`:isH?`0 4px 14px ${st.glow}`:"none",
                    }}>
                    {st.icon}
                  </motion.div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:isA?11:9,fontWeight:isA?800:700,color:isA?st.color:isP?st.color:"#9ca3af",whiteSpace:"nowrap" as const}}>{st.label}</div>
                    <div style={{fontSize:8,color:isA?st.color+"BB":"#9ca3af",whiteSpace:"nowrap" as const}}>{st.sub}</div>
                  </div>
                </motion.div>
                {i<STAGES.length-1&&(
                  <motion.div
                    initial={{ scaleX:0 }}
                    animate={{ scaleX: i<active?1:0 }}
                    transition={{ duration:.5 }}
                    style={{flex:1,height:2,margin:"0 4px 36px",borderRadius:2,
                      background:`linear-gradient(90deg,${STAGES[i].color},${STAGES[i+1].color})`,
                      transformOrigin:"left",position:"relative"}}/>
                )}
                {i<STAGES.length-1&&i>=active&&(
                  <div style={{flex:1,height:2,margin:"0 4px 36px",borderRadius:2,background:"#f0ebe3"}}/>
                )}
              </div>
            );
          })}
        </div>

        {/* desc */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:.3 }}
            style={{
              background:cur.light, border:`1.5px solid ${cur.color}28`,
              borderRadius:16, padding:"15px 17px", marginBottom:16,
              display:"flex", alignItems:"center", gap:13,
            }}>
            <div style={{width:34,height:34,borderRadius:10,flexShrink:0,background:cur.color+"22",border:`1px solid ${cur.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>{cur.icon}</div>
            <span style={{fontSize:13,color:"#1d2939",fontWeight:600,lineHeight:1.6}}>{DESCS[active]}</span>
          </motion.div>
        </AnimatePresence>

        {/* dots */}
        <div style={{display:"flex",justifyContent:"center",gap:7}}>
          {STAGES.map((st,i)=>(
            <motion.div key={i} onClick={()=>setActive(i)}
              animate={{ width:i===active?24:8, background:i<=active?st.color:"#f0ebe3" }}
              transition={{ duration:.35 }}
              style={{height:8,borderRadius:100,cursor:"pointer"}}/>
          ))}
        </div>
      </div>
    </div>
  );
}
