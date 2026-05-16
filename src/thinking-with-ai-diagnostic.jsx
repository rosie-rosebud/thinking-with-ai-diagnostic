import { useState, useEffect, useRef } from "react";

// ─── QUESTIONS (36, jumbled order) ──────────────────────────────────
// ─── D2 DESIGN PALETTE ──────────────────────────────────────────────
// Soft maximalist — peach ground, ink, yellow highlight, red + green flourishes.
const D2 = {
  ground:     "#FFE8D4",  // page background
  ink:        "#1A0E0A",  // primary text, buttons, circles
  inkSoft:    "rgba(26,14,10,0.7)",   // body text that needs slight mute
  inkMuted:   "rgba(26,14,10,0.55)",  // secondary/muted
  inkFaint:   "rgba(26,14,10,0.35)",  // footnotes, placeholders
  cream:      "#FFFAF2",  // card fills inside the peach ground
  paperInk:   "#FFE8D4",  // cream for text on ink backgrounds (inverse of ground)
  red:        "#FF5A5F",  // accent circle, "you" marker, accent state
  green:      "#3A5A40",  // corner flourish, secondary decoration
  yellow:     "#FFED4E",  // highlighter, next-chapter box, you-badge bg
  cardBorder: "#1A0E0A",  // border on cards — thick ink outline
};

// Custom display order for the "All ten types" accordion on results.
// This is the order Amelia specified — not alphabetical, not id order.
const TYPES_DISPLAY_ORDER = [
  "warm-demander",
  "fledgling",
  "curious-experimenter",
  "system-thinker",
  "intentional-practitioner",
  "scaffolder",
  "foundation-builder",
  "thinking-architect",
  "ai-translator",
  "critical-questioner",
];

const QUESTIONS = [
  {id:1, dims:["D5"], type:"Warm Demander", s:"My students feel safe enough in my classroom to say 'I don't understand' or 'I got this wrong' without embarrassment.", r:false},
  {id:2, dims:["D4"], type:"", s:"I deliberately use retrieval practice, spacing, and interleaving in my classroom.", r:false},
  {id:3, dims:["D3","D5"], type:"Curious Experimenter", s:"I sometimes try new AI activities in lessons before I've fully thought through how they'll impact student thinking.", r:true},
  {id:4, dims:["D2","D5"], type:"", s:"I believe banning AI is a losing game — the real question is why students would want to offload their thinking to AI in the first place.", r:false},
  {id:5, dims:["D1"], type:"Scaffolder", s:"I provide students with specific templates, checklists, or step-by-step frameworks for how to think through tasks.", r:false},
  {id:6, dims:["D4"], type:"", s:"I think students using AI to efficiently generate flash cards and summaries for revision is a smart move.", r:true},
  {id:7, dims:["D2"], type:"AI Translator", s:"Colleagues come to me when they want to understand how to use AI in their teaching.", r:false},
  {id:8, dims:["D1"], type:"", s:"I explicitly teach my students thinking strategies — not just content.", r:false},
  {id:9, dims:["D5"], type:"Foundation Builder", s:"I'd rather spend lesson time on deep subject content than on teaching students how to use AI tools.", r:true},
  {id:10, dims:["D4"], type:"", s:"I worry that when students read a clear, fluent AI summary, they confuse feeling like they understand with actually understanding.", r:false},
  {id:11, dims:["D5"], type:"Sharing", s:"When I find something that works in my classroom, I actively share it with colleagues — in person, online, or both.", r:false},
  {id:12, dims:["D3","D1"], type:"", s:"When I see a student using AI, I know that some good thinking is going on — even if I don't see it on paper.", r:true},
  {id:13, dims:["D2"], type:"Critical Questioner", s:"I don't adopt new teaching strategies because someone on social media said they were transformative — I want to see the research first.", r:false},
  {id:14, dims:["D5"], type:"", s:"When I use AI in front of students, I narrate my thinking process out loud — including when I disagree with the output.", r:false},
  {id:15, dims:["D3"], type:"System Thinker", s:"I've considered how AI integration should differ between year groups — what's appropriate for Year 7 isn't necessarily right for Year 11.", r:false},
  {id:16, dims:["D1"], type:"", s:"When a student says 'I've learned this,' I have structured ways to help them check if that's actually true.", r:false},
  {id:17, dims:["D4"], type:"", s:"I don't worry too much about whether AI means a student struggled more or less with a task — the point is whether or not they were able to complete it.", r:true},
  {id:18, dims:["D1"], type:"Warm Demander", s:"I think the most important thing for metacognition is the classroom environment — if students don't feel safe to struggle, no framework will help.", r:false},
  {id:19, dims:["D2"], type:"", s:"If a student submitted AI-generated work with factual mistakes, I'd turn it into a whole-class learning opportunity about evaluating AI.", r:false},
  {id:20, dims:["D1"], type:"Scaffolder", s:"I think about how to gradually remove learning scaffolds over time so students develop independence, rather than always relying on provided frameworks.", r:false},
  {id:21, dims:["D5"], type:"", s:"I'd rather show students a polished example of what good looks like than let them see my messy thinking process.", r:true},
  {id:22, dims:["D3"], type:"Foundation Builder", s:"I'm cautious about bringing new AI tools into my classroom until I've seen solid evidence that they actually improve learning.", r:false},
  {id:23, dims:["D3"], type:"Intentional Practitioner", s:"I sometimes include AI in lessons because students expect it or enjoy it, rather than for a specific learning reason.", r:true},
  {id:24, dims:["D4"], type:"", s:"I've taught my students the difference between just recognising information versus actually being able to retrieve it from memory.", r:false},
  {id:25, dims:["D1","D5"], type:"Fledgling", s:"I know metacognition and critical thinking matter for AI use, but I'm honestly not sure where to start in my own practice.", r:false},
  {id:26, dims:["D2"], type:"", s:"When students use AI for research, I trust them to judge for themselves whether the output is reliable or not.", r:true},
  {id:27, dims:["D5"], type:"", s:"I've deliberately designed my classroom culture around making thinking visible and valued.", r:false},
  {id:28, dims:["D3"], type:"Critical Questioner", s:"I'm sometimes frustrated that there isn't enough published research yet on AI in education to guide my practice.", r:true},
  {id:29, dims:["D2"], type:"Curious Experimenter", s:"I've tried multiple AI tools in my teaching this year — even if some of them didn't work out.", r:false},
  {id:30, dims:["D1"], type:"", s:"Before my students use AI for a task, they have to articulate what they already know and what they want AI to help them with.", r:false},
  {id:31, dims:["D1","D4"], type:"", s:"When a student is stuck, I help them diagnose _why_ they're stuck, rather than giving them an answer or the next step in the process.", r:false},
  {id:32, dims:["D5","D2"], type:"", s:"When a student uses AI for an assignment, I'm more interested in understanding why they turned to it than if they should have in the first place.", r:false},
  {id:33, dims:["D5"], type:"Thinking Architect", s:"I've helped shape how other teachers or my wider school community approach AI and metacognition.", r:false},
  {id:34, dims:["D2"], type:"", s:"My students have a specific framework for evaluating AI outputs, guiding them to recognise bias, hallucinations, and reliability.", r:false},
  {id:35, dims:["D3","D1"], type:"", s:"When planning lessons or assessments, I have a systematic approach to deciding what students should and shouldn't use AI for.", r:false},
  {id:36, dims:["D5"], type:"", s:"I've thought about which of my professional tasks I should preserve for my own thinking versus which I'm comfortable offloading to AI.", r:false},
];

const PAGES = [];
for (let i = 0; i < QUESTIONS.length; i += 6) {
  PAGES.push(QUESTIONS.slice(i, i + 6));
}

