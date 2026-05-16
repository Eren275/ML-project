import { useState, useEffect, useRef } from "react";

const API = "http://localhost:5000";

const MODELS = [
  { id: "gradient_boosting",   label: "Gradient Boosting",   desc: "Boosted trees · high accuracy",        icon: "🚀" },
  { id: "random_forest",       label: "Random Forest",        desc: "Ensemble of decision trees",           icon: "🌲" },
  { id: "logistic_regression", label: "Logistic Regression",  desc: "Fast linear classifier",               icon: "📈" },
  { id: "svm",                 label: "SVM",                  desc: "Support Vector Machine · RBF kernel",  icon: "⚡" },
  { id: "xgboost",             label: "XGBoost",              desc: "Extreme gradient boosting",            icon: "🔥" },
  { id: "catboost",            label: "CatBoost",             desc: "Categorical boosting",                 icon: "🐱" },
  { id: "decision_tree",       label: "Decision Tree",        desc: "Interpretable tree model",             icon: "🌿" },
];

const TEAM_COLORS = {
  "Arsenal":"#EF0107","Aston Villa":"#670E36","Brentford":"#e30613",
  "Brighton":"#0057B8","Burnley":"#6C1D45","Chelsea":"#034694",
  "Crystal Palace":"#1B458F","Everton":"#003399","Fulham":"#CC0000",
  "Leeds United":"#FFCD00","Leicester City":"#003090","Liverpool":"#C8102E",
  "Luton Town":"#F78F1E","Man City":"#6CABDD","Man United":"#DA291C",
  "Newcastle":"#4a4a4a","Nottm Forest":"#DD0000","Sheffield Utd":"#EE2737",
  "Tottenham":"#132257","West Ham":"#7A263A","Wolves":"#FDB913",
  "Bournemouth":"#DA291C","Southampton":"#D71920","Ipswich Town":"#0033A0","Watford":"#FBEE23"
};
const DEFAULT_COLOR = "#64748b";

function hex2rgb(hex) {
  const h = (hex || "#64748b").replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)].join(",");
}
function teamColor(name) { return TEAM_COLORS[name] || DEFAULT_COLOR; }

// ── Pitch SVG background ──────────────────────────────────────────────────────
function Pitch({ hc, ac }) {
  return (
    <svg viewBox="0 0 600 380" style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.12}}>
      <rect width="600" height="380" fill="#1a3d0a"/>
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>(
        <rect key={i} x={i*50} y="0" width="50" height="380"
          fill={i%2===0?"#1a3d0a":"#1e4510"} opacity="0.55"/>
      ))}
      <rect x="12" y="12" width="576" height="356" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
      <line x1="300" y1="12" x2="300" y2="368" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
      <circle cx="300" cy="190" r="55" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
      <circle cx="300" cy="190" r="4" fill="rgba(255,255,255,0.6)"/>
      <rect x="12" y="120" width="80" height="140" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      <rect x="12" y="155" width="28" height="70" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      <rect x="508" y="120" width="80" height="140" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      <rect x="560" y="155" width="28" height="70" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      <circle cx="92" cy="190" r="3" fill={hc} opacity="0.9"/>
      <circle cx="508" cy="190" r="3" fill={ac} opacity="0.9"/>
    </svg>
  );
}

// ── Probability arc ───────────────────────────────────────────────────────────
function Arc({ pct, color, label }) {
  const r = 40, cx = 56, cy = 56, size = 112;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{textAlign:"center"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{transition:"stroke-dasharray 1.3s cubic-bezier(.4,0,.2,1)"}}/>
        <text x={cx} y={cy+6} textAnchor="middle" fill="white"
          fontSize="16" fontWeight="700" fontFamily="inherit">{pct}%</text>
      </svg>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",letterSpacing:"0.08em",marginTop:2,textTransform:"uppercase"}}>{label}</div>
    </div>
  );
}

