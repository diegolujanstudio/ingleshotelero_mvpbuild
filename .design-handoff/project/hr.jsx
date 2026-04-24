// === HR DASHBOARD ===

function HRDashboard({ role, level }) {
  const employees = [
    { n: 'María López', r: 'frontdesk', l: 'B1', li: 78, sp: 72, st: 'active', la: 'Hoy' },
    { n: 'Carlos Mendoza', r: 'bellboy', l: 'A2', li: 62, sp: 54, st: 'active', la: 'Hoy' },
    { n: 'Ana Ramírez', r: 'restaurant', l: 'B2', li: 91, sp: 87, st: 'active', la: 'Ayer' },
    { n: 'Juan Pérez', r: 'frontdesk', l: 'A1', li: 28, sp: 22, st: 'cold', la: 'Hace 5 días' },
    { n: 'Sofía Torres', r: 'restaurant', l: 'B1', li: 74, sp: 68, st: 'active', la: 'Hoy' },
    { n: 'Luis Hernández', r: 'bellboy', l: 'A2', li: 58, sp: 51, st: 'warn', la: 'Hace 2 días' },
    { n: 'Patricia Vega', r: 'frontdesk', l: 'B1', li: 70, sp: 65, st: 'active', la: 'Hoy' },
    { n: 'Roberto Silva', r: 'restaurant', l: 'A2', li: 44, sp: 38, st: 'warn', la: 'Hace 3 días' },
    { n: 'Lucía Morales', r: 'bellboy', l: 'B1', li: 76, sp: 70, st: 'active', la: 'Hoy' },
  ];

  const roleNames = { bellboy: 'Botones', frontdesk: 'Recepción', restaurant: 'Restaurante' };
  const distribution = [
    { lvl: 'A1', count: 8, pct: 20 },
    { lvl: 'A2', count: 14, pct: 35 },
    { lvl: 'B1', count: 12, pct: 30 },
    { lvl: 'B2', count: 6, pct: 15 },
  ];

  return (
    <div className="surface-card" style={{alignItems:'stretch', width:'100%', maxWidth: 1100}}>
      <div className="surface-caption"><span className="dot"></span>Recursos Humanos · Panel de control</div>
      <div className="hr-wrap" style={{width: '100%'}}>
        <div className="hr-shell">
          <aside className="hr-side">
            <div className="hr-side-brand">Inglés Hotelero</div>
            <div className="hr-side-sub">Hotel Gran Cabo</div>

            <div className="hr-nav-label">Vista general</div>
            <div className="hr-nav-item active"><span>Panel</span><span className="ct">40</span></div>
            <div className="hr-nav-item"><span>Empleados</span><span className="ct">40</span></div>
            <div className="hr-nav-item"><span>Cohortes</span><span className="ct">3</span></div>

            <div className="hr-nav-label">Reportes</div>
            <div className="hr-nav-item"><span>Evaluación</span></div>
            <div className="hr-nav-item"><span>Progreso semanal</span></div>
            <div className="hr-nav-item"><span>Exportar PDF</span></div>

            <div className="hr-nav-label">Configuración</div>
            <div className="hr-nav-item"><span>Propiedades</span><span className="ct">1</span></div>
            <div className="hr-nav-item"><span>Plan</span><span className="ct">Pro</span></div>

            <div style={{marginTop: 40, padding:14, border:'1px solid var(--hair)', borderRadius:10, background:'var(--bg)'}}>
              <div style={{fontFamily:'var(--mono)', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6}}>Reporte listo</div>
              <div style={{fontFamily:'var(--serif)', fontSize:14, marginBottom:8}}>Evaluación · Abril 2026</div>
              <button style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--accent)', letterSpacing:'0.1em', textTransform:'uppercase'}}>↓ Descargar PDF</button>
            </div>
          </aside>

          <main className="hr-main">
            <div className="hr-head">
              <div>
                <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6}}>Panel · Abril 2026</div>
                <div className="hr-head-title">Su equipo en <em>inglés</em></div>
                <div className="hr-head-sub">40 empleados · 3 departamentos · Evaluación completada</div>
              </div>
              <div className="hr-head-right">
                <button className="hr-btn">Enviar recordatorio</button>
                <button className="hr-btn primary">+ Nueva cohorte</button>
              </div>
            </div>

            <div className="stat-grid">
              <div className="stat">
                <div className="stat-label">Evaluados</div>
                <div className="stat-value"><em>40</em><span style={{fontSize:18, opacity:0.3}}>/40</span></div>
                <div className="stat-delta">100% · Cerrado hace 2 días</div>
              </div>
              <div className="stat">
                <div className="stat-label">Nivel promedio</div>
                <div className="stat-value">A2<span style={{fontSize:22, color:'var(--text-muted)'}}>→</span><em>B1</em></div>
                <div className="stat-delta">+0.4 vs línea base</div>
              </div>
              <div className="stat">
                <div className="stat-label">Activos esta semana</div>
                <div className="stat-value">34<span style={{fontSize:18, opacity:0.3}}>/40</span></div>
                <div className="stat-delta">85% · +3 vs semana pasada</div>
              </div>
              <div className="stat">
                <div className="stat-label">Racha promedio</div>
                <div className="stat-value">8<span style={{fontSize:18, opacity:0.3}}>d</span></div>
                <div className="stat-delta">2 empleados &gt; 20 días</div>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:20, marginBottom:28}}>
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title">Distribución de <em>niveles</em></div>
                  <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-muted)', letterSpacing:'0.12em', textTransform:'uppercase'}}>Toda la propiedad</div>
                </div>
                <div className="panel-body">
                  {distribution.map(d => (
                    <div key={d.lvl} className="dist">
                      <div className="dist-label">{d.lvl} <span style={{color:'var(--text-muted)', fontSize:9}}>{LEVEL_DESC[d.lvl].toUpperCase()}</span></div>
                      <div className="dist-track"><div className="dist-fill" style={{width:`${d.pct*2.5}%`}}></div></div>
                      <div className="dist-count">{d.count} · {d.pct}%</div>
                    </div>
                  ))}
                  <div style={{marginTop:16, paddingTop:14, borderTop:'1px solid var(--hair)', fontSize:12, color:'var(--text-soft)', lineHeight:1.55}}>
                    <strong style={{fontWeight:500}}>Hallazgo:</strong> 55% del equipo en A2 o inferior. Un programa de 3 meses llevaría a 80%+ a B1 o superior.
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title">Por <em>departamento</em></div>
                </div>
                <div className="panel-body">
                  <div className="chart-bars">
                    {[
                      ['Botones', 62, 12],
                      ['Recepción', 78, 16],
                      ['Restaurante', 71, 12],
                    ].map(([l, v, ct]) => (
                      <div key={l} className="chart-col">
                        <div className="chart-bar" style={{height: `${v*1.4}px`}}>
                          <div className="pct">{v}%</div>
                        </div>
                        <div className="chart-label">{l.toUpperCase()}</div>
                        <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--text-muted)'}}>{ct} personas</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:16, fontSize:11, color:'var(--text-muted)', fontFamily:'var(--mono)', letterSpacing:'0.08em'}}>
                    % ACTIVOS · ÚLTIMOS 7 DÍAS
                  </div>
                </div>
              </div>
            </div>

            <div className="panel" style={{marginBottom:0}}>
              <div className="panel-head">
                <div className="panel-title">Empleados <em>·</em> Evaluación completa</div>
                <div style={{display:'flex', gap:8}}>
                  <button className="hr-btn">Filtrar</button>
                  <button className="hr-btn">Exportar</button>
                </div>
              </div>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Puesto</th>
                    <th>Nivel</th>
                    <th>Escucha</th>
                    <th>Habla</th>
                    <th>Estado</th>
                    <th>Última práctica</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e, i) => (
                    <tr key={i}>
                      <td><div className="name">{e.n}</div></td>
                      <td className="role">{roleNames[e.r]}</td>
                      <td><span className={`level-badge ${e.l.toLowerCase()}`}>{e.l}</span></td>
                      <td>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                          <div className="bar-track"><div className="bar-fill" style={{width:`${e.li}%`}}></div></div>
                          <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text-soft)'}}>{e.li}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                          <div className="bar-track"><div className="bar-fill" style={{width:`${e.sp}%`}}></div></div>
                          <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text-soft)'}}>{e.sp}</span>
                        </div>
                      </td>
                      <td><span className={`status-dot ${e.st}`}>{e.st === 'active' ? 'ACTIVO' : e.st === 'warn' ? 'ATENCIÓN' : 'INACTIVO'}</span></td>
                      <td style={{color:'var(--text-muted)', fontSize:12, fontFamily:'var(--mono)'}}>{e.la}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

window.HRDashboard = HRDashboard;
