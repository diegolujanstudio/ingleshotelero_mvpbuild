// === MAIN APP SHELL ===

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "terracotta",
  "role": "frontdesk",
  "level": "B1",
  "theme": "light",
  "language": "es"
} /*EDITMODE-END*/;

function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  return (
    <div className="tweaks-panel">
      <div className="tweaks-title">
        <span>Tweaks</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>LIVE</span>
      </div>

      <div className="tweak-row">
        <span className="tweak-label">Accent</span>
        <div className="tweak-options">
          {[
          ['terracotta', '#C15A37'],
          ['forest', '#3E5D43'],
          ['ochre', '#B88A2E'],
          ['ink', '#2E4761']].
          map(([k, c]) =>
          <div key={k} className={`accent-swatch ${tweaks.accent === k ? 'active' : ''}`} style={{ background: c }} onClick={() => update('accent', k)} title={k}></div>
          )}
        </div>
      </div>

      <div className="tweak-row">
        <span className="tweak-label">Role</span>
        <div className="tweak-options">
          {[['bellboy', 'Botones'], ['frontdesk', 'Recepción'], ['restaurant', 'Rest.']].map(([k, l]) =>
          <button key={k} className={`tweak-pill ${tweaks.role === k ? 'active' : ''}`} onClick={() => update('role', k)}>{l}</button>
          )}
        </div>
      </div>

      <div className="tweak-row">
        <span className="tweak-label">Level</span>
        <div className="tweak-options">
          {['A1', 'A2', 'B1', 'B2'].map((l) =>
          <button key={l} className={`tweak-pill ${tweaks.level === l ? 'active' : ''}`} onClick={() => update('level', l)}>{l}</button>
          )}
        </div>
      </div>

      <div className="tweak-row">
        <span className="tweak-label">Theme</span>
        <div className="tweak-options">
          {[['light', 'Claro'], ['dark', 'Oscuro']].map(([k, l]) =>
          <button key={k} className={`tweak-pill ${tweaks.theme === k ? 'active' : ''}`} onClick={() => update('theme', k)}>{l}</button>
          )}
        </div>
      </div>

      <div className="tweak-row">
        <span className="tweak-label">Language</span>
        <div className="tweak-options">
          {[['es', 'Español'], ['en', 'English']].map(([k, l]) =>
          <button key={k} className={`tweak-pill ${tweaks.language === k ? 'active' : ''}`} onClick={() => update('language', k)}>{l}</button>
          )}
        </div>
      </div>
    </div>);

}

