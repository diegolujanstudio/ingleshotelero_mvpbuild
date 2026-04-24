// === EMPLOYEE MOBILE FLOW ===
const { useState, useEffect } = React;

function PhoneFrame({ children, label }) {
  return (
    <div className="surface-card">
      <div className="surface-caption"><span className="dot"></span>Empleado · PWA móvil</div>
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-notch"></div>
          <div className="phone-status">
            <span>9:41</span>
            <span>●●● ● ◐</span>
          </div>
          <div className="phone-body">{children}</div>
        </div>
      </div>
      {label && <div className="surface-caption" style={{opacity:0.6}}>{label}</div>}
    </div>
  );
}

// --- SCREEN: Welcome ---
function WelcomeScreen({ onNext }) {
  return (
    <>
      <div style={{padding: '20px 0 12px'}}>
        <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6}}>Hotel Gran Cabo</div>
        <div style={{fontFamily:'var(--serif)', fontSize:14, }}>Inglés Hotelero</div>
      </div>
      <div style={{marginTop: 40}}>
        <div className="ph-eyebrow">Bienvenido</div>
        <div className="ph-title">Evaluación<br/>de <em>inglés</em><br/>profesional</div>
        <p className="ph-body-text" style={{marginTop:20}}>
          Tome un examen breve de <strong>15 minutos</strong> para determinar su nivel actual y su plan de aprendizaje personalizado.
        </p>
      </div>

      <div style={{margin:'28px 0'}}>
        <div className="placeholder-img" style={{height: 180}}>
          <div className="cap">lobby · hotel staff greeting guest</div>
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:6, marginBottom: 24}}>
        {[
          ['01', 'Cuestionario', '2 min'],
          ['02', 'Comprensión auditiva', '8 min'],
          ['03', 'Expresión oral', '6 min'],
        ].map(([n, t, d]) => (
          <div key={n} style={{display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid var(--hair)'}}>
            <span style={{fontFamily:'var(--serif)', color:'var(--accent)', fontSize:18, width:28}}>{n}</span>
            <span style={{flex:1, fontSize:13}}>{t}</span>
            <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-muted)', letterSpacing:'0.06em'}}>{d.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary accent" onClick={onNext}>
        Comenzar evaluación →
      </button>
      <div style={{textAlign:'center', marginTop:12, fontFamily:'var(--mono)', fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em'}}>
        GUARDADO AUTOMÁTICAMENTE
      </div>
    </>
  );
}

// --- SCREEN: Role Select ---
function RoleScreen({ role, setRole, onNext, onBack }) {
  return (
    <>
      <div className="ph-top">
        <button className="ph-back" onClick={onBack}>←</button>
        <div className="ph-progress-dots">
          <span className="ph-dot done"></span>
          <span className="ph-dot active"></span>
          <span className="ph-dot"></span>
          <span className="ph-dot"></span>
          <span className="ph-dot"></span>
        </div>
        <div style={{width:36}}></div>
      </div>
      <div className="ph-eyebrow">Paso 01 · Su puesto</div>
      <div className="ph-title">¿Cuál es su <em>área</em> de trabajo?</div>
      <p className="ph-body-text">Personalizaremos el examen y las lecciones con escenarios reales de su puesto.</p>

      <div style={{marginTop: 12}}>
        {Object.keys(ROLE_CONTENT).map((k, i) => (
          <button key={k} className={`option-card ${role === k ? 'selected' : ''}`} onClick={() => setRole(k)}>
            <span className="num">{String(i+1).padStart(2,'0')}</span>
            <span className="t">
              <div className="t-head">{ROLE_CONTENT[k].es.name}</div>
              <div className="t-sub">{ROLE_CONTENT[k].es.short.toUpperCase()}</div>
            </span>
          </button>
        ))}
      </div>

      <button className="btn-primary accent" style={{marginTop:24}} onClick={onNext} disabled={!role}>
        Continuar →
      </button>
    </>
  );
}

// --- SCREEN: Diagnostic ---
function DiagnosticScreen({ onNext, onBack }) {
  const [answer, setAnswer] = useState(null);
  const options = [
    'He estudiado inglés menos de un año',
    'He estudiado entre 1 y 3 años',
    'He estudiado más de 3 años',
    'Nunca he estudiado formalmente'
  ];
  return (
    <>
      <div className="ph-top">
        <button className="ph-back" onClick={onBack}>←</button>
        <div className="ph-progress-dots">
          <span className="ph-dot done"></span>
          <span className="ph-dot done"></span>
          <span className="ph-dot active"></span>
          <span className="ph-dot"></span>
          <span className="ph-dot"></span>
        </div>
        <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-muted)'}}>5 DE 13</div>
      </div>

      <div className="ph-eyebrow">Diagnóstico · Su experiencia</div>
      <div className="ph-title" style={{fontSize:24}}>¿Cuánto tiempo ha <em>estudiado</em> inglés en su vida?</div>
      <p className="ph-body-text" style={{fontSize:13}}>No hay respuesta correcta. Esto nos ayuda a entender su punto de partida.</p>

      <div style={{marginTop: 8}}>
        {options.map((o, i) => (
          <button key={i} className={`diag-opt ${answer === i ? 'selected' : ''}`} onClick={() => setAnswer(i)}>
            <span className="diag-opt-circle"></span>
            <span className="diag-opt-text">{o}</span>
          </button>
        ))}
      </div>

      <button className="btn-primary accent" style={{marginTop:24}} onClick={onNext} disabled={answer === null}>
        Siguiente pregunta →
      </button>
    </>
  );
}

// --- SCREEN: Listening ---
function ListeningScreen({ role, level, onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const content = ROLE_CONTENT[role].listening[level];

  useEffect(() => {
    if (playing) {
      let p = 0;
      const i = setInterval(() => {
        p += 2;
        setPlayProgress(p);
        if (p >= 100) { clearInterval(i); setPlaying(false); }
      }, 60);
      return () => clearInterval(i);
    }
  }, [playing]);

  const waveBars = Array.from({length: 42}).map((_, i) => {
    const h = 4 + Math.abs(Math.sin(i * 1.3)) * 18 + Math.abs(Math.cos(i * 0.7)) * 8;
    return { h, played: (i/42)*100 < playProgress };
  });

  return (
    <>
      <div className="ph-top">
        <button className="ph-back" onClick={onBack}>←</button>
        <div className="ph-progress-dots">
          <span className="ph-dot done"></span>
          <span className="ph-dot done"></span>
          <span className="ph-dot done"></span>
          <span className="ph-dot active"></span>
          <span className="ph-dot"></span>
        </div>
        <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-muted)'}}>3 DE 10</div>
      </div>

      <div className="ph-eyebrow">Comprensión auditiva</div>
      <div className="ph-title" style={{fontSize:22}}>Escuche al <em>huésped</em> y elija la acción correcta.</div>

      <div className="listen-card">
        <div className="listen-question">Nivel {level} · Reproducir hasta 2 veces</div>
        <div className="listen-player">
          <button className="listen-play-btn" onClick={() => { setPlaying(!playing); if (playProgress >= 100) setPlayProgress(0); }}>
            {playing ? '❚❚' : '▶'}
          </button>
          <div className="listen-wave">
            {waveBars.map((b, i) => (
              <span key={i} style={{height: b.h, background: b.played ? 'var(--accent)' : 'var(--text-muted)', opacity: b.played ? 1 : 0.4}}></span>
            ))}
          </div>
          <span className="listen-time">0:0{Math.floor(playProgress/20)}</span>
        </div>
        {playing && (
          <div style={{marginTop:12, fontSize:12, color:'var(--text-soft)', textAlign:'center', fontFamily:'var(--serif)'}}>
            "{content.en}"
          </div>
        )}
      </div>

      <div className="answer-list">
        {content.opts.map((o, i) => (
          <button key={i} className={`answer-item ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(i)}>
            <span className="ic">{o.ic}</span>
            <span>
              <div className="tx">{o.label}</div>
              <div className="tx-sub">{o.sub}</div>
            </span>
          </button>
        ))}
      </div>

      <button className="btn-primary accent" style={{marginTop:20}} onClick={onNext} disabled={selected === null}>
        Siguiente →
      </button>
    </>
  );
}

// --- SCREEN: Speaking ---
function SpeakingScreen({ role, level, onNext, onBack }) {
  const [state, setState] = useState('idle'); // idle, recording, done
  const [duration, setDuration] = useState(0);
  const [waveHeights, setWaveHeights] = useState(Array(28).fill(4));
  const content = ROLE_CONTENT[role].speaking[level];

  useEffect(() => {
    if (state === 'recording') {
      const i = setInterval(() => {
        setDuration(d => d + 0.1);
        setWaveHeights(() => Array.from({length:28}, () => 4 + Math.random() * 32));
      }, 100);
      return () => clearInterval(i);
    }
  }, [state]);

  const toggleRec = () => {
    if (state === 'idle') { setState('recording'); setDuration(0); }
    else if (state === 'recording') setState('done');
    else { setState('idle'); setDuration(0); }
  };

  return (
    <>
      <div className="ph-top">
        <button className="ph-back" onClick={onBack}>←</button>
        <div className="ph-progress-dots">
          <span className="ph-dot done"></span>
          <span className="ph-dot done"></span>
          <span className="ph-dot done"></span>
          <span className="ph-dot done"></span>
          <span className="ph-dot active"></span>
        </div>
        <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-muted)'}}>2 DE 6</div>
      </div>

      <div className="ph-eyebrow">Expresión oral</div>
      <div className="ph-title" style={{fontSize:22}}>Responda en <em>inglés</em> como si estuviera en la situación.</div>

      <div className="rec-scenario">
        <div className="rec-scenario-label">Escenario · Nivel {level}</div>
        <div className="rec-scenario-text">{content.scenario}</div>
        <div className="rec-scenario-kw">
          {content.keywords.map(k => <span key={k} className="rec-kw">{k}</span>)}
        </div>
      </div>

      <div className="rec-mic-area">
        <button className={`rec-mic ${state === 'recording' ? 'recording' : ''}`} onClick={toggleRec} style={{background: state === 'done' ? 'var(--text)' : 'var(--accent)'}}>
          {state === 'done' ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : state === 'recording' ? (
            <div style={{width:22, height:22, background:'white', borderRadius:3}}></div>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </button>
        {state === 'recording' && (
          <div className="rec-live-wave">
            {waveHeights.map((h, i) => <span key={i} style={{height: h}}></span>)}
          </div>
        )}
        <div className={`rec-status ${state === 'recording' ? 'recording' : ''}`}>
          {state === 'idle' && <>Toque para <strong>grabar</strong> · 30-45 seg</>}
          {state === 'recording' && <>● Grabando · {duration.toFixed(1)}s</>}
          {state === 'done' && <>Grabación lista · {duration.toFixed(1)}s</>}
        </div>
      </div>

      {state === 'done' && (
        <>
          <button className="btn-ghost" style={{marginBottom:8}} onClick={() => setState('idle')}>↻ Grabar de nuevo</button>
          <button className="btn-primary accent" onClick={onNext}>Enviar respuesta →</button>
        </>
      )}
    </>
  );
}

// --- SCREEN: Results ---
function ResultsScreen({ role, level, onNext }) {
  return (
    <>
      <div style={{padding:'20px 0 16px', textAlign:'center'}}>
        <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-muted)'}}>Evaluación completa</div>
      </div>

      <div style={{textAlign:'center'}}>
        <div className="ph-title" style={{fontSize:26, textAlign:'center'}}>Su nivel<br/>actual</div>
        <div className="result-level" style={{justifyContent:'center', gap:14, alignItems:'baseline'}}>
          <span className="result-level-val">{level}</span>
          <span className="result-level-cap">{LEVEL_DESC[level]}</span>
        </div>
      </div>

      <div style={{margin:'24px 0', padding:'20px 0', borderTop:'1px solid var(--hair)', borderBottom:'1px solid var(--hair)'}}>
        <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:10}}>Desglose</div>
        {[
          ['Escucha', 72],
          ['Vocabulario', 68],
          ['Fluidez', 54],
          ['Tono profesional', 81],
        ].map(([l, v]) => (
          <div key={l} className="score-row">
            <div className="score-label">{l}</div>
            <div className="score-track"><div className="score-fill" style={{width:`${v}%`}}></div></div>
            <div className="score-val">{v}</div>
          </div>
        ))}
      </div>

      <div style={{background:'var(--bg-soft)', borderRadius:14, padding:18, marginBottom:20}}>
        <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8}}>Su plan · 3 meses</div>
        <div style={{fontFamily:'var(--serif)', fontSize:17, lineHeight:1.4, marginBottom:12}}>
          Módulo {ROLE_CONTENT[role].es.name} · Nivel {level} → {LEVELS[Math.min(LEVELS.indexOf(level)+1, 3)]}
        </div>
        <div style={{fontSize:12, color:'var(--text-soft)', lineHeight:1.5}}>
          5 minutos diarios por WhatsApp. Primera evaluación de progreso en 4 semanas.
        </div>
      </div>

      <button className="btn-primary accent" onClick={onNext}>
        Comenzar mi primer día →
      </button>
    </>
  );
}

// --- SCREEN: Daily Home ---
function DailyHomeScreen({ role, level, onNext }) {
  return (
    <>
      <div style={{padding:'20px 0 12px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)'}}>Martes 21 abr</div>
          <div style={{fontFamily:'var(--serif)', fontSize:18, marginTop:2}}>Hola, <em style={{color:'var(--accent)', }}>María</em></div>
        </div>
        <div style={{width:38, height:38, borderRadius:'50%', background:'var(--bg-soft)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--serif)', fontSize:14}}>ML</div>
      </div>

      <div className="streak-card">
        <div className="streak-num"><em>12</em></div>
        <div className="streak-label">Días consecutivos</div>
        <div className="streak-meta">
          <div className="streak-meta-item">
            <div className="streak-meta-val">{level}</div>
            <div className="streak-meta-lab">Nivel actual</div>
          </div>
          <div className="streak-meta-item">
            <div className="streak-meta-val">48<span style={{fontSize:12, opacity:0.6}}>%</span></div>
            <div className="streak-meta-lab">Del mes 2</div>
          </div>
          <div className="streak-meta-item">
            <div className="streak-meta-val">142</div>
            <div className="streak-meta-lab">Palabras</div>
          </div>
        </div>
      </div>

      <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', margin:'20px 0 10px'}}>
        Hoy · 5 minutos
      </div>

      <div className="today-card" onClick={onNext}>
        <div className="today-num">01</div>
        <div className="today-main">
          <div className="today-title">Escuchar al huésped</div>
          <div className="today-sub">Audio · 1 min</div>
        </div>
        <div className="today-arrow">→</div>
      </div>
      <div className="today-card">
        <div className="today-num">02</div>
        <div className="today-main">
          <div className="today-title">Responder en inglés</div>
          <div className="today-sub">Voz · 2 min</div>
        </div>
        <div className="today-arrow">→</div>
      </div>
      <div className="today-card locked">
        <div className="today-num">03</div>
        <div className="today-main">
          <div className="today-title">Repasar vocabulario</div>
          <div className="today-sub">Flashcards · 1 min</div>
        </div>
        <div className="today-arrow">→</div>
      </div>
      <div className="today-card locked">
        <div className="today-num">04</div>
        <div className="today-main">
          <div className="today-title">Escuchar el modelo</div>
          <div className="today-sub">Audio · 1 min</div>
        </div>
        <div className="today-arrow">→</div>
      </div>

      <div style={{marginTop:20, padding:'14px 16px', border:'1px dashed var(--hair)', borderRadius:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontFamily:'var(--mono)', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-muted)'}}>Próximo logro</div>
          <div style={{fontSize:13, marginTop:3, fontWeight:500}}>Racha de 14 días</div>
        </div>
        <div style={{fontFamily:'var(--serif)', color:'var(--accent)', fontSize:18}}>2 más</div>
      </div>
    </>
  );
}

function EmployeeFlow({ role, level, screen, setScreen }) {
  const screens = ['welcome', 'role', 'diagnostic', 'listening', 'speaking', 'results', 'home'];
  const idx = screens.indexOf(screen);
  const next = () => setScreen(screens[Math.min(idx+1, screens.length-1)]);
  const back = () => setScreen(screens[Math.max(idx-1, 0)]);

  const [localRole, setLocalRole] = useState(role);
  useEffect(() => { setLocalRole(role); }, [role]);

  return (
    <PhoneFrame>
      {screen === 'welcome' && <WelcomeScreen onNext={next} />}
      {screen === 'role' && <RoleScreen role={localRole} setRole={setLocalRole} onNext={next} onBack={back} />}
      {screen === 'diagnostic' && <DiagnosticScreen onNext={next} onBack={back} />}
      {screen === 'listening' && <ListeningScreen role={role} level={level} onNext={next} onBack={back} />}
      {screen === 'speaking' && <SpeakingScreen role={role} level={level} onNext={next} onBack={back} />}
      {screen === 'results' && <ResultsScreen role={role} level={level} onNext={next} />}
      {screen === 'home' && <DailyHomeScreen role={role} level={level} onNext={() => setScreen('listening')} />}
    </PhoneFrame>
  );
}

window.EmployeeFlow = EmployeeFlow;