// ── Stat bar row ──────────────────────────────────────────────────────────────
function Bar({ label, hv, av, hc, ac }) {
  const t = (hv + av) || 1;
  const hp = Math.round((hv / t) * 100);
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
        <span style={{fontSize:16,fontWeight:700,color:hc,minWidth:36}}>{hv}</span>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.32)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</span>
        <span style={{fontSize:16,fontWeight:700,color:ac,minWidth:36,textAlign:"right"}}>{av}</span>
      </div>
      <div style={{height:7,borderRadius:4,overflow:"hidden",background:"rgba(255,255,255,0.07)",display:"flex"}}>
        <div style={{width:`${hp}%`,background:hc,transition:"width 1.2s cubic-bezier(.4,0,.2,1)",borderRadius:"4px 0 0 4px"}}/>
        <div style={{width:`${100-hp}%`,background:ac,transition:"width 1.2s cubic-bezier(.4,0,.2,1)",borderRadius:"0 4px 4px 0"}}/>
      </div>
    </div>
  );
}

// ── Team dropdown ─────────────────────────────────────────────────────────────
function Dropdown({ value, onChange, side, color, teams }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  useEffect(()=>{
    const h = e => { if(ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(""); }};
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  },[]);
  const filtered = teams.filter(t => t.toLowerCase().includes(search.toLowerCase()));
  const c = color || "#4f8ef7";
  return (
    <div ref={ref} style={{position:"relative",width:220}}>
      <div onClick={()=>setOpen(o=>!o)} style={{
        background:"rgba(255,255,255,0.05)",
        border:`1.5px solid ${value ? c : "rgba(255,255,255,0.1)"}`,
        borderRadius:14, padding:"14px 18px", cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        transition:"all 0.2s",
        boxShadow: value ? `0 0 24px rgba(${hex2rgb(c)},0.15)` : "none"
      }}>
        <div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",marginBottom:3,textTransform:"uppercase"}}>
            {side === "home" ? "Home" : "Away"}
          </div>
          <div style={{fontSize:15,fontWeight:700,color:value?"white":"rgba(255,255,255,0.22)"}}>
            {value || "Select team"}
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>
          <path d="M3 5l4 4 4-4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      {open && (
        <div style={{position:"absolute",top:"calc(100% + 8px)",left:0,right:0,zIndex:999,
          background:"#131827",border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:12,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,0.7)"}}>
          <div style={{padding:"8px 10px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
              style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:8,padding:"6px 10px",color:"white",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{maxHeight:220,overflowY:"auto"}}>
            {filtered.map(t=>(
              <div key={t} onClick={()=>{ onChange(t); setOpen(false); setSearch(""); }}
                style={{padding:"10px 16px",cursor:"pointer",fontSize:13,fontWeight:600,
                  display:"flex",alignItems:"center",gap:8,
                  color:value===t?c:"rgba(255,255,255,0.7)",
                  background:value===t?`rgba(${hex2rgb(c)},0.12)`:"transparent",transition:"background 0.1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=`rgba(${hex2rgb(c)},0.08)`}
                onMouseLeave={e=>e.currentTarget.style.background=value===t?`rgba(${hex2rgb(c)},0.12)`:"transparent"}>
                <div style={{width:10,height:10,borderRadius:"50%",background:teamColor(t),flexShrink:0}}/>
                {t}
              </div>
            ))}
            {filtered.length===0 && (
              <div style={{padding:"12px 16px",fontSize:12,color:"rgba(255,255,255,0.3)"}}>No teams found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Model selector grid ───────────────────────────────────────────────────────
function ModelSelector({ selected, onSelect, trainedModels }) {
  return (
    <div style={{width:"100%",maxWidth:820}}>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.12em",
        textTransform:"uppercase",marginBottom:10}}>Select Model</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:8}}>
        {MODELS.map(m => {
          const isSelected = selected === m.id;
          const isTrained  = trainedModels.includes(m.id);
          return (
            <div key={m.id} onClick={()=>onSelect(m.id)}
              style={{
                padding:"11px 14px",borderRadius:12,cursor:"pointer",position:"relative",
                border: isSelected
                  ? "1.5px solid rgba(99,102,241,0.7)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: isSelected
                  ? "rgba(99,102,241,0.12)"
                  : "rgba(255,255,255,0.03)",
                transition:"all 0.18s"
              }}
              onMouseEnter={e=>{ if(!isSelected) e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}
              onMouseLeave={e=>{ if(!isSelected) e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
            >
              {isTrained && (
                <div style={{position:"absolute",top:7,right:8,fontSize:9,padding:"2px 6px",borderRadius:4,
                  background:"rgba(34,197,94,0.15)",color:"#22c55e",
                  border:"1px solid rgba(34,197,94,0.25)",letterSpacing:"0.06em"}}>TRAINED</div>
              )}
              <div style={{fontSize:18,marginBottom:5}}>{m.icon}</div>
              <div style={{fontSize:12,fontWeight:700,
                color:isSelected?"#818cf8":"rgba(255,255,255,0.85)",marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.04em"}}>{m.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [teams, setTeams]         = useState([]);
  const [home, setHome]           = useState("");
  const [away, setAway]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [training, setTraining]   = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");
  const [dots, setDots]           = useState("");
  const [selectedModel, setSelectedModel]   = useState("gradient_boosting");
  const [trainedModels, setTrainedModels]   = useState([]);

  const hc = home ? teamColor(home) : "#3b82f6";
  const ac = away ? teamColor(away) : "#ef4444";
  const modelReady = trainedModels.includes(selectedModel);
  const selectedModelInfo = MODELS.find(m => m.id === selectedModel);

  useEffect(()=>{
    fetch(`${API}/teams`)
      .then(r=>r.json())
      .then(d=>setTeams(d.teams||[]))
      .catch(()=>setError("Cannot connect to Flask API — make sure api.py is running on port 5000."));
  },[]);

  useEffect(()=>{
    if (!loading && !training) return;
    const iv = setInterval(()=>setDots(d=>d.length>=3?"":d+"."),450);
    return ()=>clearInterval(iv);
  },[loading,training]);

  async function trainModel() {
    setTraining(true); setError("");
    try {
      const r = await fetch(`${API}/train`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model: selectedModel })
      });
      const d = await r.json();
      if (d.error) { setError(d.error); }
      else {
        setTrainedModels(prev => prev.includes(selectedModel) ? prev : [...prev, selectedModel]);
        setResult(null);
      }
    } catch(e) {
      setError("Training failed — is api.py running?");
    }
    setTraining(false);
  }

  async function predict() {
    if (!home || !away || !modelReady) return;
    setLoading(true); setResult(null); setError("");
    try {
      const r = await fetch(`${API}/predict`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ home, away, model: selectedModel })
      });
      const d = await r.json();
      if (d.error) { setError(d.error); setLoading(false); return; }
      setResult(d);
    } catch(e) {
      setError("Prediction failed — is api.py running on port 5000?");
    }
    setLoading(false);
  }

  const winLabel = result
    ? result.prediction==="H" ? `${home} Win`
    : result.prediction==="A" ? `${away} Win`
    : "Draw" : "";

  const winColor = result
    ? result.prediction==="H" ? hc
    : result.prediction==="A" ? ac
    : "#93c5fd" : "white";

  return (
    <div style={{position:"fixed",inset:0,background:"#090d18",display:"flex",flexDirection:"column",
      fontFamily:"'Segoe UI',system-ui,sans-serif",color:"white",overflow:"hidden"}}>

      {/* Pitch bg */}
      <div style={{position:"absolute",inset:0,zIndex:0,overflow:"hidden"}}>
        {(home||away) && <Pitch hc={hc} ac={ac}/>}
        <div style={{position:"absolute",inset:0,
          background:`radial-gradient(ellipse 80% 80% at 50% 50%, transparent 15%, #090d18 68%)`}}/>
        {home && <div style={{position:"absolute",left:0,top:0,bottom:0,width:"45%",
          background:`radial-gradient(ellipse at left center, rgba(${hex2rgb(hc)},0.08), transparent 70%)`}}/>}
        {away && <div style={{position:"absolute",right:0,top:0,bottom:0,width:"45%",
          background:`radial-gradient(ellipse at right center, rgba(${hex2rgb(ac)},0.08), transparent 70%)`}}/>}
      </div>

      {/* Top bar */}
      <div style={{position:"relative",zIndex:10,background:"rgba(255,255,255,0.03)",
        borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"14px 40px",
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:34,height:34,borderRadius:8,fontSize:18,
            background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
            display:"flex",alignItems:"center",justifyContent:"center"}}>⚽</div>
          <div>
            <div style={{fontSize:13,fontWeight:800,letterSpacing:"0.08em"}}>EPL MATCH PREDICTOR</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.22)",letterSpacing:"0.08em",marginTop:1}}>
              {selectedModelInfo?.icon} {selectedModelInfo?.label?.toUpperCase()} · YOUR PYTHON MODEL
            </div>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:11,padding:"4px 10px",borderRadius:6,
            background: modelReady ? "rgba(34,197,94,0.1)" : "rgba(250,204,21,0.1)",
            color: modelReady ? "#22c55e" : "#facc15",
            border:`1px solid ${modelReady ? "rgba(34,197,94,0.2)" : "rgba(250,204,21,0.2)"}`}}>
            {modelReady ? `● ${selectedModelInfo?.label} ready` : "● Not trained"}
          </div>
          <button onClick={trainModel} disabled={training} style={{
            padding:"7px 18px",background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,
            color:"rgba(255,255,255,0.7)",fontSize:12,
            cursor:training?"not-allowed":"pointer",
            fontFamily:"inherit",transition:"all 0.2s",opacity:training?0.6:1}}>
            {training ? `Training${dots}` : "⟳ Train Model"}
          </button>
        </div>
      </div>

      {/* Main scroll area */}
      <div style={{position:"relative",zIndex:10,flex:1,overflowY:"auto",
        display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:result?"flex-start":"center",
        padding:"32px 24px 32px",gap:24}}>

        {/* Model selector (hide when result is showing) */}
        {!result && (
          <ModelSelector
            selected={selectedModel}
            onSelect={id=>{ setSelectedModel(id); setResult(null); setError(""); }}
            trainedModels={trainedModels}
          />
        )}

        {/* Team pickers */}
        <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
          <Dropdown value={home} onChange={v=>{setHome(v);setResult(null);}} side="home" color={hc} teams={teams}/>
          <div style={{padding:"10px 22px",background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:800,color:"rgba(255,255,255,0.22)",letterSpacing:"0.1em"}}>VS</div>
          </div>
          <Dropdown value={away} onChange={v=>{setAway(v);setResult(null);}} side="away" color={ac} teams={teams}/>
        </div>

        {/* Warning: must train first */}
        {home && away && !modelReady && !loading && !training && (
          <div style={{background:"rgba(250,204,21,0.07)",border:"1px solid rgba(250,204,21,0.2)",
            borderRadius:12,padding:"14px 22px",display:"flex",alignItems:"center",gap:14,maxWidth:500}}>
            <span style={{fontSize:20}}>⚠️</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#fde047",marginBottom:2}}>
                Train model first
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>
                "{selectedModelInfo?.label}" hasn't been trained yet. Hit{" "}
                <b style={{color:"rgba(255,255,255,0.7)"}}>⟳ Train Model</b> in the top bar to enable predictions.
              </div>
            </div>
          </div>
        )}

        {/* Predict button — only when model is trained */}
        {home && away && !result && !loading && modelReady && (
          <button onClick={predict} style={{
            padding:"15px 64px",
            background:`linear-gradient(135deg,${hc},${ac})`,
            border:"none",borderRadius:14,color:"white",
            fontSize:15,fontWeight:800,cursor:"pointer",letterSpacing:"0.07em",
            boxShadow:`0 8px 40px rgba(${hex2rgb(hc)},0.28)`,
            transition:"transform 0.15s,box-shadow 0.15s",fontFamily:"inherit"}}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            PREDICT MATCH
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{width:52,height:52,margin:"0 auto 16px",borderRadius:"50%",
              border:`3px solid rgba(255,255,255,0.06)`,borderTop:`3px solid ${hc}`,
              animation:"spin 0.8s linear infinite"}}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{color:"rgba(255,255,255,0.32)",fontSize:13,letterSpacing:"0.1em"}}>
              RUNNING MODEL{dots}
            </div>
          </div>
        )}

        {error && (
          <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",
            borderRadius:10,padding:"12px 20px",fontSize:13,color:"#fca5a5",maxWidth:500,textAlign:"center"}}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{width:"100%",maxWidth:820,display:"flex",flexDirection:"column",gap:16,
            animation:"fadeUp 0.45s ease"}}>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>

            {/* Verdict */}
            <div style={{background:`rgba(${hex2rgb(winColor)},0.07)`,
              border:`1px solid rgba(${hex2rgb(winColor)},0.22)`,
              borderRadius:18,padding:"26px 32px",
              display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
              <div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",letterSpacing:"0.14em",
                  marginBottom:8,textTransform:"uppercase"}}>Predicted Outcome</div>
                <div style={{fontSize:34,fontWeight:900,color:winColor,letterSpacing:"-0.02em",lineHeight:1}}>
                  {winLabel}
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:10,letterSpacing:"0.04em"}}>
                   {selectedModelInfo?.icon} {selectedModelInfo?.label}
                </div>
              </div>
              <div style={{display:"flex",gap:18,alignItems:"flex-end"}}>
                <Arc pct={result.home_win} color={hc} label="Home win"/>
                <Arc pct={result.draw}     color="#93c5fd" label="Draw"/>
                <Arc pct={result.away_win} color={ac} label="Away win"/>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:16,padding:"22px 26px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,fontSize:13,fontWeight:700}}>
                  <span style={{color:hc}}>{home}</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.25)",letterSpacing:"0.08em",
                    textTransform:"uppercase",alignSelf:"center"}}></span>
                  <span style={{color:ac}}>{away}</span>
                </div>
                <Bar label="Shots"           hv={result.stats.shots[0]}    av={result.stats.shots[1]}    hc={hc} ac={ac}/>
                <Bar label="Shots on Target" hv={result.stats.onTarget[0]} av={result.stats.onTarget[1]} hc={hc} ac={ac}/>
                <Bar label="Corners"         hv={result.stats.corners[0]}  av={result.stats.corners[1]}  hc={hc} ac={ac}/>
                <Bar label="Fouls"           hv={result.stats.fouls[0]}    av={result.stats.fouls[1]}    hc={hc} ac={ac}/>
                <Bar label="Yellow Cards"    hv={result.stats.yellows[0]}  av={result.stats.yellows[1]}  hc={hc} ac={ac}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {label:"Shots",           h:result.stats.shots[0],    a:result.stats.shots[1]},
                  {label:"Shots on Target", h:result.stats.onTarget[0], a:result.stats.onTarget[1]},
                  {label:"Corners",         h:result.stats.corners[0],  a:result.stats.corners[1]},
                  {label:"Fouls",           h:result.stats.fouls[0],    a:result.stats.fouls[1]},
                  {label:"Yellow Cards",    h:result.stats.yellows[0],  a:result.stats.yellows[1]},
                  {label:"Red Cards",       h:result.stats.reds[0],     a:result.stats.reds[1]},
                ].map(({label,h,a})=>(
                  <div key={label} style={{background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"11px 20px",
                    display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontSize:17,fontWeight:800,color:hc}}>{h}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",letterSpacing:"0.07em",
                      textTransform:"uppercase"}}>{label}</div>
                    <div style={{fontSize:17,fontWeight:800,color:ac}}>{a}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={()=>setResult(null)} style={{alignSelf:"center",marginTop:4,
              padding:"10px 30px",background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.09)",borderRadius:10,
              color:"rgba(255,255,255,0.38)",fontSize:13,cursor:"pointer",
              fontFamily:"inherit",letterSpacing:"0.04em",transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.09)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
              ← New Prediction
            </button>
          </div>
        )}
      </div>
    </div>
  );
}