// Helper to render _italic_ markup in question text
const renderText = (text) => {
  const parts = text.split(/(_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={i} style={{fontStyle:"italic"}}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

// ─── TYPES ──────────────────────────────────────────────────────────
const TYPES = [
  { id:"fledgling", name:"The Fledgling", tagline:"Ready to begin — and that's the hardest part.",
    description:"You know that thoughtful implementation of AI in the classroom involves critical thinking and metacognition, but if you're honest, you're not entirely sure where to begin or what good practice actually looks like yet. But here's a nice little reminder for you: that awareness is itself a metacognitive act. Knowing what you don't know, being honest about where you're at, and actively seeking out ways to develop? All of that is exactly the kind of thinking you'll eventually be teaching your students to do. Don't panic — you're not behind! You're at the most exciting point on the entire journey, because everything is ahead of you.",
    nextChapter:"Start small. In the words of the late Michael Mosely, pick Just One Thing — one think-aloud, one structured reflection, one thoughtful AI interaction — and give it a whirl. That's it!" },
  { id:"foundation-builder", name:"The Foundation Builder", tagline:"Strong roots before new branches.",
    description:"Deep subject knowledge is your superpower. You believe — and rightly so — that students can't think critically about something they don't understand, so you've built your practice around rigorous, well-structured content delivery. You're sceptical of shiny new tools until you're convinced they genuinely add value, and that scepticism is healthy. At the same time, there's a chance you might miss out on something new and exciting whilst you wait for the right study to be released. That's okay! But it's worth being just a little more open to playing… even if it's just you giving it a go outside the classroom.",
    nextChapter:"Make the expert thinking you already do more visible to your students, so they can start to internalise it and replicate your deep consideration of all new technologies in their learning." },
  { id:"curious-experimenter", name:"The Curious Experimenter", tagline:"What happens if I try this?",
    description:"You're energised by novelty and possibility. You were probably one of the first in your department to try ChatGPT, and you're always bringing new ideas to the staffroom. You've got a dozen half-tested approaches to AI and metacognition, and you're learning fast from each one. Subscriptions? Sure, you've got a list as long as your elbow — or perhaps you alternate month to month to save breaking the bank too much! Your enthusiasm is infectious and your willingness to fail publicly is inspiring, brave, and perhaps a little mad.",
    nextChapter:"Slow down just enough to figure out which experiments are actually working and why — turning your best instincts into repeatable practice." },
  { id:"warm-demander", name:"The Warm Demander", tagline:"I believe in you, and I'm not letting you off the hook.",
    description:"Your strength is relationships. You've created a classroom culture where students feel safe to struggle, to be wrong, and to talk openly about their thinking. When you introduce metacognitive practices, students engage because they trust you and because you've built an environment where intellectual vulnerability isn't risky. Failure, in your classroom, is just another step on the journey. In some lessons, it might even be the goal! You might not use the formal language of metacognition, but your students are doing it because of the culture you've created.",
    nextChapter:"Make the implicit explicit — naming and structuring what you're already doing so students can transfer these ways of working into other lessons and into their wider lifelong learning." },
  { id:"critical-questioner", name:"The Critical Questioner", tagline:"Yes, but does it actually work?",
    description:"You're the evidence person. You don't adopt a strategy because someone on LinkedIn said it was transformative — you want to see the research, the data, the impact. You're probably on a first name basis with Willingham, Bjork & Bjork, or John Hattie, you know your JSTOR from your arXiv, and you apply a healthy rigour to claims about both AI and metacognition. You're an invaluable counterweight to hype in your school.",
    nextChapter:"Move from critique to construction — you know what doesn't work, and now the opportunity is to use that analytical strength to build and test your own approaches systematically." },
  { id:"scaffolder", name:"The Scaffolder", tagline:"Structure that sets you free.",
    description:"You think in frameworks, templates, and progressions. Your students get clear scaffolds for how to think — sentence starters for reflection, step-by-step evaluation frameworks for AI outputs, structured planning templates. You're brilliant at breaking down the invisible process of 'good thinking' into something students can actually follow.",
    nextChapter:"Design your scaffolds so they're deliberately temporary, gradually removed as students build independence, so the structure becomes internalised rather than relied upon." },
  { id:"intentional-practitioner", name:"The Intentional Practitioner", tagline:"Purposeful by design, not by accident.",
    description:"You've moved past experimenting into deliberate, reflective practice. When you use AI in a lesson, there's a reason for it. When you model your thinking, it's a conscious pedagogical choice. You ask 'what are they actually thinking?' before you design an activity, and you're constantly reflecting on your own teaching with the same rigour you encourage in your students. You see connections across your practice that others miss.",
    nextChapter:"Deepen and share — push into the areas you haven't fully cracked yet (like assessment of metacognitive growth) and start making your coherent, thoughtful practice visible to colleagues." },
  { id:"ai-translator", name:"The AI Translator", tagline:"Making the complex accessible.",
    description:"You've developed a genuine fluency with AI tools, and more importantly, you can translate that fluency for others. You're the colleague who doesn't just say 'use AI for differentiation' but actually shows people how, step by step, with the thinking made visible. You understand both the potential and the limitations, and you can explain the metacognitive implications in language that doesn't make people's eyes glaze over.",
    nextChapter:"Push further into the actual science of what happens when students think with these tools, to prove to those around you that there's clear rationale behind each step you take." },
  { id:"system-thinker", name:"The System Thinker", tagline:"It's not about one lesson — it's about the whole curriculum.",
    description:"You think beyond individual lessons to the bigger picture. How does metacognitive development progress across a year? Across a key stage? How should AI integration in Year 7 differ from Year 11, and why? You're interested in policy, curriculum design, and whole-school approaches, and you can see how individual classroom practices connect to systemic change.",
    nextChapter:"Translate your systems-level thinking into something that actually shifts practice at scale, which means working with and through other people." },
  { id:"thinking-architect", name:"The Thinking Architect", tagline:"Designing the conditions for thinking to thrive.",
    description:"You've built something rare: a practice where metacognition, critical thinking, and AI integration aren't separate initiatives but a coherent whole. Your students are genuinely independent thinkers who use AI strategically, monitor their own cognition, and can articulate their thinking processes. You operate at the level of design — creating the conditions, culture, and structures in which thinking flourishes.",
    nextChapter:"Contribute to the evidence base, mentor the next generation of teachers into this work, and help shape what thoughtful AI integration looks like across the profession." },
];

// ─── SCORING ────────────────────────────────────────────────────────
function calcDimensions(answers) {
  const sums = {D1:0,D2:0,D3:0,D4:0,D5:0};
  const counts = {D1:0,D2:0,D3:0,D4:0,D5:0};
  QUESTIONS.forEach((q, i) => {
    if (answers[i] == null) return;
    const raw = answers[i];
    const score = q.r ? (8 - raw) : raw; // reverse: 7→1, 1→7
    q.dims.forEach(d => { sums[d] += score; counts[d]++; });
  });
  const avgs = {};
  Object.keys(sums).forEach(d => { avgs[d] = counts[d] > 0 ? (sums[d] / counts[d]) : 0; });
  return avgs;
}

function assignType(answers) {
  const d = calcDimensions(answers);
  const dims = [d.D1, d.D2, d.D3, d.D4, d.D5];
  const avg = dims.reduce((a,b)=>a+b,0)/5;
  const max = Math.max(...dims);
  const min = Math.min(...dims);
  const spread = max - min;
  const dn = ["D1","D2","D3","D4","D5"];
  const sorted = [...dn].sort((a,b) => d[b] - d[a]);
  const strongest = sorted[0];
  const secondStrongest = sorted[1];
  const leadGap = d[strongest] - avg;

  const ts = (idx) => { const raw = answers[idx]; return raw == null ? 4 : (QUESTIONS[idx].r ? 8-raw : raw); };

  // R1: Thinking Architect — all dims strong
  if (min >= 5 && avg >= 5.5) return TYPES[9];

  // R2: Fledgling — honestly low across the board
  if (avg < 2.5) return TYPES[0];

  // Flat-profile routing — no meaningful dimensional lead, route by avg band
  if (spread < 0.5) {
    if (avg < 4.5) return TYPES[0];      // Fledgling — unable to commit
    if (avg < 5.5) return TYPES[6];      // Intentional Practitioner — balanced mid-high
    return TYPES[9];                      // Thinking Architect — balanced high
  }

  // R3: AI Translator — strong D2+D3, D2 or D3 leads, two peer-facing signals
  if (d.D2 >= 4.5 && d.D3 >= 4.5 && d.D5 >= 3.5 &&
      (strongest === "D2" || strongest === "D3") &&
      ts(6) >= 6 && ts(10) >= 5) {
    return TYPES[7];
  }

  // R4: Critical Questioner — D2 clearly leads
  if (d.D2 >= 4.5 && strongest === "D2" && leadGap >= 0.5) return TYPES[4];

  // R5: Warm Demander — D5 clearly leads
  if (d.D5 >= 4.5 && strongest === "D5" && leadGap >= 0.4) return TYPES[3];

  // R6: System Thinker — broad high, D1 or D4 leads, curriculum-level signal
  if (avg >= 5 && min >= 4 && (strongest === "D1" || strongest === "D4") &&
      d.D1 >= 4.5 && d.D4 >= 4.5 && ts(14) >= 5) {
    return TYPES[8];
  }

  // R7: Scaffolder — D1 leading, explicit template endorsement
  if (d.D1 >= 4.5 && (strongest === "D1" || secondStrongest === "D1") &&
      ts(4) >= 5 && leadGap >= 0.3) {
    return TYPES[5];
  }

  // R8: Foundation Builder — D4 leads (science of learning), cautious-about-AI signal
  if (avg >= 3.5 && d.D4 >= avg + 0.3 && ts(21) >= 5) {
    return TYPES[1];
  }

  // R9a: Curious Experimenter — behavioural signal (direct self-report of experimentation)
  const q29Raw = answers[28] == null ? 4 : answers[28];
  const q3Raw  = answers[2]  == null ? 4 : answers[2];
  const q23Raw = answers[22] == null ? 4 : answers[22];
  if (q29Raw >= 6 && q3Raw >= 6 && q23Raw >= 5 && avg >= 3 && avg < 5.5) {
    return TYPES[2];
  }

  // R9b: Curious Experimenter — inconsistent profile, moderate-to-high spread
  if (avg >= 3 && spread >= 1.8 && max >= 4.5) return TYPES[2];

  // R10: Intentional Practitioner — truly balanced mid-high
  if (avg >= 4.5 && spread <= 1.2 && min >= 4 && leadGap <= 0.6) {
    return TYPES[6];
  }

  // Fallbacks — route by avg band and strongest dim
  if (avg < 3.5) return TYPES[0]; // still uncertain → OD

  if (avg < 4.5) {
    if (strongest === "D2" && leadGap >= 0.3) return TYPES[4];
    if (strongest === "D5" && leadGap >= 0.3) return TYPES[3];
    if (strongest === "D1" && leadGap >= 0.3) return TYPES[5];
    if (spread >= 1.5) return TYPES[2];
    return TYPES[6];
  }

  // High range (avg >= 4.5, not caught by earlier rules)
  if (spread >= 1.5) {
    if (strongest === "D2" || strongest === "D3") return TYPES[7];
    if (strongest === "D5") return TYPES[3];
    return TYPES[2];
  }

  // Balanced high
  if (strongest === "D1" || strongest === "D4") return TYPES[8];
  return TYPES[6];
}

// ─── WELCOME SCREEN ─────────────────────────────────────────────────
// D2 soft-maximalist: peach ground, corner circles, big Instrument Serif
// headline with highlighter on 'really?'. Two-column at desktop widths,
// single column at <900px where the stat cards sit below the headline.
const WelcomeScreen = ({ onStart }) => (
  <div style={{minHeight:"100vh",background:D2.ground,position:"relative",overflow:"hidden"}}>
    {/* Decorative corner circles — positioned so text never lands on them */}
    <div style={{position:"absolute",top:-140,right:-140,width:420,height:420,borderRadius:"50%",background:D2.red,opacity:0.9,zIndex:0,pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:-100,left:-110,width:300,height:300,borderRadius:"50%",background:D2.green,opacity:0.9,zIndex:0,pointerEvents:"none"}}/>

    {/* Nav */}
    <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 48px 0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:2}}>
      <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:22,fontStyle:"italic",display:"flex",alignItems:"center",gap:10,color:D2.ink}}>
        <span style={{width:12,height:12,background:D2.red,borderRadius:"50%"}}/>
        <span>Thinking with AI</span>
      </div>
      
    </div>

    {/* Main content */}
    <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 48px 72px",position:"relative",zIndex:1}}>
      <div className="tw-hp-grid" style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:80,alignItems:"start"}}>
        <div style={{paddingTop:60}}>
          <div style={{marginBottom:28}}>
            <span style={{display:"inline-block",background:D2.ink,color:D2.paperInk,fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"6px 12px",borderRadius:3,transform:"rotate(-1.5deg)"}}>A diagnostic for teachers</span>
          </div>
          <h1 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:"clamp(42px,7vw,76px)",lineHeight:0.96,letterSpacing:"-0.015em",color:D2.ink,margin:0}}>
            What is your <span style={{background:D2.yellow,padding:"0 6px",display:"inline-block",transform:"rotate(-0.4deg)"}}>Thinking with AI</span> type?
          </h1>
          <p style={{fontSize:"clamp(15px,1.5vw,18px)",lineHeight:1.5,marginTop:28,color:D2.inkSoft,maxWidth:"92%"}}>
            36 questions. Ten types. Five dimensions. One portrait of how you're already thinking with AI in your classroom, and what your next steps could be.
          </p>
          <div style={{marginTop:40,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
            <button onClick={onStart} style={{background:D2.ink,color:D2.paperInk,padding:"16px 34px",fontSize:15,fontWeight:600,letterSpacing:"0.03em",border:"none",borderRadius:999,cursor:"pointer",fontFamily:"inherit"}}
              onMouseEnter={e=>e.currentTarget.style.background="#2a1a14"}
              onMouseLeave={e=>e.currentTarget.style.background=D2.ink}>
              Start the diagnostic →
            </button>
            <div style={{fontSize:14,color:D2.inkMuted,lineHeight:1.5,maxWidth:280}}>
              Free · no sign-up · your own personalised report at the end
            </div>
          </div>
        </div>

        {/* What to expect — 2x2 stat grid */}
        <div style={{paddingTop:80}}>
          <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:16,color:D2.inkMuted,marginBottom:18}}>What to expect</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {num:"36",label:"slider questions, honestly answered"},
              {num:"~6",label:"minutes to complete"},
              {num:"10",label:"possible educator types"},
              {num:"1",label:"personalised report at the end"},
            ].map(({num,label}) => (
              <div key={label} style={{background:"rgba(255,255,255,0.55)",borderRadius:12,padding:"24px 22px"}}>
                <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:42,color:D2.red,fontStyle:"italic",lineHeight:1}}>{num}</div>
                <div style={{fontSize:14,fontWeight:500,color:D2.ink,marginTop:8,lineHeight:1.4}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop:60,paddingTop:24,borderTop:`1px solid ${D2.inkMuted}`,fontSize:13,color:D2.inkMuted,fontFamily:"'Instrument Serif',serif",fontStyle:"italic",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <span>thinkingwithai.co</span>
        <span>Based on the book <em>Thinking with AI</em> by Amelia King</span>
      </div>
    </div>

    {/* Responsive: stack at narrow widths */}
    <style>{`
      @media (max-width: 900px) {
        .tw-hp-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      }
      @media (max-width: 600px) {
        .tw-hp-grid > div { padding-top: 20px !important; }
      }
    `}</style>
  </div>
);

