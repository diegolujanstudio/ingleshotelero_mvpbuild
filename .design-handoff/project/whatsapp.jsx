// === WHATSAPP CONVERSATION ===

function WhatsAppView({ role, level }) {
  const content = ROLE_CONTENT[role];
  const listen = content.listening[level];
  const speak = content.speaking[level];
  const roleName = content.es.name;

  return (
    <div className="surface-card">
      <div className="surface-caption"><span className="dot"></span>WhatsApp · Práctica diaria</div>
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-notch"></div>
          <div className="phone-status">
            <span>9:41</span>
            <span>●●● ● ◐</span>
          </div>
          <div className="wa-header" style={{marginTop: 8}}>
            <div className="wa-avatar">IH</div>
            <div style={{flex:1}}>
              <div className="wa-header-name">Inglés Hotelero</div>
              <div className="wa-header-status">en línea · escribiendo...</div>
            </div>
            <div style={{opacity:0.5, fontSize:18}}>⋮</div>
          </div>
          <div className="wa-chat">
            <div style={{alignSelf:'center', fontSize:10, fontFamily:'var(--mono)', color:'var(--text-muted)', letterSpacing:'0.14em', padding:'4px 10px', background:'var(--bg)', borderRadius:10, border:'1px solid var(--hair)'}}>MARTES · 9:00</div>

            <div className="wa-msg bot">
              ¡Buenos días, María! ☕<br/><br/>
              <strong>Día 12</strong> de su racha. 🔥<br/>
              Su ejercicio de hoy tomará <strong>5 min</strong>.
              <div className="wa-msg-time">9:00</div>
            </div>

            <div className="wa-msg bot">
              🎧 <strong>Escuche</strong> al huésped y seleccione:
              <div className="wa-audio">
                <div className="wa-play">▶</div>
                <div className="wa-wave">
                  {Array.from({length:26}).map((_,i) => <span key={i} style={{height: 4 + Math.abs(Math.sin(i*1.4))*14}}></span>)}
                </div>
                <span className="wa-duration">0:08</span>
              </div>
              <div style={{fontFamily:'var(--serif)', fontSize:12, color:'var(--text-muted)', marginTop:4}}>
                "{listen.en}"
              </div>
              <div className="wa-quick-replies">
                {listen.opts.map((o, i) => (
                  <div key={i} className="wa-qr">{i+1}. {o.label}</div>
                ))}
              </div>
              <div className="wa-msg-time">9:00</div>
            </div>

            <div className="wa-msg me">
              {listen.opts.findIndex(o=>o.correct)+1}
              <div className="wa-msg-time">9:01 ✓✓</div>
            </div>

            <div className="wa-msg bot">
              ✅ <strong>¡Correcto!</strong><br/>
              Ahora responda en inglés:
              <div style={{marginTop:8, padding:10, background:'var(--bg-soft)', borderRadius:8, borderLeft:'2px solid var(--accent)', fontFamily:'var(--serif)', fontSize:13}}>
                {speak.scenario}
              </div>
              <div style={{fontSize:11, color:'var(--text-muted)', marginTop:6}}>🎙️ Envíe un audio en inglés</div>
              <div className="wa-msg-time">9:01</div>
            </div>

            <div className="wa-msg me">
              <div className="wa-audio">
                <div className="wa-play" style={{background:'var(--text)'}}>▶</div>
                <div className="wa-wave">
                  {Array.from({length:22}).map((_,i) => <span key={i} style={{height: 4 + Math.abs(Math.cos(i*0.9))*16, background:'var(--accent-deep)'}}></span>)}
                </div>
                <span className="wa-duration">0:14</span>
              </div>
              <div className="wa-msg-time">9:02 ✓✓</div>
            </div>

            <div className="wa-msg bot">
              Muy bien. Usted dijo:<br/>
              <em style={{color:'var(--text-muted)', fontSize:12}}>"Yes, of course. I take your bags to room."</em>
              <div style={{marginTop:10, padding:10, background:'var(--accent-soft)', borderRadius:8, fontFamily:'var(--serif)', fontSize:13, color:'var(--accent-deep)'}}>
                💡 Intente: <strong>"Of course, sir. I'll take your luggage to room 304 right away."</strong>
              </div>
              <div className="wa-audio" style={{marginTop:6}}>
                <div className="wa-play">▶</div>
                <div className="wa-wave">
                  {Array.from({length:22}).map((_,i) => <span key={i} style={{height: 4 + Math.abs(Math.sin(i*1.1))*14}}></span>)}
                </div>
                <span className="wa-duration">0:05</span>
              </div>
              <div style={{fontSize:10, color:'var(--text-muted)', marginTop:4, fontFamily:'var(--mono)', letterSpacing:'0.08em'}}>MODELO · ESCUCHAR</div>
              <div className="wa-msg-time">9:02</div>
            </div>

            <div className="wa-msg bot" style={{background:'var(--text)', color:'var(--bg)', borderColor:'var(--text)'}}>
              <div style={{fontFamily:'var(--mono)', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', opacity:0.6, marginBottom:6}}>Resumen de hoy</div>
              <div style={{display:'flex', gap:14, alignItems:'baseline'}}>
                <div>
                  <div style={{fontFamily:'var(--serif)', fontSize:24, color:'var(--accent)'}}>🔥 13</div>
                  <div style={{fontSize:9, opacity:0.6, fontFamily:'var(--mono)', letterSpacing:'0.12em'}}>DÍAS</div>
                </div>
                <div>
                  <div style={{fontFamily:'var(--serif)', fontSize:24, }}>{level}</div>
                  <div style={{fontSize:9, opacity:0.6, fontFamily:'var(--mono)', letterSpacing:'0.12em'}}>NIVEL</div>
                </div>
                <div>
                  <div style={{fontFamily:'var(--serif)', fontSize:24, }}>48%</div>
                  <div style={{fontSize:9, opacity:0.6, fontFamily:'var(--mono)', letterSpacing:'0.12em'}}>MES 2</div>
                </div>
              </div>
              <div className="wa-msg-time" style={{color:'rgba(255,255,255,0.5)'}}>9:02</div>
            </div>
          </div>
          <div className="wa-input-bar">
            <div style={{opacity:0.5, fontSize:18}}>📎</div>
            <div className="box">Escriba un mensaje</div>
            <div className="wa-mic" style={{width:36, height:36, background:'var(--accent)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>🎙</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.WhatsAppView = WhatsAppView;