function App() {
  const [tweaks, setTweaks] = useState(() => {
    const saved = localStorage.getItem('ih-tweaks');
    return saved ? { ...TWEAK_DEFAULTS, ...JSON.parse(saved) } : TWEAK_DEFAULTS;
  });
  const [surface, setSurface] = useState(() => localStorage.getItem('ih-surface') || 'all');
  const [empScreen, setEmpScreen] = useState(() => localStorage.getItem('ih-screen') || 'welcome');
  const [tweaksVisible, setTweaksVisible] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', tweaks.accent);
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    localStorage.setItem('ih-tweaks', JSON.stringify(tweaks));
  }, [tweaks]);

  useEffect(() => {localStorage.setItem('ih-surface', surface);}, [surface]);
  useEffect(() => {localStorage.setItem('ih-screen', empScreen);}, [empScreen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const T = {
    es: {
      eyebrow: 'Producto · Abril 2026',
      title: ['Cada hotel del mundo tiene empleados', <br key="b" />, 'que hablan inglés — ', <em key="e">el de ellos.</em>],
      sub: 'Una evaluación de 15 minutos. Un plan de 3 meses. Cinco minutos diarios. Inglés funcional para hospitalidad, medido y visible.',
      tabs: { all: 'Tres superficies', emp: 'Empleado', hr: 'RH', wa: 'WhatsApp' },
      s1: 'Empleado · Examen y práctica diaria',
      s2: 'Recursos Humanos · Visibilidad y reportes',
      s3: 'WhatsApp · Canal principal de práctica'
    },
    en: {
      eyebrow: 'Product · April 2026',
      title: ['Every hotel has staff who speak English —', <br key="b" />, <em key="e">theirs.</em>],
      sub: 'A 15-minute placement. A 3-month plan. Five minutes a day. Functional hospitality English, measured and visible.',
      tabs: { all: 'Three surfaces', emp: 'Employee', hr: 'HR', wa: 'WhatsApp' },
      s1: 'Employee · Placement & daily practice',
      s2: 'Human Resources · Visibility & reporting',
      s3: 'WhatsApp · Primary practice channel'
    }
  }[tweaks.language];

  const scrnFlow = ['welcome', 'role', 'diagnostic', 'listening', 'speaking', 'results', 'home'];
  const scrnLabels = {
    welcome: '01 · Bienvenida',
    role: '02 · Puesto',
    diagnostic: '03 · Diagnóstico',
    listening: '04 · Escucha',
    speaking: '05 · Habla',
    results: '06 · Resultado',
    home: '07 · Inicio diario'
  };

  return (
    <div className="app-shell">
      <div className="top-nav">
        <div className="brand">
          <span className="brand-mark">Inglés <em style={{ color: 'var(--accent)' }}>Hotelero</em></span>
          <span className="brand-tag">Prototipo · v0.1</span>
        </div>
        <div className="surface-tabs">
          {Object.entries(T.tabs).map(([k, l]) =>
          <button key={k} className={`surface-tab ${surface === k ? 'active' : ''}`} onClick={() => setSurface(k)}>{l}</button>
          )}
        </div>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Hotel Gran Cabo
          </div>
          <button
            onClick={() => {
              const next = tweaks.theme === 'dark' ? 'light' : 'dark';
              setTweaks({ ...tweaks, theme: next });
              window.parent.postMessage({type: '__edit_mode_set_keys', edits: { theme: next }}, '*');
            }}
            style={{
              width:34, height:34, borderRadius:'50%',
              border:'1px solid var(--hair)', background:'var(--bg)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'var(--text)', fontSize:14
            }}
            title={tweaks.theme === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro'}
          >
            {tweaks.theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>

      <div className="canvas">
        <div className="canvas-header">
          <div className="canvas-eyebrow">{T.eyebrow}</div>
          <h1 className="canvas-title" style={{ fontWeight: "500" }}>{T.title}</h1>
          <p className="canvas-sub">{T.sub}</p>
        </div>

        {surface === 'all' &&
        <div data-screen-label="Three surfaces">
            <div className="section-divider">
              <span className="num">01</span>
              <span className="line"></span>
              <span className="label">{T.s1}</span>
            </div>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
              {scrnFlow.map((s) =>
            <button key={s} className={`tweak-pill ${empScreen === s ? 'active' : ''}`} onClick={() => setEmpScreen(s)}>
                  {scrnLabels[s]}
                </button>
            )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
              <EmployeeFlow role={tweaks.role} level={tweaks.level} screen={empScreen} setScreen={setEmpScreen} />
            </div>

            <div className="section-divider">
              <span className="num">02</span>
              <span className="line"></span>
              <span className="label">{T.s2}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
              <HRDashboard role={tweaks.role} level={tweaks.level} />
            </div>

            <div className="section-divider">
              <span className="num">03</span>
              <span className="line"></span>
              <span className="label">{T.s3}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
              <WhatsAppView role={tweaks.role} level={tweaks.level} />
            </div>
          </div>
        }

        {surface === 'emp' &&
        <div data-screen-label="Employee">
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
              {scrnFlow.map((s) =>
            <button key={s} className={`tweak-pill ${empScreen === s ? 'active' : ''}`} onClick={() => setEmpScreen(s)}>
                  {scrnLabels[s]}
                </button>
            )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EmployeeFlow role={tweaks.role} level={tweaks.level} screen={empScreen} setScreen={setEmpScreen} />
            </div>
          </div>
        }

        {surface === 'hr' &&
        <div style={{ display: 'flex', justifyContent: 'center' }} data-screen-label="HR Dashboard">
            <HRDashboard role={tweaks.role} level={tweaks.level} />
          </div>
        }

        {surface === 'wa' &&
        <div style={{ display: 'flex', justifyContent: 'center' }} data-screen-label="WhatsApp">
            <WhatsAppView role={tweaks.role} level={tweaks.level} />
          </div>
        }
      </div>

      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} />
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);