// ─── QUIZ PAGE ──────────────────────────────────────────────────────
// D2: peach ground, single tame green corner circle, page note, six questions,
// Likert scale circles (largest at ends, smallest at middle, no numbers),
// "Strongly disagree" on left / "Strongly agree" on right — this matches the
// scoring engine (val=1 = strongly disagree, val=7 = strongly agree).
const QuizPage = ({ page, pageIdx, totalPages, answers, onAnswer, onNext, onPrev }) => {
  const allAnswered = page.every((_, i) => answers[pageIdx * 6 + i] != null);
  // Circle sizes mirror the Likert shape: largest at extremes, smallest at neutral.
  // Index 0 = val=1 (strongly disagree), index 6 = val=7 (strongly agree).
  const circleSizes = [40, 32, 26, 22, 26, 32, 40];
  const firstQNum = pageIdx * 6 + 1;
  const lastQNum = Math.min(pageIdx * 6 + page.length, 36);

  return (
    <div style={{minHeight:"100vh",background:D2.ground,fontFamily:"'Inter',system-ui,sans-serif",position:"relative",overflow:"hidden"}}>
      {/* Single subtle decorative circle in corner */}
      <div style={{position:"absolute",top:-120,right:-160,width:320,height:320,borderRadius:"50%",background:D2.green,opacity:0.85,zIndex:0,pointerEvents:"none"}}/>

      {/* Nav */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 48px 0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:2}}>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:22,fontStyle:"italic",display:"flex",alignItems:"center",gap:10,color:D2.ink}}>
          <span style={{width:12,height:12,background:D2.red,borderRadius:"50%"}}/>
          <span>Thinking with AI</span>
        </div>
        <div style={{fontSize:12,color:D2.inkMuted,fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}}>Saved automatically</div>
      </div>

      {/* Main */}
      <div style={{maxWidth:760,margin:"0 auto",padding:"40px 48px 72px",position:"relative",zIndex:1}}>
        {/* Progress row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingTop:20,marginBottom:24}}>
          {pageIdx > 0 ? (
            <button onClick={onPrev} style={{background:"none",border:"none",color:D2.inkMuted,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",padding:0,marginTop:24}}>
              ← Previous page
            </button>
          ) : <div/>}
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:D2.inkMuted,marginBottom:6}}>Progress</div>
            <div style={{width:180,height:8,background:"rgba(26,14,10,0.12)",borderRadius:999,position:"relative"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${((pageIdx+1)/totalPages)*100}%`,background:D2.red,borderRadius:999,transition:"width 0.4s ease"}}/>
            </div>
            <div style={{fontSize:12,color:D2.inkMuted,marginTop:6,fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}}>Questions {firstQNum}–{lastQNum} of 36</div>
          </div>
        </div>

        {/* Page note */}
        <div style={{padding:"18px 22px",background:"rgba(255,255,255,0.5)",borderRadius:10,fontSize:14,color:D2.inkSoft,lineHeight:1.55,marginBottom:32}}>
          <strong style={{color:D2.ink,fontWeight:600}}>Go with your gut.</strong> The first answer that comes to mind is usually the most honest one. Click a circle to rate each statement.
        </div>

        {/* Questions */}
        {page.map((question, qLocalIdx) => {
          const qGlobalIdx = pageIdx * 6 + qLocalIdx;
          const selected = answers[qGlobalIdx];
          const qNumStr = `Q${String(qGlobalIdx + 1).padStart(2, "0")}`;
          const isLast = qLocalIdx === page.length - 1;
          return (
            <div key={qGlobalIdx} style={{padding:"28px 0 26px",borderBottom:isLast ? "none" : "1px solid rgba(26,14,10,0.1)"}}>
              <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:15,fontStyle:"italic",color:D2.red,marginBottom:8}}>{qNumStr}</div>
              <p style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:"clamp(18px,2vw,24px)",lineHeight:1.35,color:D2.ink,margin:0}}>
                {renderText(question.s)}
              </p>
              <div style={{marginTop:24,display:"flex",gap:14,alignItems:"center",justifyContent:"center",padding:"0 16px"}}>
                {[1,2,3,4,5,6,7].map(val => {
                  const isSelected = selected === val;
                  const sz = circleSizes[val - 1];
                  return (
                    <button key={val} onClick={() => onAnswer(qGlobalIdx, val)} style={{
                      width:sz, height:sz, borderRadius:"50%",
                      background: isSelected ? D2.red : D2.cream,
                      border: isSelected ? `2px solid ${D2.red}` : `2px solid rgba(26,14,10,0.4)`,
                      cursor:"pointer",
                      transition:"all 0.15s",
                      padding:0,
                    }}
                    onMouseEnter={e=>{if(!isSelected){e.currentTarget.style.borderColor=D2.ink;e.currentTarget.style.background="rgba(26,14,10,0.05)"}}}
                    onMouseLeave={e=>{if(!isSelected){e.currentTarget.style.borderColor="rgba(26,14,10,0.4)";e.currentTarget.style.background=D2.cream}}}
                    aria-label={`Rating ${val}`}
                    />
                  );
                })}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:16,fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:14,color:D2.inkMuted,padding:"0 16px"}}>
                <span>Strongly disagree</span>
                <span>Strongly agree</span>
              </div>
            </div>
          );
        })}

        {/* Footer: continue button */}
        <div style={{marginTop:40,display:"flex",justifyContent:"flex-end",alignItems:"center"}}>
          <button onClick={onNext} disabled={!allAnswered} style={{
            background: allAnswered ? D2.ink : "rgba(26,14,10,0.15)",
            color: allAnswered ? D2.paperInk : "rgba(26,14,10,0.35)",
            padding:"16px 34px",fontSize:15,fontWeight:600,letterSpacing:"0.03em",
            border:"none",borderRadius:999,
            cursor: allAnswered ? "pointer" : "default",
            fontFamily:"inherit",
            transition:"background 0.2s",
          }}
          onMouseEnter={e=>{if(allAnswered) e.currentTarget.style.background="#2a1a14"}}
          onMouseLeave={e=>{if(allAnswered) e.currentTarget.style.background=D2.ink}}>
            {pageIdx === totalPages - 1 ? "See my results →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── SYSTEM PROMPT ──────────────────────────────────────────────────
// ─── READING LIST (structured data, filtered per-report) ────────────
// Each resource has: title, author, year, format, source, level, dims, bestFor, note.
// shortlistReading() picks resources matching the person's type or growth-area dims.

const _T = (s) => {
  const k = s.trim().toLowerCase().replace(/^the\s+/, "");
  const m = {
    "fledgling":"The Fledgling","foundation builder":"The Foundation Builder",
    "curious experimenter":"The Curious Experimenter","warm demander":"The Warm Demander",
    "critical questioner":"The Critical Questioner","scaffolder":"The Scaffolder",
    "intentional practitioner":"The Intentional Practitioner","ai translator":"The AI Translator",
    "system thinker":"The System Thinker","thinking architect":"The Thinking Architect",
  };
  return m[k] || null;
};
const _TL = (str) => {
  if (str === "all") return ["The Fledgling","The Foundation Builder","The Curious Experimenter","The Warm Demander","The Critical Questioner","The Scaffolder","The Intentional Practitioner","The AI Translator","The System Thinker","The Thinking Architect"];
  return str.split(",").map(_T).filter(Boolean);
};

const RESOURCES = [
  // D1
  {title:"Educate to Self-Regulate", author:"Dr Shyam Barr", year:2024, format:"book", source:"Amba Press", level:"accessible", dims:["D1"], bestFor:_TL("fledgling, intentional practitioner, critical questioner, system thinker, scaffolder"), note:"Grab a copy of this book if you want to understand how to nurture learners who understand the 'how' and the 'why' of the learning process, not just the 'what'. A broad intro to metacognition and self-regulated learning, but a firm foundation to build an AI-empowered classroom on top of."},
  {title:"Metacognition and Self-Regulated Learning Guidance Report", author:"Education Endowment Foundation (EEF)", year:2025, format:"guide", source:"https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/metacognition", level:"intermediate", dims:["D1"], bestFor:_TL("fledgling, warm demander, critical questioner, intentional practitioner, scaffolder"), note:"What feels like the definitive report on what metacognition really looks like in the classroom. A good starting point if you're new to the metacognition world, but equally an excellent way to frame AI discussions by looking at the worked classroom examples and considering what they might look like with different levels of AI access."},
  {title:"Using hypermedia as a metacognitive tool for enhancing student learning? The role of self-regulated learning", author:"Roger Azevedo", year:2005, format:"paper", source:"DOI:10.1207/s15326985ep4004_2", level:"academic", dims:["D1"], bestFor:_TL("thinking architect, critical questioner, system thinker, scaffolder, curious experimenter"), note:"Turns out we had the answers 20+ years ago when Azevedo and his team found that adaptive teaching platforms can support good metacognitive practice if we build effective scaffolds into them… who'd've thought!"},
  {title:"Improving Comprehension with Think-aloud Strategies", author:"Jeffrey D. Wilhelm", year:2001, format:"book", source:"Scholastic", level:"accessible", dims:["D1"], bestFor:_TL("fledgling, curious experimenter, foundation builder, intentional practitioner, scaffolder"), note:"This one might seem odd at first glance, but I want you to pay attention to how think-alouds impact general literacy in the classroom. Then extrapolate: what kind of think-alouds could you do whilst using AI? How could you adapt the activities shared in this book, and what could the impact be?"},
  {title:"Thinking with AI", author:"Amelia King", year:2025, format:"book", source:"Thinking EdTech", level:"accessible", dims:["D1","D5"], bestFor:_TL("all"), note:"If you're doing the Thinking with AI diagnostic, then chances are you've come across the Thinking with AI book. And if you haven't, well… Educational theory plus practical activities that allow you to put thoughtful use of AI at the heart of your pedagogy? That sounds right up your alley, doesn't it?"},
  // D2
  {title:"Generative AI's impact on Critical Thinking: Revisiting Bloom's taxonomy", author:"Chahna Gonsalves", year:2024, format:"paper", source:"https://doi.org/10.1177/02734753241305980", level:"academic", dims:["D2"], bestFor:_TL("critical questioner, system thinker, ai translator, thinking architect, fledgling, scaffolder"), note:"One of the earlier papers on generative AI's impact on critical thinking. Gives some great frameworks for how you might combine your existing knowledge of Bloom's taxonomy with new and developing skills in the AI world."},
  {title:"The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers", author:"Hao-Ping Lee et al.", year:2025, format:"paper", source:"https://doi.org/10.1145/3706598.3713778", level:"academic", dims:["D2"], bestFor:_TL("critical questioner, warm demander, ai translator, thinking architect, intentional practitioner"), note:"A Microsoft report that looks at self-reported use of AI by 319 'knowledge workers' and how they found their critical thinking impacted by AI. Not specifically school-related, but an interesting glimpse into the world your students are going to step into."},
  {title:"Ask the Cognitive Scientist: How Can Educators Teach Critical Thinking?", author:"Daniel Willingham", year:2020, format:"blog post", source:"https://www.aft.org/ae/fall2020/willingham", level:"accessible", dims:["D2","D1"], bestFor:_TL("fledgling, foundation builder, warm demander, intentional practitioner, thinking architect, system thinker"), note:"A bit of a long one, but a really accessible intro to specific techniques for teaching critical thinking in the classroom. I particularly like the idea of teaching problem recognition skills that can be 'snapped together' even for the most complex of open-ended questions — of which AI may just be the biggest!"},
  {title:"Critical Thinking in the Age of Generative AI", author:"Larson et al.", year:2024, format:"paper", source:"https://journals.aom.org/doi/full/10.5465/amle.2024.0338", level:"academic", dims:["D2"], bestFor:_TL("thinking architect, ai translator"), note:"Short and sweet, highlighting some of the impacts that generative AI might be having on critical thinking, some of the skills we might need to develop in our students, and a number of areas that are rife for research opportunities."},
  {title:"AI Bias in Education", author:"Edited by Victoria Hedlund", year:2025, format:"book", source:"GenEd Labs", level:"accessible", dims:["D2"], bestFor:_TL("fledgling, foundation builder, intentional practitioner, ai translator, system thinker, thinking architect, warm demander"), note:"With chapters from a variety of folk across the AI in education spectrum, this book gives you both a detailed understanding of what bias is and how it manifests in AI outputs, and how you can mitigate and teach about it in your own classroom."},
  {title:"Generative AI is WEIRD!", author:"Punya Mishra", year:2023, format:"blog post", source:"https://punyamishra.com/2023/12/19/generative-ai-is-weird/", level:"accessible", dims:["D2"], bestFor:_TL("ai translator, scaffolder, fledgling, warm demander, thinking architect"), note:"To understand AI's strengths, you also need to understand its weaknesses. Start here if you want a quick intro to what causes AI output to be biased in the first place. Hint: it's because the training data is a little bit W.E.I.R.D…"},
  // D3
  {title:"AI Tools in Society: Impacts on cognitive offloading", author:"Michael Gerlich", year:2025, format:"paper", source:"DOI:10.3390/soc15010006", level:"academic", dims:["D3"], bestFor:_TL("critical questioner, scaffolder, intentional practitioner, thinking architect, system thinker, curious experimenter"), note:"Not just a study into the impacts of AI on critical thinking and cognitive offloading, this paper also gives a number of strategies for mitigating this, including mention of the importance of scaffolded use of AI rather than a free-for-all."},
  {title:"Cognitive offloading", author:"Risko & Gilbert", year:2016, format:"paper", source:"https://samgilbert.net/pubs/Risko2016TiCS.pdf", level:"academic", dims:["D3","D1"], bestFor:_TL("critical questioner, intentional practitioner, fledgling, ai translator, thinking architect"), note:"If you're seeing folk talk about AI causing cognitive offloading but aren't fully sure what that entails (or just want to go a little deeper), this one is for you. It's a high-quality primer that covers the different types of cognitive offloading along with practical examples and explanations of how they might impact overall thinking."},
  {title:"Search fluency as a misleading measure of memory", author:"Stone, S. M., & Storm, B. C.", year:2021, format:"paper", source:"https://doi.org/10.1037/xlm0000806", level:"academic", dims:["D3"], bestFor:_TL("critical questioner, ai translator"), note:"A good one for the folk who know that knowing how to find information (or knowing how to prompt AI well) is different to knowing the information itself, but are looking for the research to back it up. This article talks about online searches in particular, but it's just as applicable to use of AI."},
  {title:"Supernormal: How the internet is changing our memories and our minds", author:"Adrian F. Ward", year:2013, format:"paper", source:"https://www.jstor.org/stable/43865660", level:"academic", dims:["D3"], bestFor:_TL("warm demander, system thinker, thinking architect"), note:"Start here if you want to learn more about how the digital world is shaping how our brains create and retrieve memories. With AI becoming even more present in every part of the online world, the 'supernormal' stimulus is more common than ever before. But what will that mean for our students?"},
  {title:"Resistance as a Framework for Combating Cognitive Offloading", author:"Leon Furze", year:2026, format:"blog post", source:"https://leonfurze.com/2026/03/22/resistance-as-a-framework-for-combating-cognitive-offload/", level:"accessible", dims:["D3"], bestFor:_TL("fledgling, foundation builder, curious experimenter, critical questioner, scaffolder, intentional practitioner, ai translator, system thinker, thinking architect"), note:"Furze has a knack for creating clear frameworks that support both teachers and students in better navigating the AI world. This post is no different, as he shares a framework for adding friction to learning that he likens to adding resistance in the gym — the more friction, the better the learning."},
  {title:"Extending Minds with Generative AI", author:"Andy Clark", year:2025, format:"paper", source:"https://www.nature.com/articles/s41467-025-59906-9", level:"intermediate", dims:["D3","D2"], bestFor:_TL("intentional practitioner, thinking architect, curious experimenter, foundation builder"), note:"Sometimes, cognitive offloading can actually be a good thing. See, for example, the 'extended mind theory', which is expanded on in this optimistic article that talks about how the 'shape' of the interaction with AI is what really matters."},
  // D4
  {title:"Smart Teaching Stronger Learning", author:"Edited by Pooja K. Agarwal", year:2025, format:"book", source:"Unleash Learning Press", level:"accessible", dims:["D4"], bestFor:_TL("fledgling, foundation builder, curious experimenter, critical questioner, intentional practitioner"), note:"A seriously practical guide filled to the brim with a myriad of activities that will help you bring things like metacognition, retrieval practice, and interleaving straight into your classroom. Whilst not AI-focused, having a firm foundation in these concepts means the AI shifts become much more attainable."},
  {title:"Desirable Difficulties in Theory and Practice", author:"Bjork & Bjork", year:2020, format:"paper", source:"https://doi.org/10.1016/j.jarmac.2020.09.003", level:"academic", dims:["D4"], bestFor:_TL("fledgling, critical questioner, warm demander, foundation builder"), note:"This is one that already feels like a stalwart in education despite only being a few years old! Read this for an overview of what learning really looks like (hint: it's supposed to be hard!) along with recognition that it's much easier to read about it than to bring it into your classroom. A great reminder that, as AI makes learning feel easier, that ease might also make learning, well, not happen at all…"},
  {title:"Make It Stick", author:"Brown, Roediger & McDaniel", year:2014, format:"book", source:"Harvard University Press", level:"accessible", dims:["D4"], bestFor:_TL("fledgling, critical questioner, scaffolder, intentional practitioner, system thinker"), note:"Need practical, science-based examples of how to make learning really stick? Take a look at the strategies in this book, and then extrapolate out further: how can I use these when my students have AI at their fingertips? Where does AI fit, and where does it not? Could AI help with any elements to free up space for deeper thinking?"},
  {title:"Why Don't Students Like School?", author:"Daniel T Willingham", year:2021, format:"book", source:"Jossey-Bass", level:"accessible", dims:["D4","D5"], bestFor:_TL("warm demander, critical questioner, intentional practitioner, system thinker"), note:"Here's one that doesn't look like it links to AI… at least on the surface. But if you're on a mission to make the actual act of learning more appealing to students than them simply plugging something into an AI tool and calling it 'done', then this super accessible book is the one for you. It's easy to dip in and out of, and is both research-based and practical. Win-win!"},
  {title:"Understanding How We Learn: A Visual Guide", author:"Dr Yana Weinstein & Dr Megan Sumeracki, illustrated by Oliver Caviglioli", year:2018, format:"book", source:"David Fulton", level:"accessible", dims:["D4","D5"], bestFor:_TL("fledgling, scaffolder, critical questioner, intentional practitioner, system thinker"), note:"One for the visual learners out there. With Oliver Caviglioli's customary visual aplomb (read: super clear, super simple, super engaging), this guide from the Learning Scientists is great both as a primer for those wanting to learn more about the science of learning, as well as a dip-in-dip-out book for reminders and quick tips. Get the learning science down, and the AI becomes simple."},
  // D5
  {title:"Infinite Education", author:"Dan Fitzpatrick", year:2025, format:"book", source:"Teachergoals Publishing", level:"accessible", dims:["D5"], bestFor:_TL("thinking architect, system thinker, curious experimenter"), note:"Looking for ways to fully innovate your educational practice — and maybe that of everyone around you? Look no further than Infinite Education, which looks into what the future of education could look like."},
  {title:"The Memory Paradox: Why Our Brains Need Knowledge in an Age of AI", author:"Barbara Oakley et al.", year:2025, format:"paper", source:"https://arxiv.org/abs/2506.11015", level:"academic", dims:["D5"], bestFor:_TL("thinking architect, system thinker, ai translator, critical questioner"), note:"Carve out some quiet time to fully digest this one — it's a seriously in-depth study, but the crux is that knowledge is just as important (if not more so) than it has ever been. No knowledge, no effective AI use."},
  {title:"Harvard Project Zero Thinking Routines", author:"Harvard Graduate School of Education", year:null, format:"website", source:"https://pz.harvard.edu/thinking-routines", level:"accessible", dims:["D5"], bestFor:_TL("fledgling, foundation builder, curious experimenter, scaffolder, thinking architect"), note:"A veritable treasure trove of actionable thinking routines to take into your classroom right away. You'll recognise many of them even if you didn't know they came from the PZ library, and the majority of them can slot in really nicely to your AI-empowered classroom."},
  {title:"The Opposite of Cheating", author:"Tricia Bertram Gallant & David A. Rettinger", year:2025, format:"book", source:"University of Oklahoma Press", level:"intermediate", dims:["D5"], bestFor:_TL("thinking architect, system thinker, ai translator, foundation builder, intentional practitioner, critical questioner"), note:"If academic integrity is something you're mulling over, then this book is a great foundational text. Though it focuses on the Higher Education context, it gives some great guidance on how to encourage a culture of academic integrity rather than just trying to 'catch' cheaters, many of which would fit just as well in K-12 schooling as in HE."},
  {title:"AI in Education: An Educator's Handbook", author:"Matthew Wemyss", year:2024, format:"book", source:null, level:"accessible", dims:["D5"], bestFor:_TL("thinking architect, system thinker, fledgling, foundation builder, intentional practitioner"), note:"Anyone looking to develop their craft — from learning better prompting to developing a full AI strategy — should look no further than this book, which gives a great foundation to build upon."},
  {title:"A Little Guide for Teachers: Generative AI in the Classroom", author:"Laura Knight", year:2024, format:"book", source:"Sage", level:"accessible", dims:["D5"], bestFor:_TL("fledgling, foundation builder"), note:"Need something accessible that you can dip in and out of as you wish? Then look no further than this little delight of a book, which is chock-full of guidance on both the capabilities of AI as well as the ethical questions we need to ask ourselves before we bring it into our classrooms."},
];

// Pick resources matching the person's type or growth-area dims.
function shortlistReading(typeName, growthDims) {
  const results = RESOURCES.filter(r => {
    const typeMatch = r.bestFor.includes(typeName);
    const dimMatch = r.dims.some(d => growthDims.includes(d));
    return typeMatch || dimMatch;
  });
  return results.sort((a, b) => {
    const aType = a.bestFor.includes(typeName) ? 0 : 1;
    const bType = b.bestFor.includes(typeName) ? 0 : 1;
    return aType - bType;
  });
}

// Format one resource as a compact line for the system prompt.
function formatResourceForPrompt(r) {
  const bits = [`"${r.title}" — ${r.author}`];
  if (r.year) bits.push(`(${r.year})`);
  bits.push(`[${r.format}]`);
  bits.push(`[${r.level}]`);
  bits.push(`dims: ${r.dims.join("/")}`);
  if (r.source) bits.push(`source: ${r.source}`);
  bits.push(`note: ${r.note}`);
  return bits.join(" | ");
}

const REPORT_PROMPT = `You are generating a personalised diagnostic report for a teacher who just completed the "Thinking with AI" quiz.

GLOBAL RULE — CLEAN SEPARATION OF READING FROM EVERYTHING ELSE:

The report has a dedicated "Recommended reading" section. That is the ONLY place where specific books, papers, blog posts, authors, researchers, or named frameworks may appear. Everywhere else — diagnostic summary, strengths, areas for growth, next steps, one thing to try — must contain NO specific sources:
- No author names (no "Willingham," no "Risko and Gilbert," no "Furze," etc.)
- No titles (no "Make It Stick," no "the WEIRD paper")
- No named frameworks or theories borrowed from specific authors (no "Furze's resistance framework," no "the extended mind theory")

Generic references to research are FINE — you can say "the research is clear that..." or "there's good evidence that..." or "studies on retrieval practice show..." What you cannot do is name the source. If a point would naturally lead to naming a book or researcher, either leave the sourcing implicit or use a generic "the research" phrase, and let the reading list do the specific sourcing.

VOICE — READ THIS CAREFULLY AND FOLLOW IT EXACTLY:

You must write in this specific voice. Not a generic "warm and friendly AI" voice. THIS voice. Study these examples from the source material and match the rhythm, directness, humour, and sentence structure precisely:

"Take what works, bin the rest. Just like using AI, really."

"I was almost right."

"Still with me? Then please take a moment to appreciate the following fun fact."

"At the risk of sounding like a stuck record, here again with process offloading what we're looking at is ways that students can create supports to help them think."

"Make it visual, even funny. It's silly, but it works!"

"Try getting AI to fake that thinking process in real-time conversation."

"Here's the thing that makes me genuinely excited about education's future: The more powerful AI becomes, the more valuable human thinking becomes."

"The robots aren't coming for education. They're already here."

VOICE RULES — NON-NEGOTIABLE:
- Write like a sharp colleague in a staffroom, not like a report generator
- Short sentences are your friend. Use them. Then follow with something longer that unpacks the idea properly.
- Use "you" and "your" constantly — this is a conversation, not a document
- Be direct and occasionally blunt, but with a hint of humour and kindness: "You're not really doing this yet. That's fine — most people aren't."
- Use British English: colour, practise (verb), recognise, favour
- Humour is welcome but earned, not forced. No puns. No exclamation marks unless genuinely warranted.
- NEVER be sycophantic. No "Great news!", no "The wonderful thing is...", no "You should be really proud that..."
- NEVER use emoji in your responses
- NEVER use these words: journey, leverage, utilize, synergy, empower, robust, holistic, landscape, unlock, harness, navigate, deep dive, game-changer, exciting opportunity
- NEVER start paragraphs with phrases like "It's clear that..." or "It's worth noting that..." or "Interestingly,..." or "Honestly,..." — just say the thing
- NEVER use phrasing like "It's not X, it's Y" or anything else that could be considered an AI 'tell'
- NEVER mention "Amelia King" or "Amelia" in the report body
- NEVER refer to "the book" — if referencing Thinking with AI, use its title only as one resource among many
- Growth areas should be honest. "This isn't part of your practice yet" is fine. Don't wrap every criticism in three layers of reassurance.
- Practical advice should be "do this on Monday" specific, not "consider exploring opportunities to..."
- When recommending next steps, write them as if you're telling a friend what to actually do, not writing a CPD action plan

BANNED SENTENCE STRUCTURES — these are AI tells, avoid them completely:
- "It's not X, it's Y" — e.g. "It's not a weakness, it's an opportunity"
- "What you need isn't X. It's Y." — e.g. "What you need isn't more tools. It's more structure."
- "That's not X — that's Y." — e.g. "That's not a flaw, that's a feature."
- "The question isn't X. The question is Y."
- "This isn't about X. This is about Y."
- Any sentence that sets up a negation followed by a correction in the next clause or sentence.

Instead, just say the positive thing directly. Don't frame it as a contrast with something they're not doing or something you're correcting. For example:
- BAD: "What you need now isn't more experimentation. It's a way of interrogating your own practice."
- GOOD: "You've got the experimentation part down. The next bit is working out which experiments are actually landing."
- BAD: "That's not a character flaw, it's just what happens when enthusiasm outruns framework."
- GOOD: "Enthusiasm without framework is how most people start. The framework comes next."

DIMENSIONS:
- D1 (Metacognitive Awareness): The plan-monitor-evaluate cycle. Judgements of learning. Self-questioning.
- D2 (Critical Thinking Integration): Evaluating AI outputs. Bias, hallucinations, WEIRD data. Teaching students to interrogate, not just consume.
- D3 (Cognitive Offloading Literacy): The spectrum from helpful offloading to harmful dependency. External normalisation vs transactive memory.
- D4 (Science of Learning): Retrieval practice, spacing, interleaving, dual coding, prior knowledge activation — and whether AI bypasses them.
- D5 (Culture & Modelling): Visible thinking cultures. Modelling AI use. Assessment design that makes thinking more attractive than outsourcing.

REPORT STRUCTURE:

1. DIAGNOSTIC SUMMARY (2 paragraphs, returned as the "who_you_are" field) — An honest AI-generated overview of their diagnostic results. Structure it as two paragraphs separated by a blank line:
   - PARAGRAPH 1: Summarise what you see in their responses. Lean into specifics from their answers — use some of the phrasing from the quiz questions where it works. This paragraph should feel grounded and specific, not generic. It's what they might say about themselves after a particularly reflective staffroom conversation.
   - PARAGRAPH 2 (this one will render as a quote callout): Name any tension, contradiction, or honest version of their practice that the first paragraph set up. This is where you get to be direct. Start with something like "The honest version of this, though, is..." or "Here's the bit worth sitting with..." — then name the gap. Be honest about where they are without being unkind.

   Together the two paragraphs should make them feel seen, not flattered.

2. DIMENSION SCORES (5 items) — Name, stage (e.g. "Emerging"), one blunt sentence. Do not include the actual score number.
Scale: 1-7. 1.0-2.0 = Early. 2.1-3.5 = Emerging. 3.6-4.5 = Developing. 4.6-5.5 = Established. 5.6-7.0 = Leading.

3. STRENGTHS (2) — Top 2 dimensions. Descriptive title (not "Strength 1"). Say what they're doing and why it matters. Keep it honest — don't oversell.

4. AREAS FOR GROWTH (2) — Bottom 2 dimensions. Descriptive title. Be straight about the gap. Name a specific concept or framework that would help. Show how it connects to what they're already good at.

5. NEXT STEPS (3-5) — Concrete classroom actions they can actually do. This week or this term. Ordered from "try this tomorrow" to "work on this over the next few months." Be specific enough that they could do it without further instruction. These are ACTIONS — activities, habits, prompts, structural changes they can introduce with their students — never reading assignments.

6. RECOMMENDED READING (3-5) — You will be given a shortlist of resources in the user message, each with a title, author, year, format, level, dimensions, and a one-line note describing what it offers. Pick 3-5 from that shortlist. Aim for a mix of formats (books, papers, blog posts) and levels (accessible, intermediate, academic) appropriate to the reader. For the "context" field of each reading, write a short sentence that connects the resource specifically to the reader's situation — why THIS person should read THIS resource right now. You can draw on the provided notes but do not just copy them verbatim; adapt them to the reader.

7. ONE THING TO TRY THIS WEEK — One thing. Doable in 10 minutes. No prep needed. Write it like you're texting a colleague a suggestion.

Return ONLY valid JSON: {"who_you_are":"string","dimensions":[{"name":"string","stage":"string","interpretation":"string"}],"strengths":[{"title":"string","body":"string"}],"growth_edges":[{"title":"string","body":"string"}],"next_steps":[{"title":"string","body":"string"}],"reading":[{"title":"string","author":"string","year":"string","format":"string","source":"string","context":"string"}],"one_thing":"string"}
No markdown, no preamble, no backticks.`;

// ─── REPORT COMPONENTS ──────────────────────────────────────────────
// NEW DESIGN PALETTE (pulled from Amelia's vertical design PDF)
// R2 palette for the report — peach ground, forest green for structure/headings,
// coral red for accents and growth, yellow for callouts and hybrid marker.
// Key names preserved where possible so dependent components (DimensionCard,
// StrengthCard, etc.) continue to work with minimal changes.
const RPT_COLOURS = {
  forest:        "#2C4C3F",   // primary dark green — type name, one-thing, dim card tops, strengths bar, section titles
  forestDeep:    "#2C4C3F",   // stage labels for Established / Leading (same as forest now)
  terracotta:    "#FF5A5F",   // coral accent — rules, emerging labels, growth bar, step number bg
  terracottaAlt: "#FF5A5F",   // (kept same so old references still work)
  ink:           "#1A0E0A",   // deep ink body text
  mutedInk:      "rgba(26,14,10,0.7)",   // secondary text
  cream:         "#FFE8D4",   // page background — peach
  paleGreen:     "#FFFAF2",   // strengths card fill (cream)
  paleTerra:     "#FFFAF2",   // growth card fill (cream — accent is in the left border)
  paleTerraSoft: "#FFFAF2",   // dim card fill (cream)
  terracottaSoft:"#FF5A5F",   // emerging stage pill — use coral
  calloutCream:  "#FFED4E",   // 'honest version' quote callout — now yellow
  paperInk:      "#FFE8D4",   // inverse ink for text on dark backgrounds
  yellow:        "#FFED4E",   // highlighter yellow — hybrid marker, quote callout, one-thing label
  human:         "#2C4C3F",   // forest green circle
  ai:            "#FF5A5F",   // coral triangle
  hybrid:        "#FFED4E",   // yellow square (with ink outline — drawn separately)
};

// Provenance icons: circle = human, triangle = AI, square = hybrid.
// Smaller and more decorative in the R2 design — sits next to each section
// heading rather than dominating it.
const ProvenanceIcon = ({ kind, size = 14 }) => {
  if (kind === "human") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink:0}}>
        <circle cx="12" cy="12" r="10" fill={RPT_COLOURS.human}/>
      </svg>
    );
  }
  if (kind === "ai") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink:0}}>
        <polygon points="12,3 22,20 2,20" fill={RPT_COLOURS.ai}/>
      </svg>
    );
  }
  if (kind === "hybrid") {
    // Hybrid = yellow square with ink outline, so it reads at small size
    // and pairs with the yellow sticker / callouts in the design.
    const s = size <= 14 ? size - 1 : size; // a pixel smaller to match visual weight
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" style={{flexShrink:0}}>
        <rect x="2" y="2" width="20" height="20" fill={RPT_COLOURS.hybrid} stroke={RPT_COLOURS.ink} strokeWidth="2"/>
      </svg>
    );
  }
  return null;
};

// Inline horizontal legend, shown at the top-right of the report nav.
const ProvenanceLegend = () => (
  <div style={{display:"flex",alignItems:"center",gap:14,fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:12,color:"rgba(44,76,63,0.85)"}}>
    <span style={{display:"flex",alignItems:"center",gap:5}}><ProvenanceIcon kind="human" size={11}/>human</span>
    <span style={{display:"flex",alignItems:"center",gap:5}}><ProvenanceIcon kind="ai" size={11}/>AI</span>
    <span style={{display:"flex",alignItems:"center",gap:5}}><ProvenanceIcon kind="hybrid" size={11}/>hybrid</span>
  </div>
);

// Unused in R2 (sections now have their own divider inside the heading row).
// Kept as a no-op so any stray references don't break.
const SectionRule = () => null;

// Section heading — horizontal row with Instrument Serif title on the left,
// provenance icon on the right, thin forest-green divider underneath.
const RptSection = ({children, kind}) => (
  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${RPT_COLOURS.forest}`,marginTop:44}}>
    <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:22,lineHeight:1.1,flex:1,color:RPT_COLOURS.forest}}>{children}</div>
    {kind && <ProvenanceIcon kind={kind} size={14}/>}
  </div>
);

// Italic-serif explainer paragraph under the section divider.
// Plain text, muted forest-green, no box. Used for diagnostic summary, strengths,
// growth, next steps, reading (not dimensions, not one-thing).
const RptAddendum = ({children}) => (
  <p style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:13.5,lineHeight:1.7,color:"rgba(44,76,63,0.9)",marginBottom:20,paddingRight:4}}>
    {children}
  </p>
);

// Body paragraph in ink, generous line height.
const RptP = ({children, style={}}) => (
  <p style={{fontSize:15,lineHeight:1.7,color:RPT_COLOURS.ink,marginBottom:14,...style}}>{children}</p>
);

// Dimension card — cream fill, forest-green top accent, stage pill colour-coded
// by level (ink for high, coral for developing, yellow for emerging/early).
const DimensionCard = ({d}) => {
  const stage = (d.stage || "").toLowerCase();
  const isHigh = stage === "established" || stage === "leading";
  const isDeveloping = stage === "developing";
  const isLow  = stage === "early" || stage === "emerging";
  const pillBg = isHigh ? RPT_COLOURS.forest
               : isDeveloping ? RPT_COLOURS.terracotta
               : isLow ? RPT_COLOURS.yellow
               : RPT_COLOURS.forest;
  const pillColour = isLow ? RPT_COLOURS.forest : RPT_COLOURS.cream;
  return (
    <div style={{background:RPT_COLOURS.paleGreen,borderTop:`3px solid ${RPT_COLOURS.forest}`,borderRadius:4,padding:"16px 18px"}}>
      <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:17,lineHeight:1.2,color:RPT_COLOURS.forest,marginBottom:6}}>{d.name}</div>
      <div style={{display:"inline-block",fontSize:10,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"3px 8px",borderRadius:999,background:pillBg,color:pillColour,marginBottom:10,fontFamily:"'Inter',system-ui,sans-serif"}}>{d.stage}</div>
      <div style={{fontSize:13,lineHeight:1.55,color:"rgba(26,14,10,0.8)"}}>{d.interpretation}</div>
    </div>
  );
};

// Strength card — forest-green left bar on cream, Instrument Serif title in forest green.
const StrengthCard = ({title, body}) => (
  <div style={{background:RPT_COLOURS.paleGreen,padding:"18px 22px",borderRadius:10,marginBottom:12,borderLeft:`4px solid ${RPT_COLOURS.forest}`}}>
    <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:18,lineHeight:1.25,color:RPT_COLOURS.forest,marginBottom:6}}>{title}</div>
    <div style={{fontSize:14,lineHeight:1.6,color:"rgba(26,14,10,0.8)"}}>{body}</div>
  </div>
);

// Growth card — coral left bar on cream, Instrument Serif title in forest green.
const GrowthCard = ({title, body}) => (
  <div style={{background:RPT_COLOURS.paleTerra,padding:"18px 22px",borderRadius:10,marginBottom:12,borderLeft:`4px solid ${RPT_COLOURS.terracotta}`}}>
    <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:18,lineHeight:1.25,color:RPT_COLOURS.forest,marginBottom:6}}>{title}</div>
    <div style={{fontSize:14,lineHeight:1.6,color:"rgba(26,14,10,0.8)"}}>{body}</div>
  </div>
);

const ReportView = ({ data, type }) => {
  if (!data) return null;

  return (
    <div>
      {/* Type header: yellow sticker + type name as H1 + tagline */}
      <div style={{marginBottom:24}}>
        <span style={{display:"inline-block",background:RPT_COLOURS.yellow,color:RPT_COLOURS.ink,fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"5px 10px",borderRadius:3,transform:"rotate(-1.2deg)"}}>Your thinking with AI type</span>
        <h1 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:"clamp(42px,6vw,56px)",lineHeight:1.0,letterSpacing:"-0.015em",color:RPT_COLOURS.forest,marginTop:14,marginBottom:12}}>{type.name}</h1>
        <p style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:18,color:"rgba(44,76,63,0.85)",marginBottom:0}}>"{type.tagline}"</p>
      </div>

      {/* 1. Type overview (human-written) */}
      <RptSection kind="human">Type overview</RptSection>
      <RptP>
        {type.description}
        {type.nextChapter ? <> Your next chapter? {type.nextChapter}</> : null}
      </RptP>

      {/* 2. Personal diagnostic summary (AI) */}
      <RptSection kind="ai">Personal diagnostic summary</RptSection>
      <RptAddendum>
        As you read this AI-generated overview of your diagnostic results, think about what connections the summary makes that you haven't noticed before, what gaps it may have missed, and what questions it raises. Take those questions into the rest of the report; particularly as you take a look through your highlighted strengths and areas for growth.
      </RptAddendum>
      {(data.who_you_are || "").split("\n\n").map((p,i) => {
        // First paragraph is body; subsequent paragraphs render as yellow quote callouts.
        if (i === 0) return <RptP key={i}>{p}</RptP>;
        return (
          <div key={i} style={{background:RPT_COLOURS.yellow,color:RPT_COLOURS.ink,fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:18,lineHeight:1.5,padding:"16px 22px",margin:"16px 0",borderLeft:`4px solid ${RPT_COLOURS.forest}`,borderRadius:"0 10px 10px 0"}}>
            {p}
          </div>
        );
      })}

      {/* 2. Dimensions (human) */}
      <RptSection kind="human">Your dimensions</RptSection>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,alignItems:"start"}}>
        {(data.dimensions||[]).map((d,i) => <DimensionCard key={i} d={d}/>)}
      </div>

      {/* 3. Strengths (AI) */}
      <RptSection kind="ai">Your strengths</RptSection>
      <RptAddendum>
        These strengths are generated using AI based on your diagnostic responses and your <em>Thinking with AI</em> type. The AI looks for patterns in the responses you have given today, but this might not be the whole picture. At the same time as celebrating the positives, think about the bigger picture — don't accept sycophantic praise, consider the gaps in the AI's knowledge of you and your context, and look for any leaps in logic that may have led it to an odd conclusion. In other words, as with all AI output, read the following through a critical lens.
      </RptAddendum>
      {(data.strengths||[]).map((s,i) => <StrengthCard key={i} title={s.title} body={s.body}/>)}

      {/* 4. Areas for growth (AI) */}
      <RptSection kind="ai">Areas for growth</RptSection>
      <RptAddendum>
        As with the previous section, this is also generated with AI based on your responses to this diagnostic. The AI has been tasked with seeking out gaps, contradictions, or self-identified weaknesses in your responses, with the ultimate goal of challenging you to think about what your next steps might be. However, once again the tension is in what might be missing from a single diagnostic. Read these growth areas critically and ask yourself: are these truly areas that you need to grow in? Is the AI trying to push you in a direction that you disagree with or that doesn't fit your context? What can you take away from the AI response, and what might you ignore?
      </RptAddendum>
      {(data.growth_edges||[]).map((g,i) => <GrowthCard key={i} title={g.title} body={g.body}/>)}

      {/* 5. Next steps (hybrid) — circled numbers on the left, body on the right */}
      <RptSection kind="hybrid">Your next steps</RptSection>
      <RptAddendum>
        These next steps have been taken from ideas in the <em>Thinking with AI</em> book, and then adapted using AI to link them to your specific growth areas. Consider one or two that might work in your context. What would you need to change to make them fit your classroom culture? What could stay the same? How do they link with things you already do, and what small steps could you take to put them into practice next week?
      </RptAddendum>
      {(data.next_steps||[]).map((s,i) => (
        <div key={i} style={{display:"flex",gap:16,marginBottom:18,alignItems:"flex-start"}}>
          <div style={{flexShrink:0,width:32,height:32,borderRadius:"50%",background:RPT_COLOURS.forest,color:RPT_COLOURS.cream,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Instrument Serif',Georgia,serif",fontSize:16}}>{i+1}</div>
          <div style={{flex:1,paddingTop:3}}>
            <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:16,lineHeight:1.25,color:RPT_COLOURS.forest,marginBottom:4}}>{s.title}</div>
            <div style={{fontSize:14,lineHeight:1.6,color:"rgba(26,14,10,0.8)"}}>{s.body}</div>
          </div>
        </div>
      ))}

      {/* 6. Recommended reading (hybrid) */}
      <RptSection kind="hybrid">Recommended reading</RptSection>
      <RptAddendum>
        The following list has been generated from a human-curated list of books, articles, and blog posts tagged to each dimension of the <em>Thinking with AI</em> diagnostic, with AI narrowing the list down to a slightly more manageable number according to your type and areas for growth.
      </RptAddendum>
      {(data.reading||[]).map((r,i) => {
        const isUrl = r.source && /^https?:\/\//.test(r.source);
        const meta = [r.year, r.format].filter(Boolean).join(" · ");
        return (
          <div key={i} style={{background:RPT_COLOURS.paleGreen,borderLeft:`3px solid ${RPT_COLOURS.yellow}`,borderRadius:10,padding:"16px 20px",marginBottom:12}}>
            {meta && <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:RPT_COLOURS.forest,marginBottom:4,fontFamily:"'Inter',system-ui,sans-serif"}}>{meta}</div>}
            <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:17,lineHeight:1.25,color:RPT_COLOURS.forest,marginBottom:4}}>{r.title}</div>
            {r.author && (
              <div style={{fontSize:13,color:"rgba(26,14,10,0.65)",marginBottom:8}}>{r.author}</div>
            )}
            {r.context && (
              <div style={{fontSize:13,lineHeight:1.55,color:"rgba(26,14,10,0.8)"}}>{r.context}</div>
            )}
            {isUrl && (
              <a href={r.source} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:RPT_COLOURS.terracotta,marginTop:8,display:"inline-block",textDecoration:"none",fontWeight:500}}>
                Read it →
              </a>
            )}
          </div>
        );
      })}

      {/* 7. One thing to try this week — tilted dark block, no provenance icon */}
      <div style={{marginTop:44,marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${RPT_COLOURS.forest}`}}>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:22,lineHeight:1.1,color:RPT_COLOURS.forest}}>One thing to try this week</div>
      </div>
      <div style={{background:RPT_COLOURS.forest,color:RPT_COLOURS.cream,padding:"28px 32px",borderRadius:14,marginTop:8,transform:"rotate(-0.3deg)"}}>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:16,marginBottom:8,color:RPT_COLOURS.yellow}}>Try this:</div>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:22,lineHeight:1.35}}>{data.one_thing}</div>
      </div>

      {/* Ko-fi */}
      <div style={{textAlign:"center",marginTop:32,padding:"24px 28px",background:RPT_COLOURS.paleGreen,border:`2px dashed ${RPT_COLOURS.forest}`,borderRadius:14}}>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:20,color:RPT_COLOURS.forest,marginBottom:8}}>Found this useful?</div>
        <p style={{fontSize:13.5,color:"rgba(26,14,10,0.7)",marginBottom:16,lineHeight:1.6}}>This whole thing — the diagnostic, the report, the reading list — is free. If it landed, you can drop a few quid to keep it going.</p>
        <a href="https://ko-fi.com/" target="_blank" rel="noopener noreferrer" style={{
          display:"inline-block",background:RPT_COLOURS.forest,color:RPT_COLOURS.cream,
          padding:"10px 20px",borderRadius:999,fontSize:13,fontWeight:600,
          fontFamily:"'Inter',system-ui,sans-serif",textDecoration:"none",letterSpacing:"0.02em"
        }}>
          Support on Ko-fi
        </a>
      </div>

      {/* Footer disclaimer */}
      <div style={{textAlign:"center",marginTop:32,paddingTop:20,borderTop:"1px solid rgba(26,14,10,0.12)"}}>
        <div style={{fontSize:12,color:"rgba(26,14,10,0.55)",lineHeight:1.6,marginBottom:6}}>
          This report was generated based on your responses to the <em>Thinking with AI</em> diagnostic. AI-generated responses might not be accurate — check all outputs before use.
        </div>
        <div style={{fontSize:12,color:"rgba(26,14,10,0.55)"}}>
          Based on the book <em>Thinking with AI</em> by Amelia King · www.thinkingwithai.co · www.amelia-king.com
        </div>
      </div>
    </div>
  );
};

const ReportLoading = () => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:28,fontStyle:"italic",color:RPT_COLOURS.forest,marginBottom:8}}>
          Generating your personalised report{dots}
        </div>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:14,color:"rgba(44,76,63,0.6)",marginBottom:28}}>
          This takes about 10–15 seconds
        </div>
        <div style={{width:200,height:4,background:"rgba(44,76,63,0.12)",borderRadius:2,margin:"0 auto",overflow:"hidden"}}>
          <div style={{height:"100%",background:RPT_COLOURS.terracotta,borderRadius:2,width:"30%",animation:"rptload 2s ease infinite"}}/>
        </div>
        <style>{`@keyframes rptload{0%{transform:translateX(-100%)}50%{transform:translateX(350%)}100%{transform:translateX(-100%)}}`}</style>
      </div>
    </div>
  );
};

// ─── REPORT PAGE (separate screen) ──────────────────────────────────
const ReportPage = ({ type, answers, onBack }) => {
  const [reportData, setReportData] = useState(null);
  const [reportError, setReportError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const dims = calcDimensions(answers);
  const reportRef = useRef(null);

  const reportFetchStarted = useRef(false);

  useEffect(() => {
    // StrictMode in dev mode runs effects twice. Guard against paying for
    // two API calls by tracking whether we've already started.
    if (reportFetchStarted.current) return;
    reportFetchStarted.current = true;

    (async () => {
      try {
        // Build answer context: for each answered question, send the text and the 1-7 rating.
        // The prompt asks the AI to reference specific quiz wording the person agreed or
        // disagreed with, so it needs to see those answers, not just dimension averages.
        const answerLines = QUESTIONS.map((q, i) => {
          const raw = answers[i];
          if (raw == null) return null;
          const label = raw >= 6 ? "strongly agree" : raw >= 5 ? "agree" : raw === 4 ? "neutral" : raw >= 2 ? "disagree" : "strongly disagree";
          return `Q${q.id} [${q.dims.join("/")}${q.r ? " (reversed)" : ""}]: "${q.s}" — answered ${raw}/7 (${label})`;
        }).filter(Boolean).join("\n");

        // Determine the person's bottom-2 dimensions (their growth areas),
        // and shortlist reading based on type + those dims.
        const dimKeys = ["D1","D2","D3","D4","D5"];
        const sortedDims = [...dimKeys].sort((a,b) => dims[a] - dims[b]);
        const growthDims = sortedDims.slice(0, 2);
        const shortlist = shortlistReading(type.name, growthDims);
        const readingBlock = shortlist.map(formatResourceForPrompt).join("\n");

        const userMsg = `Type: ${type.name}
Tagline: "${type.tagline}"

Dimension averages (1–7):
D1 Metacognitive Awareness: ${dims.D1.toFixed(1)}
D2 Critical Thinking Integration: ${dims.D2.toFixed(1)}
D3 Cognitive Offloading Literacy: ${dims.D3.toFixed(1)}
D4 Science of Learning: ${dims.D4.toFixed(1)}
D5 Culture & Modelling: ${dims.D5.toFixed(1)}

Their answers to all 36 quiz questions (reversed means the question is phrased so that disagreement scores high on the dimension):
${answerLines}

SHORTLISTED READING (pick 3-5 from this list only — these are filtered to their type and growth-area dimensions):
${readingBlock}`;

        const res = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 4096,
            system: REPORT_PROMPT,
            messages: [{ role: "user", content: userMsg }]
          })
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`API error (${res.status}): ${errText.slice(0, 200)}`);
        }

        // Parse the SSE stream. Anthropic emits events like:
        //   event: content_block_delta
        //   data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"..."}}
        // We care about the text_delta chunks, which we concatenate.
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let text = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // SSE events are separated by blank lines (\n\n). Process whole events,
          // keep any trailing partial event in the buffer for the next read.
          const events = buffer.split("\n\n");
          buffer = events.pop() || "";
          for (const ev of events) {
            // Each event has one or more "key: value" lines. We want the `data:` line.
            for (const line of ev.split("\n")) {
              if (!line.startsWith("data:")) continue;
              const jsonStr = line.slice(5).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;
              try {
                const obj = JSON.parse(jsonStr);
                if (obj.type === "content_block_delta" && obj.delta?.type === "text_delta") {
                  text += obj.delta.text || "";
                }
              } catch { /* ignore malformed event lines */ }
            }
          }
        }

        const clean = text.replace(/```json|```/g, "").trim();
        try {
          setReportData(JSON.parse(clean));
        } catch (parseErr) {
          // The most common parse failure is the response being cut off
          // mid-string — usually because we hit max_tokens. Give the user
          // a friendlier explanation and ask them to retry.
          if (/unterminated|unexpected end/i.test(parseErr.message)) {
            throw new Error("The report got cut off while being generated. This usually clears up on a retry — please refresh and try again. If it keeps happening, let us know.");
          }
          throw parseErr;
        }
      } catch (e) {
        setReportError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownloadPDF = async () => {
    if (pdfGenerating || !reportData) return;
    setPdfGenerating(true);
    try {
      const jspdfModule = await import(/* webpackChunkName: "jspdf" */ "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm");
      const { jsPDF } = jspdfModule;
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      // R2 palette in RGB triples for jsPDF.
      const c = {
        ground:     [255, 232, 212],   // peach — page background
        ink:        [26, 14, 10],      // deep ink — primary text
        inkSoft:    [70, 55, 48],      // muted ink for body
        inkFaint:   [130, 115, 108],   // footer, fine print
        forest:     [44, 76, 63],      // section headings, type name, dim card top
        forestSoft: [80, 100, 90],     // addendum text, muted serif
        coral:      [255, 90, 95],     // growth borders, dev-stage pills
        yellow:     [255, 237, 78],    // highlights, sticker, quote callout, hybrid
        cream:      [255, 250, 242],   // card fill
      };

      // ── Geometry ────────────────────────────────────────────────────
      const pageW = doc.internal.pageSize.getWidth();   // 595pt for A4
      const pageH = doc.internal.pageSize.getHeight();  // 842pt for A4
      const margin = 48;
      const contentW = pageW - margin * 2;
      const footerY = pageH - 40;                       // y of footer text baseline
      const contentBottom = pageH - 64;                 // y below which content shouldn't go

      // ── Colour helpers ──────────────────────────────────────────────
      const fill = (rgb) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      const stroke = (rgb) => doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      const txt = (rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);

      // ── Page background + footer ────────────────────────────────────
      const drawPageBackground = () => {
        fill(c.ground);
        doc.rect(0, 0, pageW, pageH, "F");
      };
      const drawFooter = (pageNum) => {
        doc.setFont("times", "italic");
        doc.setFontSize(9);
        txt(c.inkFaint);
        const footText = `Thinking with AI · A diagnostic for teachers by Amelia King`;
        doc.text(footText, margin, footerY);
        doc.text(`p. ${pageNum}`, pageW - margin, footerY, { align: "right" });
      };
      const startPage = () => { drawPageBackground(); };

      // First page is created automatically by jsPDF — prime it.
      startPage();

      // ── Provenance icons ───────────────────────────────────────────
      const drawProvenanceIcon = (cx, cy, size, kind) => {
        const r = size / 2;
        if (kind === "human") {
          fill(c.forest);
          doc.circle(cx, cy, r, "F");
        } else if (kind === "ai") {
          // Triangle — filled coral
          fill(c.coral);
          const top = [cx, cy - r];
          const left = [cx - r * 0.9, cy + r * 0.6];
          const right = [cx + r * 0.9, cy + r * 0.6];
          doc.triangle(top[0], top[1], left[0], left[1], right[0], right[1], "F");
        } else if (kind === "hybrid") {
          // Yellow square with ink outline
          fill(c.yellow);
          stroke(c.ink);
          doc.setLineWidth(1.2);
          doc.rect(cx - r, cy - r, size, size, "FD");
        }
      };

      // ── Page-break helper ──────────────────────────────────────────
      let currentPage = 1;
      let y = 0;
      const ensureSpace = (needed) => {
        if (y + needed > contentBottom) {
          doc.addPage();
          currentPage += 1;
          startPage();
          y = margin + 20;
        }
      };

      // ── Text helpers ───────────────────────────────────────────────
      // jsPDF split-text-to-size for wrapping within contentW.
      const wrap = (text, width = contentW, fontSize = 11) => {
        doc.setFontSize(fontSize);
        return doc.splitTextToSize(String(text || ""), width);
      };
      // Render a paragraph of wrapped lines. Returns new y.
      const writePara = (text, opts = {}) => {
        const {
          x = margin,
          width = contentW,
          fontSize = 11,
          lineHeight = 15.5,
          font = "helvetica",
          style = "normal",
          color = c.ink,
          spaceAfter = 12,
        } = opts;
        doc.setFont(font, style);
        doc.setFontSize(fontSize);
        txt(color);
        const lines = doc.splitTextToSize(String(text || ""), width);
        for (const line of lines) {
          ensureSpace(lineHeight);
          doc.text(line, x, y);
          y += lineHeight;
        }
        y += spaceAfter;
      };

      // ── Rounded rectangle helper ───────────────────────────────────
      // jsPDF 2.5 has `roundedRect` natively.
      const drawCard = (x, yPos, w, h, radius, fillRgb, strokeRgb, lineWidth) => {
        if (fillRgb) { fill(fillRgb); }
        if (strokeRgb) { stroke(strokeRgb); doc.setLineWidth(lineWidth || 1); }
        const style = fillRgb && strokeRgb ? "FD" : fillRgb ? "F" : "S";
        doc.roundedRect(x, yPos, w, h, radius, radius, style);
      };

      // ── Section heading ────────────────────────────────────────────
      // Draws: forest-serif title on the left, provenance icon on the right,
      // thin forest underline beneath. Reserves enough space for the heading
      // PLUS a few body lines beneath, so a heading never strands at the
      // bottom of a page alone.
      const drawSectionHead = (title, kind) => {
        const titleSize = 20;
        // 42 = heading area; add ~80 for lookahead of addendum/body content
        ensureSpace(42 + 80);
        y += 28; // top padding before section
        // Title (serif, forest)
        doc.setFont("times", "normal");
        doc.setFontSize(titleSize);
        txt(c.forest);
        doc.text(title, margin, y + 14);
        // Icon on right (if any)
        if (kind) {
          drawProvenanceIcon(pageW - margin - 6, y + 8, 10, kind);
        }
        y += 20;
        // Underline
        stroke(c.forest);
        doc.setLineWidth(0.75);
        doc.line(margin, y + 6, pageW - margin, y + 6);
        y += 16;
      };

      // ── Addendum (italic forest-green explainer) ───────────────────
      const drawAddendum = (text) => {
        writePara(text, {
          font: "times", style: "italic",
          fontSize: 10.5, lineHeight: 14.5,
          color: c.forestSoft, spaceAfter: 14,
        });
      };

      // ═══════════════════════════════════════════════════════════════
      // PAGE 1 — HEADER
      // ═══════════════════════════════════════════════════════════════

      // Top nav: small italic logo on left, inline legend on right
      doc.setFont("times", "italic");
      doc.setFontSize(13);
      txt(c.forest);
      // Logo dot
      fill(c.coral);
      doc.circle(margin + 4, margin + 12, 3, "F");
      doc.text("Thinking with AI", margin + 12, margin + 16);

      // Legend on the top-right — small shapes with labels
      // Each item renders label then icon LEFT of it, right-anchored from a running X.
      const legendY = margin + 14;
      let legX = pageW - margin;
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      txt(c.forestSoft);
      // Right-align each item: label's right edge is at rightX; then icon sits to the
      // left of the label with a small gap; then the next item's rightX is to the
      // left of the icon with a larger gap between items.
      const drawLegendItem = (label, kind, rightX) => {
        doc.text(label, rightX, legendY, { align: "right" });
        const labelW = doc.getTextWidth(label);
        const iconCX = rightX - labelW - 6 - 4; // 6pt gap after icon, 4pt = half icon
        drawProvenanceIcon(iconCX, legendY - 2.5, 8, kind);
        return iconCX - 4 - 14; // new rightX for next item: past icon + gap
      };
      legX = drawLegendItem("hybrid", "hybrid", legX);
      legX = drawLegendItem("AI", "ai", legX);
      legX = drawLegendItem("human", "human", legX);

      y = margin + 56;

      // Yellow sticker "Your thinking with AI type"
      const stickerText = "YOUR THINKING WITH AI TYPE";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const stickerW = doc.getTextWidth(stickerText) + 14;
      const stickerH = 16;
      fill(c.yellow);
      doc.rect(margin, y, stickerW, stickerH, "F");
      txt(c.ink);
      doc.text(stickerText, margin + 7, y + 11);
      y += stickerH + 14;

      // Type name — big serif, forest green
      doc.setFont("times", "normal");
      doc.setFontSize(36);
      txt(c.forest);
      // Simulate the clamp: just use 36pt on A4 which is roughly the size at desktop.
      const nameLines = doc.splitTextToSize(type.name, contentW);
      for (const line of nameLines) { doc.text(line, margin, y + 28); y += 34; }
      y += 4;

      // Tagline (italic serif, muted forest)
      doc.setFont("times", "italic");
      doc.setFontSize(13);
      txt(c.forestSoft);
      doc.text(`"${type.tagline}"`, margin, y + 10);
      y += 20;

      // ═══════════════════════════════════════════════════════════════
      // 1. TYPE OVERVIEW (human)
      // ═══════════════════════════════════════════════════════════════
      drawSectionHead("Type overview", "human");
      writePara(
        type.description +
          (type.nextChapter ? ` Your next chapter? ${type.nextChapter}` : ""),
        { fontSize: 11, lineHeight: 15.5, color: c.ink, spaceAfter: 8 }
      );

      // ═══════════════════════════════════════════════════════════════
      // 2. PERSONAL DIAGNOSTIC SUMMARY (AI)
      // ═══════════════════════════════════════════════════════════════
      drawSectionHead("Personal diagnostic summary", "ai");
      drawAddendum(
        "As you read this AI-generated overview of your diagnostic results, think about what connections the summary makes that you haven't noticed before, what gaps it may have missed, and what questions it raises. Take those questions into the rest of the report; particularly as you take a look through your highlighted strengths and areas for growth."
      );
      // First paragraph = body; subsequent = yellow quote callouts
      const summaryParas = (reportData.who_you_are || "").split(/\n\n+/);
      for (let i = 0; i < summaryParas.length; i++) {
        const p = summaryParas[i].trim();
        if (!p) continue;
        if (i === 0) {
          writePara(p, { fontSize: 11, lineHeight: 15.5, color: c.ink, spaceAfter: 14 });
        } else {
          // Yellow callout card with forest-green left border
          const lines = wrap(p, contentW - 32, 11);
          const padY = 14, padX = 18;
          const boxH = padY * 2 + lines.length * 16;
          ensureSpace(boxH + 12);
          // Yellow fill
          drawCard(margin, y, contentW, boxH, 6, c.yellow, null);
          // Forest left border
          fill(c.forest);
          doc.rect(margin, y, 4, boxH, "F");
          // Italic serif text
          doc.setFont("times", "italic");
          doc.setFontSize(11);
          txt(c.ink);
          let ty = y + padY + 10;
          for (const line of lines) { doc.text(line, margin + padX, ty); ty += 16; }
          y += boxH + 12;
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // 3. YOUR DIMENSIONS (human)
      // ═══════════════════════════════════════════════════════════════
      drawSectionHead("Your dimensions", "human");
      // 2-column grid. For each card: forest top border, cream fill, name (serif),
      // stage pill, interpretation body.
      {
        const dims = reportData.dimensions || [];
        const gutter = 12;
        const colW = (contentW - gutter) / 2;
        const topBorderHeight = 3;
        const cardPadX = 14;
        const cardPadY = 14;
        const nameSize = 13.5;
        const pillH = 14;
        const bodySize = 9.5;
        const bodyLineHeight = 13;
        // Compute card heights in pairs so both cards in a row share height.
        const cardHeights = dims.map(d => {
          const bodyLines = wrap(d.interpretation || "", colW - cardPadX * 2, bodySize);
          return cardPadY * 2 + nameSize + 4 + pillH + 8 + bodyLines.length * bodyLineHeight;
        });
        for (let i = 0; i < dims.length; i += 2) {
          const d1 = dims[i];
          const d2 = dims[i + 1];
          const rowH = Math.max(cardHeights[i] || 0, cardHeights[i + 1] || 0) + topBorderHeight;
          ensureSpace(rowH + 14);
          const cards = [d1, d2].filter(Boolean);
          cards.forEach((d, idx) => {
            const x = margin + idx * (colW + gutter);
            // Forest top border
            fill(c.forest);
            doc.rect(x, y, colW, topBorderHeight, "F");
            // Cream card body
            fill(c.cream);
            doc.rect(x, y + topBorderHeight, colW, rowH - topBorderHeight, "F");
            // Name (serif, forest)
            doc.setFont("times", "normal");
            doc.setFontSize(nameSize);
            txt(c.forest);
            doc.text(d.name, x + cardPadX, y + topBorderHeight + cardPadY + nameSize - 2);
            // Stage pill
            const stage = (d.stage || "").toLowerCase();
            const isHigh = stage === "established" || stage === "leading";
            const isDev  = stage === "developing";
            const isLow  = stage === "early" || stage === "emerging";
            const pillBg = isHigh ? c.forest : isDev ? c.coral : isLow ? c.yellow : c.forest;
            const pillTxt = isLow ? c.forest : c.ground;
            const pillLabel = (d.stage || "").toUpperCase();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            const pillTextW = doc.getTextWidth(pillLabel);
            const pillW = pillTextW + 14;
            const pillX = x + cardPadX;
            const pillY = y + topBorderHeight + cardPadY + nameSize + 6;
            fill(pillBg);
            doc.roundedRect(pillX, pillY, pillW, pillH, pillH / 2, pillH / 2, "F");
            txt(pillTxt);
            doc.text(pillLabel, pillX + 7, pillY + pillH - 4);
            // Body text
            doc.setFont("helvetica", "normal");
            doc.setFontSize(bodySize);
            txt(c.inkSoft);
            const bodyLines = wrap(d.interpretation || "", colW - cardPadX * 2, bodySize);
            let by = pillY + pillH + 12;
            for (const line of bodyLines) {
              doc.text(line, x + cardPadX, by);
              by += bodyLineHeight;
            }
          });
          y += rowH + 12;
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // 4. YOUR STRENGTHS (AI)
      // ═══════════════════════════════════════════════════════════════
      drawSectionHead("Your strengths", "ai");
      drawAddendum(
        "These strengths are generated using AI based on your diagnostic responses and your 'Thinking with AI' type. The AI looks for patterns in the responses you have given today, but this might not be the whole picture. At the same time as celebrating the positives, think about the bigger picture — don't accept sycophantic praise, consider the gaps in the AI's knowledge of you and your context, and look for any leaps in logic that may have led it to an odd conclusion. In other words, as with all AI output, read the following through a critical lens."
      );
      for (const s of (reportData.strengths || [])) {
        drawSgCard(s, c.forest);
      }

      // ═══════════════════════════════════════════════════════════════
      // 5. AREAS FOR GROWTH (AI)
      // ═══════════════════════════════════════════════════════════════
      drawSectionHead("Areas for growth", "ai");
      drawAddendum(
        "As with the previous section, this is also generated with AI based on your responses to this diagnostic. The AI has been tasked with seeking out gaps, contradictions, or self-identified weaknesses in your responses, with the ultimate goal of challenging you to think about what your next steps might be. However, once again the tension is in what might be missing from a single diagnostic. Read these growth areas critically and ask yourself: are these truly areas that you need to grow in? Is the AI trying to push you in a direction that you disagree with or that doesn't fit your context? What can you take away from the AI response, and what might you ignore?"
      );
      for (const g of (reportData.growth_edges || [])) {
        drawSgCard(g, c.coral);
      }

      // (helper for strength/growth — coloured left border on cream card)
      function drawSgCard(item, borderColour) {
        const padX = 18, padY = 14;
        const titleSize = 13, bodySize = 10.5, bodyLineHeight = 14;
        const title = item.title || "";
        const body = item.body || "";
        const bodyLines = wrap(body, contentW - padX * 2, bodySize);
        const titleLines = wrap(title, contentW - padX * 2, titleSize);
        const cardH = padY * 2 + titleLines.length * 16 + 4 + bodyLines.length * bodyLineHeight;
        ensureSpace(cardH + 10);
        // Cream card
        fill(c.cream);
        doc.roundedRect(margin, y, contentW, cardH, 8, 8, "F");
        // Coloured left border (4pt wide, full card height)
        fill(borderColour);
        doc.rect(margin, y, 4, cardH, "F");
        // Title (serif, forest)
        doc.setFont("times", "normal");
        doc.setFontSize(titleSize);
        txt(c.forest);
        let ty = y + padY + titleSize - 1;
        for (const line of titleLines) { doc.text(line, margin + padX, ty); ty += 16; }
        // Body
        doc.setFont("helvetica", "normal");
        doc.setFontSize(bodySize);
        txt(c.inkSoft);
        ty += 4;
        for (const line of bodyLines) { doc.text(line, margin + padX, ty); ty += bodyLineHeight; }
        y += cardH + 10;
      }

      // ═══════════════════════════════════════════════════════════════
      // 6. YOUR NEXT STEPS (hybrid)
      // ═══════════════════════════════════════════════════════════════
      drawSectionHead("Your next steps", "hybrid");
      drawAddendum(
        "These next steps have been taken from ideas in the 'Thinking with AI' book, and then adapted using AI to link them to your specific growth areas. Consider one or two that might work in your context. What would you need to change to make them fit your classroom culture? What could stay the same? How do they link with things you already do, and what small steps could you take to put them into practice next week?"
      );
      (reportData.next_steps || []).forEach((s, i) => {
        const padY = 4;
        const circleR = 12;
        const circleCX = margin + circleR;
        const titleX = margin + circleR * 2 + 12;
        const titleW = contentW - circleR * 2 - 12;
        const titleSize = 12, bodySize = 10, bodyLineHeight = 13.5;
        const titleLines = wrap(s.title || "", titleW, titleSize);
        const bodyLines = wrap(s.body || "", titleW, bodySize);
        const rowH = Math.max(circleR * 2 + 4, titleLines.length * 15 + 4 + bodyLines.length * bodyLineHeight) + padY * 2;
        ensureSpace(rowH + 8);
        // Forest circle
        fill(c.forest);
        doc.circle(circleCX, y + circleR + padY, circleR, "F");
        // Number (serif, cream)
        doc.setFont("times", "normal");
        doc.setFontSize(13);
        txt(c.ground);
        doc.text(String(i + 1), circleCX, y + circleR + padY + 4.5, { align: "center" });
        // Title (serif, forest)
        doc.setFont("times", "normal");
        doc.setFontSize(titleSize);
        txt(c.forest);
        let ty = y + padY + titleSize + 2;
        for (const line of titleLines) { doc.text(line, titleX, ty); ty += 15; }
        // Body
        doc.setFont("helvetica", "normal");
        doc.setFontSize(bodySize);
        txt(c.inkSoft);
        ty += 2;
        for (const line of bodyLines) { doc.text(line, titleX, ty); ty += bodyLineHeight; }
        y += rowH + 8;
      });

      // ═══════════════════════════════════════════════════════════════
      // 7. RECOMMENDED READING (hybrid)
      // ═══════════════════════════════════════════════════════════════
      drawSectionHead("Recommended reading", "hybrid");
      drawAddendum(
        "The following list has been generated from a human-curated list of books, articles, and blog posts tagged to each dimension of the 'Thinking with AI' diagnostic, with AI narrowing the list down to a slightly more manageable number according to your type and areas for growth."
      );
      for (const r of (reportData.reading || [])) {
        const padX = 18, padY = 14;
        const meta = [r.year, r.format].filter(Boolean).join(" · ");
        const titleSize = 13, authorSize = 10, ctxSize = 10, lineH = 13.5;
        const titleLines = wrap(r.title || "", contentW - padX * 2, titleSize);
        const ctxLines = r.context ? wrap(r.context, contentW - padX * 2, ctxSize) : [];
        const authorLine = r.author ? 1 : 0;
        const metaLine = meta ? 1 : 0;
        const cardH = padY * 2 +
          metaLine * 13 +
          titleLines.length * 16 +
          authorLine * 14 +
          (ctxLines.length ? (6 + ctxLines.length * lineH) : 0);
        ensureSpace(cardH + 10);
        // Cream fill
        fill(c.cream);
        doc.roundedRect(margin, y, contentW, cardH, 8, 8, "F");
        // Yellow left border
        fill(c.yellow);
        doc.rect(margin, y, 3, cardH, "F");
        // Meta (small caps style)
        let ty = y + padY;
        if (meta) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          txt(c.forest);
          doc.text(meta.toUpperCase(), margin + padX, ty + 8);
          ty += 13;
        }
        // Title (serif, forest)
        doc.setFont("times", "normal");
        doc.setFontSize(titleSize);
        txt(c.forest);
        ty += titleSize - 2;
        for (const line of titleLines) { doc.text(line, margin + padX, ty); ty += 16; }
        // Author
        if (r.author) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(authorSize);
          txt(c.inkFaint);
          doc.text(r.author, margin + padX, ty);
          ty += 14;
        }
        // Context
        if (ctxLines.length) {
          ty += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(ctxSize);
          txt(c.inkSoft);
          for (const line of ctxLines) { doc.text(line, margin + padX, ty); ty += lineH; }
        }
        y += cardH + 10;
      }

      // ═══════════════════════════════════════════════════════════════
      // 8. ONE THING TO TRY THIS WEEK — dark forest block, no provenance
      // ═══════════════════════════════════════════════════════════════
      {
        // Section heading (same style as others but no icon) — needs lookahead too
        ensureSpace(42 + 140);
        y += 28;
        doc.setFont("times", "normal");
        doc.setFontSize(20);
        txt(c.forest);
        doc.text("One thing to try this week", margin, y + 14);
        y += 20;
        stroke(c.forest);
        doc.setLineWidth(0.75);
        doc.line(margin, y + 6, pageW - margin, y + 6);
        y += 16;

        // Dark forest block with yellow label
        const oneThing = reportData.one_thing || "";
        const contentLines = wrap(oneThing, contentW - 48, 13);
        const padY = 22, padX = 28;
        const boxH = padY * 2 + 18 + 6 + contentLines.length * 17;
        ensureSpace(boxH + 12);
        fill(c.forest);
        doc.roundedRect(margin, y, contentW, boxH, 10, 10, "F");
        // Label
        doc.setFont("times", "italic");
        doc.setFontSize(11);
        txt(c.yellow);
        doc.text("Try this:", margin + padX, y + padY + 4);
        // Body (italic serif, cream)
        doc.setFont("times", "italic");
        doc.setFontSize(13);
        txt(c.ground);
        let ty = y + padY + 24;
        for (const line of contentLines) { doc.text(line, margin + padX, ty); ty += 17; }
        y += boxH + 20;
      }

      // ═══════════════════════════════════════════════════════════════
      // KO-FI CARD (dashed border)
      // ═══════════════════════════════════════════════════════════════
      {
        const bodyText = "This whole thing — the diagnostic, the report, the reading list — is free. If it landed, you can drop a few quid to keep it going.";
        const bodyLines = wrap(bodyText, contentW - 56, 10.5);
        const titleH = 22;
        const btnH = 24;
        const padY = 20;
        const boxH = padY * 2 + titleH + 6 + bodyLines.length * 14 + 14 + btnH;
        ensureSpace(boxH + 12);
        // Dashed forest border — approximate with multiple short strokes since
        // jsPDF's setLineDashPattern isn't supported in all builds. We'll use
        // solid thin forest outline for reliability.
        stroke(c.forest);
        doc.setLineWidth(1.5);
        doc.roundedRect(margin, y, contentW, boxH, 10, 10, "S");
        // Title (serif, forest, centred)
        doc.setFont("times", "normal");
        doc.setFontSize(17);
        txt(c.forest);
        doc.text("Found this useful?", pageW / 2, y + padY + 12, { align: "center" });
        // Body
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        txt(c.inkSoft);
        let ty = y + padY + titleH + 8;
        for (const line of bodyLines) { doc.text(line, pageW / 2, ty, { align: "center" }); ty += 14; }
        // Button (pill shape) — forest fill, cream text
        const btnLabel = "Support on Ko-fi";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        const btnW = doc.getTextWidth(btnLabel) + 28;
        const btnX = (pageW - btnW) / 2;
        const btnY = ty + 4;
        fill(c.forest);
        doc.roundedRect(btnX, btnY, btnW, btnH, btnH / 2, btnH / 2, "F");
        txt(c.ground);
        doc.text(btnLabel, pageW / 2, btnY + btnH - 8, { align: "center" });
        y += boxH + 16;
      }

      // ═══════════════════════════════════════════════════════════════
      // FOOTER DISCLAIMER
      // ═══════════════════════════════════════════════════════════════
      y += 8;
      ensureSpace(40);
      stroke(c.inkFaint);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      txt(c.inkFaint);
      const d1 = "This report was generated based on your responses to the Thinking with AI diagnostic. AI-generated responses might not be accurate — check all outputs before use.";
      const d2 = "Based on the book Thinking with AI by Amelia King · www.thinkingwithai.co · www.amelia-king.com";
      const d1Lines = doc.splitTextToSize(d1, contentW);
      for (const line of d1Lines) { doc.text(line, pageW / 2, y, { align: "center" }); y += 11; }
      y += 4;
      const d2Lines = doc.splitTextToSize(d2, contentW);
      for (const line of d2Lines) { doc.text(line, pageW / 2, y, { align: "center" }); y += 11; }

      // ═══════════════════════════════════════════════════════════════
      // Add footer on every page (runs over all created pages)
      // ═══════════════════════════════════════════════════════════════
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(i);
      }

      // Save
      const safeName = type.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      doc.save(`thinking-with-ai-report-${safeName}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
      window.print();
    } finally {
      setPdfGenerating(false);
    }
  };

  if (loading) return <ReportLoading />;

  // If we landed here via ?view=report, we're in a separate tab — "back" means close the tab.
  // Otherwise we're in the same-tab flow and onBack navigates back to results.
  const isNewTab = typeof window !== "undefined" && window.location.search.includes("view=report");
  const backLabel = isNewTab ? "Close tab" : "← Back to results";
  const handleBack = () => {
    if (isNewTab) {
      window.close();
      // If window.close() is blocked (some browsers block it for tabs not explicitly
      // opened by script in the same session), fall back to showing the results here.
      setTimeout(() => onBack(), 100);
    } else {
      onBack();
    }
  };

  if (reportError) return (
    <div style={{minHeight:"100vh",background:RPT_COLOURS.cream,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <div style={{textAlign:"center",maxWidth:420}}>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:"clamp(28px,4vw,40px)",fontStyle:"italic",color:RPT_COLOURS.forest,marginBottom:10,lineHeight:1.1}}>Something went wrong</div>
        <p style={{fontSize:14,color:"rgba(44,76,63,0.75)",marginBottom:24,lineHeight:1.55}}>{reportError}</p>
        <button onClick={handleBack} style={{
          background:RPT_COLOURS.forest,color:RPT_COLOURS.cream,border:"none",borderRadius:999,
          padding:"12px 26px",fontSize:13,fontWeight:600,
          cursor:"pointer",fontFamily:"'Inter',system-ui,sans-serif",letterSpacing:"0.03em"
        }}>{isNewTab ? "Close tab" : "Go back to results"}</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:RPT_COLOURS.cream,padding:"0 1.5rem 3rem"}}>
      {/* Top nav bar — back on the left, legend + download on the right */}
      <div className="no-print" style={{position:"sticky",top:0,zIndex:10,background:"rgba(255,232,212,0.95)",backdropFilter:"blur(8px)",borderBottom:`1px solid rgba(44,76,63,0.12)`,padding:"14px 0",marginBottom:"28px"}}>
        <div style={{maxWidth:760,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",gap:18,flexWrap:"wrap"}}>
          <button onClick={handleBack} style={{background:"none",border:"none",color:RPT_COLOURS.forest,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',system-ui,sans-serif"}}>
            {backLabel}
          </button>
          <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
            <ProvenanceLegend/>
            <button onClick={handleDownloadPDF} disabled={pdfGenerating || !reportData} style={{
              background:RPT_COLOURS.forest,color:RPT_COLOURS.cream,border:"none",borderRadius:999,
              padding:"8px 18px",fontSize:12.5,fontWeight:600,
              cursor: pdfGenerating ? "default" : "pointer",
              opacity: pdfGenerating ? 0.6 : 1,
              fontFamily:"'Inter',system-ui,sans-serif",
              display:"flex",alignItems:"center",gap:"0.4rem",
              letterSpacing:"0.02em"
            }}>
              {pdfGenerating ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:"twaspin 0.8s linear infinite"}}>
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report content — flows directly on the peach ground, header is inside ReportView */}
      <div ref={reportRef} style={{maxWidth:760,margin:"0 auto",padding:"0 16px"}}>
        <ReportView data={reportData} type={type} />
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          div { break-inside: avoid; }
        }
        @keyframes twaspin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ─── RESULT SCREEN ──────────────────────────────────────────────────
const ResultScreen = ({ type, answers, onRestart, onViewReport }) => {
  const [copyState, setCopyState] = useState("idle");     // idle | copied | failed
  const [downloadState, setDownloadState] = useState("idle"); // idle | downloaded
  const [imgLoaded, setImgLoaded] = useState(false);
  const [openTypeId, setOpenTypeId] = useState(type.id);   // accordion: user's own type open by default

  // Type-specific hashtag generated from the type name.
  // "The Curious Experimenter" → "#TheCuriousExperimenter"
  const typeHashtag = "#" + type.name.replace(/\s+/g, "");

  // The text that gets copied to clipboard and shared on socials.
  const shareText = `I just took the Thinking with AI diagnostic.

My type: ${type.name} — "${type.tagline}"

Find out your type: www.thinkingwithai.co/diagnostic

#ThinkingWithAI #AIinEducation #EdTech #MetacognitionMatters ${typeHashtag}`;

  const imgSrc = `/type-images/${type.id}.png`;

  // Robust clipboard copy. Modern API first, falls back to execCommand.
  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; }
      catch (e) { /* fall through */ }
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.top = "-1000px"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  };

  const copyText = async () => {
    const ok = await copyToClipboard(shareText);
    setCopyState(ok ? "copied" : "failed");
    setTimeout(() => setCopyState("idle"), ok ? 2000 : 4000);
  };

  const downloadImage = async () => {
    try {
      const res = await fetch(imgSrc);
      if (!res.ok) throw new Error("image not available");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thinking-with-ai-${type.id}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadState("downloaded");
      setTimeout(() => setDownloadState("idle"), 2000);
    } catch (e) {
      alert("The graphic isn't available yet. You can still copy the text and share.");
    }
  };

  // Open a social platform's compose/share page after copying the post text.
  // The user pastes (Cmd+V) into the platform's compose box. Some platforms
  // (X, Bluesky) accept pre-filled text via URL params; LinkedIn and Facebook
  // don't reliably, so we always copy first as a fallback.
  const openPlatform = async (url) => {
    await copyToClipboard(shareText);
    window.open(url, "_blank", "noopener");
  };

  const shareTweetText = encodeURIComponent(shareText);
  const shareTarget = encodeURIComponent("https://www.thinkingwithai.co/diagnostic");
  const platforms = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/feed/?shareActive=true",
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>,
    },
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?text=${shareTweetText}`,
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>,
    },
    {
      name: "Bluesky",
      url: `https://bsky.app/intent/compose?text=${shareTweetText}`,
      icon: <path d="M5.683 4.26c2.965 2.27 6.153 6.868 7.317 9.335 1.164-2.467 4.352-7.065 7.317-9.335 2.14-1.637 5.608-2.903 5.608.94 0 .77-.44 6.45-.7 7.374-.898 3.214-4.136 4.035-7.016 3.548 5.036.858 6.32 3.71 3.553 6.56-5.254 5.416-7.55-1.36-8.139-3.097-.108-.32-.158-.469-.158-.343 0-.126-.05.023-.158.343-.588 1.738-2.885 8.513-8.139 3.097-2.766-2.85-1.483-5.702 3.553-6.56-2.88.487-6.118-.334-7.016-3.548C.86 11.65.42 5.97.42 5.2c0-3.843 3.468-2.577 5.608-.94z"/>,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareTarget}`,
      icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
    },
  ];

  // Ordered list of types for the accordion, resolved through the global TYPES array.
  const orderedTypes = TYPES_DISPLAY_ORDER.map(id => TYPES.find(t => t.id === id)).filter(Boolean);

  return (
    <div style={{minHeight:"100vh",background:D2.ground,position:"relative",overflow:"hidden",color:D2.ink,fontFamily:"'Inter',system-ui,sans-serif"}}>
      {/* Decorative corner circles */}
      <div style={{position:"absolute",top:-100,right:-110,width:340,height:340,borderRadius:"50%",background:D2.red,opacity:0.85,zIndex:0,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-80,left:-100,width:260,height:260,borderRadius:"50%",background:D2.green,opacity:0.85,zIndex:0,pointerEvents:"none"}}/>

      {/* Nav */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 48px 0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:2}}>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:22,fontStyle:"italic",display:"flex",alignItems:"center",gap:10,color:D2.ink}}>
          <span style={{width:12,height:12,background:D2.red,borderRadius:"50%"}}/>
          <span>Thinking with AI</span>
        </div>
      </div>

      {/* Main */}
      <div style={{maxWidth:860,margin:"0 auto",padding:"40px 48px 72px",position:"relative",zIndex:1}}>
        {/* Sticker + name */}
        <div style={{marginTop:40,marginBottom:16}}>
          <span style={{display:"inline-block",background:D2.yellow,color:D2.ink,fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"6px 12px",borderRadius:3,transform:"rotate(-1.5deg)"}}>Your type is</span>
        </div>
        <h1 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:"clamp(48px,8vw,84px)",lineHeight:0.95,letterSpacing:"-0.015em",color:D2.ink,margin:0}}>{type.name}</h1>
        <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:"clamp(17px,2vw,24px)",marginTop:16,color:D2.inkSoft}}>"{type.tagline}"</div>

        {/* Description */}
        <p style={{fontSize:"clamp(15px,1.5vw,17px)",lineHeight:1.65,marginTop:32,color:D2.ink,maxWidth:680}}>{type.description}</p>

        {/* Next chapter — tilted yellow box */}
        <div style={{marginTop:32,background:D2.yellow,borderRadius:14,padding:"22px 28px",transform:"rotate(-0.4deg)",maxWidth:600}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:D2.ink,marginBottom:8}}>Your next chapter</div>
          <p style={{fontSize:"clamp(14px,1.4vw,16px)",lineHeight:1.55,color:D2.ink,margin:0}}>{type.nextChapter}</p>
        </div>

        {/* Want to go deeper CTA */}
        <div style={{marginTop:48,background:D2.cream,border:`2px solid ${D2.ink}`,borderRadius:16,padding:"36px 40px",maxWidth:680}}>
          <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:"clamp(22px,2.5vw,30px)",color:D2.ink,lineHeight:1.1}}>Want to go deeper?</div>
          <p style={{fontSize:15,color:D2.inkSoft,lineHeight:1.55,margin:"12px 0 8px"}}>
            Get your personalised report featuring your strengths and growth areas, a list of concrete next steps to bring into your classroom, and a curated reading list — all based on your <em style={{fontFamily:"'Instrument Serif',Georgia,serif"}}>Thinking with AI</em> type and your diagnostic responses.
          </p>
          <p style={{fontSize:13,color:D2.inkMuted,fontStyle:"italic",fontFamily:"'Instrument Serif',Georgia,serif",margin:"0 0 22px"}}>
            Free — pay what you want if you find it useful.
          </p>
          <button onClick={onViewReport} style={{
            background:D2.ink,color:D2.paperInk,
            padding:"14px 26px",borderRadius:999,fontSize:15,fontWeight:600,
            letterSpacing:"0.03em",border:"none",cursor:"pointer",fontFamily:"inherit",
            transition:"background 0.2s",
          }}
          onMouseEnter={e=>e.currentTarget.style.background="#2a1a14"}
          onMouseLeave={e=>e.currentTarget.style.background=D2.ink}>
            Get your full report →
          </button>
        </div>

        {/* Share your type with the world */}
        <div style={{marginTop:32,background:D2.cream,border:`2px solid ${D2.ink}`,borderRadius:16,padding:"32px 36px",maxWidth:680}}>
          <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:"clamp(22px,2.5vw,28px)",color:D2.ink,marginBottom:6,lineHeight:1.1}}>Share your type with the world</div>
          <div style={{fontSize:13,color:D2.inkMuted,lineHeight:1.5,marginBottom:22}}>
            Download the graphic, copy the post text, then share wherever you'd like.
          </div>

          {/* Image */}
          <div style={{width:"100%",maxWidth:420,aspectRatio:"1/1",background:"#F3DCC0",borderRadius:10,margin:"0 auto 24px",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <img
              src={imgSrc}
              alt={`${type.name} — shareable graphic`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(false)}
              style={{width:"100%",height:"100%",objectFit:"cover",display: imgLoaded ? "block" : "none"}}
            />
            {!imgLoaded && (
              <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:15,color:D2.inkFaint,textAlign:"center",padding:20}}>
                Graphic coming soon
              </div>
            )}
          </div>

          {/* Two-column: text preview left, stacked buttons right */}
          <div className="tw-share-grid" style={{display:"grid",gridTemplateColumns:"1fr auto",gap:18,alignItems:"start"}}>
            <div style={{
              background:"rgba(255,255,255,0.5)",border:`1px dashed rgba(26,14,10,0.25)`,borderRadius:10,
              padding:"14px 18px",
              fontSize:13,lineHeight:1.55,color:D2.ink,whiteSpace:"pre-wrap",fontFamily:"'Inter',system-ui,sans-serif"
            }}>{shareText}</div>

            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:170}}>
              <button onClick={copyText} style={{
                background: copyState === "copied" ? D2.green
                          : copyState === "failed" ? "#8a4e3a"
                          : D2.ink,
                color: D2.paperInk,
                padding:"11px 16px",borderRadius:999,fontSize:13,fontWeight:600,
                border:"none",cursor:"pointer",fontFamily:"inherit",
                display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",
                transition:"background 0.2s",whiteSpace:"nowrap",
              }}>
                {copyState === "copied" ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Copied
                  </>
                ) : copyState === "failed" ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Select manually
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    Copy text
                  </>
                )}
              </button>
              <button onClick={downloadImage} style={{
                background: downloadState === "downloaded" ? D2.green : "transparent",
                color: downloadState === "downloaded" ? D2.paperInk : D2.ink,
                border: `2px solid ${D2.ink}`,
                padding:"10px 16px",borderRadius:999,fontSize:13,fontWeight:500,
                cursor:"pointer",fontFamily:"inherit",
                display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",
                transition:"all 0.2s",whiteSpace:"nowrap",
              }}>
                {downloadState === "downloaded" ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Downloaded
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download graphic
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social share row */}
          <div style={{marginTop:22,paddingTop:22,borderTop:`1px solid rgba(26,14,10,0.12)`,display:"flex",alignItems:"center",justifyContent:"center",gap:14,flexWrap:"wrap"}}>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:D2.inkMuted}}>Or share to:</div>
            {platforms.map(p => (
              <button
                key={p.name}
                onClick={() => openPlatform(p.url)}
                title={`Share on ${p.name} — text will be copied to clipboard`}
                aria-label={`Share on ${p.name}`}
                style={{
                  background:"transparent",border:`2px solid ${D2.ink}`,borderRadius:"50%",
                  width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"pointer",color:D2.ink,transition:"all 0.15s",padding:0
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=D2.ink;e.currentTarget.style.color=D2.paperInk}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=D2.ink}}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{p.icon}</svg>
              </button>
            ))}
          </div>

          {/* Responsive: stack the two-column on narrow widths */}
          <style>{`
            @media (max-width: 640px) {
              .tw-share-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>

        {/* All ten types — accordion */}
        <div style={{marginTop:56,paddingTop:32,borderTop:`1px dashed rgba(26,14,10,0.3)`,maxWidth:820}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:22}}>
            <div style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:"clamp(22px,2.4vw,28px)",color:D2.ink}}>
              All <em style={{fontStyle:"italic",color:D2.red}}>ten</em> types
            </div>
            <div style={{fontSize:13,color:D2.inkMuted,letterSpacing:"0.04em"}}>Curious about the others?</div>
          </div>
          <div>
            {orderedTypes.map(t => {
              const isYou = t.id === type.id;
              const isOpen = openTypeId === t.id;
              const onClick = () => setOpenTypeId(isOpen ? null : t.id);
              return (
                <div key={t.id} style={{borderBottom: isOpen ? "none" : `1px solid rgba(26,14,10,0.08)`}}>
                  <div
                    onClick={onClick}
                    style={{
                      display:"flex",alignItems:"baseline",gap:20,
                      padding: isYou ? "16px 18px" : "14px 0",
                      cursor:"pointer",
                      background: isYou ? "rgba(255,237,78,0.35)" : "transparent",
                      borderRadius: isYou ? 10 : 0,
                      margin: isYou ? "2px -18px" : 0,
                      transition:"color 0.15s",
                    }}
                    onMouseEnter={e=>{if(!isYou) e.currentTarget.querySelector('[data-name]').style.color=D2.red}}
                    onMouseLeave={e=>{if(!isYou) e.currentTarget.querySelector('[data-name]').style.color=D2.ink}}
                  >
                    <span data-name style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:"clamp(18px,2vw,22px)",color:D2.ink,transition:"color 0.15s",display:"flex",alignItems:"center",gap:10,flex:"0 0 auto"}}>
                      {t.name}
                      {isYou && <span style={{background:D2.red,color:"#fff",fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:3,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'Inter',sans-serif"}}>You</span>}
                    </span>
                    <span style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontSize:"clamp(13px,1.4vw,16px)",color:D2.inkSoft,marginLeft:"auto",textAlign:"right",maxWidth:"50%"}}>{t.tagline}</span>
                    <span style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:20,color: isOpen ? D2.red : D2.inkFaint,marginLeft:14,transition:"transform 0.2s",display:"inline-block",transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",flex:"0 0 auto"}}>›</span>
                  </div>
                  {isOpen && (
                    <div style={{padding:"4px 0 22px",borderBottom:`1px solid rgba(26,14,10,0.08)`}}>
                      <div style={{fontSize:"clamp(13px,1.4vw,15px)",lineHeight:1.7,color:D2.inkSoft,maxWidth:640}}>{t.description}</div>
                      <div style={{marginTop:14,padding:"12px 16px",background:"rgba(255,237,78,0.35)",borderRadius:8,fontSize:"clamp(13px,1.3vw,14px)",lineHeight:1.55,color:D2.ink,maxWidth:640}}>
                        <strong style={{fontWeight:600}}>Next chapter:</strong> {t.nextChapter}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Take it again */}
        <div style={{marginTop:40,textAlign:"center"}}>
          <button onClick={onRestart} style={{
            background:"transparent",color:D2.inkMuted,border:"none",
            fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"
          }}>Take the diagnostic again</button>
        </div>

        {/* Footer */}
        <div style={{textAlign:"center",marginTop:24,fontSize:12,color:D2.inkFaint,fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}}>
          © 2026 Amelia King · www.thinkingwithai.co · www.amelia-king.com
        </div>
      </div>
    </div>
  );
};

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  // If the URL has ?view=report, load saved state from localStorage and jump to report.
  const getInitialState = () => {
    try {
      if (typeof window !== "undefined" && window.location.search.includes("view=report")) {
        const saved = localStorage.getItem("twa_report_state");
        if (saved) {
          const { answers: a, typeId } = JSON.parse(saved);
          const t = TYPES.find(x => x.id === typeId);
          if (a && t) return { screen: "report", answers: a, result: t };
        }
      }
    } catch (e) { /* localStorage unavailable or malformed — fall through */ }
    return { screen: "welcome", answers: {}, result: null };
  };
  const initial = getInitialState();

  const [screen, setScreen] = useState(initial.screen);
  const [pageIdx, setPageIdx] = useState(0);
  const [answers, setAnswers] = useState(initial.answers);
  const [result, setResult] = useState(initial.result);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital,wght@0,400;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleStart = () => {
    setScreen("quiz");
    setPageIdx(0);
    setAnswers({});
    setResult(null);
  };

  const handleAnswer = (qIdx, val) => {
    setAnswers(prev => ({...prev, [qIdx]: val}));
  };

  // Scroll to top when pageIdx changes — runs AFTER the new page renders, so
  // there's no race between scroll and content. Instant scroll (not smooth)
  // is the right call on a quiz where users fly through pages quickly.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pageIdx, screen]);

  const handleNext = () => {
    if (pageIdx < PAGES.length - 1) {
      setPageIdx(pageIdx + 1);
    } else {
      setResult(assignType(answers));
      setScreen("result");
    }
  };

  const handlePrev = () => {
    if (pageIdx > 0) {
      setPageIdx(pageIdx - 1);
    }
  };

  return (
    <div style={{background:D2.ground,minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",color:D2.ink}}>
      {screen === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {screen === "quiz" && (
        <QuizPage
          page={PAGES[pageIdx]}
          pageIdx={pageIdx}
          totalPages={PAGES.length}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {screen === "result" && result && (
        <ResultScreen
          type={result}
          answers={answers}
          onRestart={handleStart}
          onViewReport={() => {
            try {
              localStorage.setItem("twa_report_state", JSON.stringify({ answers, typeId: result.id }));
              const url = window.location.pathname + "?view=report";
              window.open(url, "_blank", "noopener");
            } catch (e) {
              // localStorage blocked or popup blocked — fall back to same-tab navigation
              setScreen("report");
              window.scrollTo({top:0,behavior:"smooth"});
            }
          }}
        />
      )}
      {screen === "report" && result && (
        <ReportPage
          type={result}
          answers={answers}
          onBack={() => { setScreen("result"); window.scrollTo({top:0,behavior:"smooth"}); }}
        />
      )}
    </div>
  );
}
