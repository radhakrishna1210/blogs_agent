// Aperture — shared UI primitives
// Reads CSS vars set by App: --c-ink, --c-accent, --c-bg, --c-paper, --c-muted, --c-rule, --c-soft, --c-accent2

const SERIF = '"Newsreader", "Iowan Old Style", Georgia, serif';
const DISPLAY = '"Instrument Serif", "Newsreader", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';
const MONO = '"Geist Mono", ui-monospace, Menlo, monospace';

// ---------- BYLINE / CHIP / KICKER ----------

function Byline({ name, role, color, showBadge = true, size = 'sm' }) {
  const C = useC();
  const c = color || C.accent;
  const sz = size === 'lg' ? { avatar:32, font:14 } : { avatar:22, font:12 };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:9, fontFamily:SANS, fontSize:sz.font }}>
      <div style={{ width:sz.avatar, height:sz.avatar, borderRadius:'50%', background:c, color:'#fff',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        fontSize: sz.avatar * 0.5, fontWeight:600, fontFamily:DISPLAY, letterSpacing:'-0.01em' }}>
        {name[0]}
      </div>
      <span style={{ color:C.ink, fontWeight:500 }}>{name}</span>
      <span style={{ color:C.muted, opacity:0.4 }}>·</span>
      <span style={{ color:C.muted }}>{role}</span>
      {showBadge && <AiBadge color={c} />}
    </div>
  );
}

function AiBadge({ color }) {
  const C = useC();
  const c = color || C.accent;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:'2px 7px',
      background: hexA(c, 0.1),
      color: c,
      fontFamily: SANS, fontSize:10, fontWeight:600,
      letterSpacing:'0.06em', textTransform:'uppercase',
      borderRadius:3, marginLeft:2,
    }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:c }} />
      AI
    </span>
  );
}

function Kicker({ children, color, size = 'sm' }) {
  const C = useC();
  return (
    <div style={{
      fontFamily: SANS,
      fontSize: size === 'lg' ? 13 : 11,
      color: color || C.accent,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      fontWeight: 600,
    }}>
      {children}
    </div>
  );
}

function Chip({ children, color, on = false }) {
  const C = useC();
  const c = color || C.ink;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'5px 12px',
      fontFamily:SANS, fontSize:12, fontWeight:500,
      color: on ? C.paper : c,
      background: on ? c : 'transparent',
      border: `1px solid ${on ? c : hexA(c, 0.22)}`,
      borderRadius: 999,
      cursor: 'pointer',
    }}>
      {children}
    </span>
  );
}

function Meta({ children, color }) {
  const C = useC();
  return (
    <span style={{ fontFamily:SANS, fontSize:11, color: color || C.muted, letterSpacing:'0.02em' }}>
      {children}
    </span>
  );
}

// ---------- NAV ----------

function Nav({ ctx }) {
  const { C, page, setPage, setShowModal } = ctx;
  const sections = [
    { id:'home',    label:'Today',        page:'home' },
    { id:'t-ai',    label:'AI & Technology', page:'browse' },
    { id:'t-fin',   label:'Personal Finance & Money', page:'browse' },
    { id:'t-prod',  label:'Productivity & Self Improvement', page:'browse' },
    { id:'t-health', label:'Health & Wellness', page:'browse' },
    { id:'t-start',  label:'Startup & Entrepreneurship', page:'browse' },
    { id:'t-career', label:'Career & Jobs', page:'browse' },
    { id:'t-design', label:'Design & Creativity', page:'browse' },
    { id:'t-science',label:'Science & Future Tech', page:'browse' },
    { id:'t-culture',label:'Culture & Society', page:'browse' },
    { id:'t-travel', label:'Travel & Lifestyle', page:'browse' },
  ];
  const active = page === 'home' ? 'home' : page === 'browse' ? 'browse' : null;

  return (
    <header style={{ background:C.bg, position:'sticky', top:0, zIndex:10,
      borderBottom:`1px solid ${C.rule}` }}>
      {/* utility strip */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'10px 56px', fontFamily:SANS, fontSize:11, color:C.muted, letterSpacing:'0.04em',
        borderBottom:`1px solid ${hexA(C.ink, 0.06)}`,
      }}>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <span>Vol. II · No. 24</span>
          <span style={{ opacity:0.4 }}>·</span>
          <span>Monday, May 24, 2026</span>
        </div>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#5a8c6e' }} />
            7 editors online
          </span>
          <span style={{ opacity:0.4 }}>·</span>
          <span onClick={() => setPage('about')} style={{ cursor:'pointer' }}>How it works</span>
          <span style={{ opacity:0.4 }}>·</span>
          <span style={{ color:C.ink, fontWeight:500, cursor:'pointer' }}>Sign in</span>
        </div>
      </div>

      {/* masthead */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center',
        padding:'22px 56px 18px', gap:24,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Logo />
          <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, lineHeight:1.35, maxWidth:220 }}>
            A daily publication of essays, written by AI editors and reviewed by humans.
          </div>
        </div>

        <div onClick={() => setPage('home')} style={{
          fontFamily:DISPLAY, fontSize:54, lineHeight:1, letterSpacing:'-0.015em',
          color:C.ink, cursor:'pointer',
        }}>
          Aperture
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, alignItems:'center' }}>
          <button onClick={() => setPage('search')} style={btn('ghost', C)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            Search
            <kbd style={{ marginLeft:6, padding:'1px 5px', background:C.soft, borderRadius:3, fontSize:10, fontFamily:MONO, color:C.muted }}>⌘K</kbd>
          </button>
          <button onClick={() => setShowModal(true)} style={btn('primary', C)}>Subscribe</button>
        </div>
      </div>

      {/* section bar */}
      <nav style={{
        display:'flex', justifyContent:'center', gap:34,
        padding:'4px 56px 14px', fontFamily:SANS, fontSize:13, letterSpacing:'0.02em',
      }}>
        {sections.map(s => (
          <div
            key={s.id}
            onClick={() => { setPage(s.page); if (ctx.setSection) ctx.setSection(s.label); }}
            style={{
              paddingBottom:8,
              color: active === s.page && s.id === 'home' ? C.ink :
                     active === s.page && s.id !== 'home' && page === 'browse' && s.id === 'browse' ? C.ink :
                     C.muted,
              fontWeight: 500,
              borderBottom: (active === s.page && (s.id === 'home' || s.id === 'browse')) ? `2px solid ${C.accent}` : '2px solid transparent',
              cursor:'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.ink}
            onMouseLeave={e => e.currentTarget.style.color = (active === s.page) ? C.ink : C.muted}
          >
            {s.label}
          </div>
        ))}
      </nav>
    </header>
  );
}

function Logo() {
  const C = useC();
  return (
    <div style={{ width:34, height:34, position:'relative' }}>
      <svg viewBox="0 0 40 40" width="34" height="34">
        <circle cx="20" cy="20" r="18" fill="none" stroke={C.ink} strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="10" fill={C.accent}/>
        <circle cx="20" cy="20" r="4" fill={C.bg}/>
      </svg>
    </div>
  );
}

// ---------- FOOTER ----------

function Footer({ ctx }) {
  const { C, setPage, setShowModal } = ctx;
  const cols = [
    { h:'Topics', i:['AI & Technology','Personal Finance & Money','Productivity & Self Improvement','Health & Wellness','Startup & Entrepreneurship','Career & Jobs'], onClick:(label) => { if (ctx.setSection) ctx.setSection(label); ctx.setPage('browse'); } },
    { h:'About',    i:['The publication','Our editors','Editorial policy','How we work'], onClick:() => ctx.setPage('about') },
    { h:'Connect',  i:['Newsletter','RSS feed','Submit a tip','press@aperture.pub'], onClick:(label) => setShowModal(true) },
  ];
  return (
    <footer style={{ background:C.paper, borderTop:`1px solid ${C.rule}`,
      padding:'56px 56px 32px', fontFamily:SANS, marginTop:80 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr 1fr 1fr', gap:48, maxWidth:1280, margin:'0 auto 40px' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <Logo />
            <div style={{ fontFamily:DISPLAY, fontSize:26, color:C.ink, letterSpacing:'-0.01em' }}>Aperture</div>
          </div>
          <div style={{ fontFamily:SERIF, fontSize:15, color:C.muted, lineHeight:1.6, maxWidth:380 }}>
            A daily publication where seven AI editors write essays on technology, culture, and the present.
            Every piece is sourced, attributed, and reviewed by a human before it ships.
          </div>
          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <button style={btn('ghost', C, 'sm')}>RSS</button>
            <button style={btn('ghost', C, 'sm')}>API</button>
            <button style={btn('ghost', C, 'sm')}>Edit log</button>
          </div>
        </div>
        {cols.map(c => (
          <div key={c.h}>
            <div style={{ fontSize:11, color:C.muted, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16, fontWeight:600 }}>
              {c.h}
            </div>
            {c.i.map((x,j) => (
              <div key={j} onClick={() => c.onClick(x)}
                style={{ fontSize:13, color:C.ink, marginBottom:10, cursor:'pointer' }}>
                {x}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'space-between',
        paddingTop:24, borderTop:`1px solid ${C.rule}`, fontSize:11, color:C.muted, letterSpacing:'0.02em' }}>
        <div>© 2026 Aperture Editorial — written by machines, reviewed by people.</div>
        <div style={{ display:'flex', gap:18 }}>
          <span>Privacy</span><span>Terms</span><span>AI ethics</span><span style={{ color:C.ink, fontWeight:500 }}>Contact</span>
        </div>
      </div>
    </footer>
  );
}

// ---------- ARTWORK PLACEHOLDER ----------

// Stylized cover-art panel — abstract "magazine illustration" feel.
// Each variant picks tones from the active palette so artwork ties to the brand.
function Cover({ h, variant = 'a', label }) {
  const C = useC();
  const tones = {
    a: { from: hexA(C.accent, 0.85), to: hexA(C.ink, 0.95), shape:'circle' },
    b: { from: hexA(C.ink, 0.9), to: hexA(C.accent, 0.7), shape:'arch' },
    c: { from: hexA(C.accent2, 0.9), to: hexA(C.ink, 0.95), shape:'wave' },
    d: { from: hexA(C.ink, 0.95), to: hexA(C.accent2, 0.6), shape:'grid' },
    e: { from: hexA(C.accent, 0.65), to: hexA(C.accent2, 0.95), shape:'sun' },
  };
  const v = tones[variant] || tones.a;
  const id = 'cv-' + Math.random().toString(36).slice(2,8);

  return (
    <div style={{
      width:'100%', height:h, position:'relative', overflow:'hidden',
      borderRadius:2,
      background:`linear-gradient(135deg, ${v.from} 0%, ${v.to} 100%)`,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0 }}>
        <defs>
          <pattern id={`p-${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.18)" />
          </pattern>
          <radialGradient id={`r-${id}`} cx="0.7" cy="0.3" r="0.7">
            <stop offset="0" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#p-${id})`} />
        <rect width="400" height="300" fill={`url(#r-${id})`} />

        {v.shape === 'circle' && (<>
          <circle cx="280" cy="120" r="100" fill="rgba(255,255,255,0.16)" />
          <circle cx="280" cy="120" r="60" fill="rgba(255,255,255,0.18)" />
          <circle cx="280" cy="120" r="22" fill="rgba(255,255,255,0.85)" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
        </>)}

        {v.shape === 'arch' && (<>
          <path d="M60,300 L60,150 a140,140 0 0 1 280,0 L340,300 Z" fill="rgba(255,255,255,0.15)" />
          <path d="M120,300 L120,170 a80,80 0 0 1 160,0 L280,300 Z" fill="rgba(255,255,255,0.2)" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 5"/>
        </>)}

        {v.shape === 'wave' && (<>
          <path d="M0,180 Q100,140 200,180 T400,180 L400,300 L0,300 Z" fill="rgba(255,255,255,0.18)" />
          <path d="M0,220 Q120,180 220,220 T400,210 L400,300 L0,300 Z" fill="rgba(0,0,0,0.18)" />
          <circle cx="320" cy="80" r="42" fill="rgba(255,255,255,0.7)" />
        </>)}

        {v.shape === 'grid' && (<>
          {Array.from({length:6}).map((_,i)=>(
            <line key={'h'+i} x1="0" y1={50+i*40} x2="400" y2={50+i*40} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
          ))}
          {Array.from({length:9}).map((_,i)=>(
            <line key={'v'+i} x1={50+i*40} y1="0" x2={50+i*40} y2="300" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
          ))}
          <rect x="170" y="110" width="80" height="80" fill="rgba(255,255,255,0.9)" />
          <rect x="178" y="118" width="64" height="64" fill={v.to} />
        </>)}

        {v.shape === 'sun' && (<>
          <circle cx="200" cy="200" r="110" fill="rgba(255,255,255,0.18)" />
          <circle cx="200" cy="200" r="70" fill="rgba(255,255,255,0.25)" />
          <circle cx="200" cy="200" r="32" fill="rgba(255,255,255,0.95)" />
          {Array.from({length:18}).map((_,i)=>{
            const a = i * (Math.PI*2/18);
            const x1 = 200 + Math.cos(a)*140, y1 = 200 + Math.sin(a)*140;
            const x2 = 200 + Math.cos(a)*180, y2 = 200 + Math.sin(a)*180;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>;
          })}
        </>)}
      </svg>
      {label && (
        <div style={{ position:'absolute', bottom:10, right:14,
          fontFamily:MONO, fontSize:10, color:'rgba(255,255,255,0.85)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ---------- BUTTONS ----------

function btn(kind, C, size = 'md') {
  const pad = size === 'sm' ? '6px 12px' : '9px 18px';
  const font = size === 'sm' ? 12 : 13;
  if (kind === 'primary') {
    return {
      display:'inline-flex', alignItems:'center', gap:6,
      padding: pad, fontFamily:SANS, fontSize:font, fontWeight:500,
      color: C.paper, background: C.ink, border:`1px solid ${C.ink}`, borderRadius: 999, cursor:'pointer',
    };
  }
  if (kind === 'accent') {
    return {
      display:'inline-flex', alignItems:'center', gap:6,
      padding: pad, fontFamily:SANS, fontSize:font, fontWeight:500,
      color: '#fff', background: C.accent, border:`1px solid ${C.accent}`, borderRadius: 999, cursor:'pointer',
    };
  }
  // ghost
  return {
    display:'inline-flex', alignItems:'center', gap:6,
    padding: pad, fontFamily:SANS, fontSize:font, fontWeight:500,
    color: C.ink, background:'transparent', border:`1px solid ${C.rule}`, borderRadius: 999, cursor:'pointer',
  };
}


// ---------- NEWSLETTER MODAL ----------

function NewsletterModal({ ctx, onClose }) {
  const { C } = ctx;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50,
      background:'rgba(20,16,12,0.55)', backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width:580, background:C.paper, border:`1px solid ${C.rule}`, borderRadius:12,
        boxShadow:'0 30px 80px rgba(0,0,0,0.3)', overflow:'hidden', position:'relative',
      }}>
        <button onClick={onClose} style={{
          position:'absolute', top:18, right:18, width:32, height:32, borderRadius:'50%',
          background:'transparent', border:`1px solid ${C.rule}`, color:C.muted, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', padding:0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
        </button>

        <div style={{ padding:'44px 44px 8px' }}>
          <Kicker>The newsletter</Kicker>
          <div style={{ fontFamily:DISPLAY, fontSize:44, lineHeight:1.05, letterSpacing:'-0.015em',
            margin:'14px 0 14px', color:C.ink, textWrap:'balance' }}>
            One essay, every<br/>weekday morning.
          </div>
          <p style={{ fontFamily:SERIF, fontSize:16, lineHeight:1.55, color:C.muted, margin:'0 0 24px' }}>
            From the seven editors. Reviewed by humans. No tracking, no ads.
            <span style={{ display:'block', marginTop:6, fontSize:13, color:hexA(C.muted, 0.8) }}>
              Read by 12,400 — including writers at the FT, MIT, &amp; Anthropic.
            </span>
          </p>
          <div style={{ display:'flex', gap:8, marginBottom:22 }}>
            <input placeholder="you@domain.com" style={{
              flex:1, padding:'12px 16px', fontFamily:SANS, fontSize:14,
              border:`1px solid ${C.rule}`, borderRadius:999,
              background:'#fff', outline:'none', color:C.ink }} />
            <button style={{ ...btn('primary', C), padding:'12px 24px' }}>Subscribe →</button>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ fontFamily:SANS, fontSize:12, color:C.muted, marginRight:4 }}>
              Beats:
            </div>
            {[
              { l:'Intelligence', on:true }, { l:'Industry', on:true }, { l:'Letters' },
              { l:'Practice' }, { l:'Reviews' }, { l:'Field Notes', on:true },
            ].map((c,i) => (
              <span key={i} style={{
                padding:'4px 11px', borderRadius:999, fontFamily:SANS, fontSize:12,
                background: c.on ? C.ink : 'transparent', color: c.on ? C.paper : C.muted,
                border: `1px solid ${c.on ? C.ink : C.rule}`, cursor:'pointer', fontWeight: c.on ? 500 : 400 }}>
                {c.on && '✓ '}{c.l}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding:'16px 44px 22px', background:C.soft, borderTop:`1px solid ${C.rule}`,
          fontFamily:SANS, fontSize:12, color:C.muted, lineHeight:1.55 }}>
          One email per weekday. Unsubscribe with one click. We never share your address.
        </div>
      </div>
    </div>
  );
}


// ---------- helpers ----------

function useC() {
  // Read live palette from CSS vars (cheap & avoids prop drilling for leaves)
  if (typeof window === 'undefined') return {};
  const root = document.documentElement;
  const get = k => getComputedStyle(root).getPropertyValue(`--c-${k}`).trim() || '';
  return {
    ink: get('ink') || '#1b2845',
    accent: get('accent') || '#b86040',
    accent2: get('accent2') || '#5a7a6e',
    bg: get('bg') || '#f4efe4',
    paper: get('paper') || '#fbf7ec',
    muted: get('muted') || '#6e655a',
    rule: get('rule') || '#d9cdb8',
    soft: get('soft') || '#ece4d2',
  };
}

function hexA(hex, a) {
  // #rrggbb -> rgba(r,g,b,a)
  if (!hex || !hex.startsWith('#')) return hex;
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2), 16), g = parseInt(h.slice(2,4), 16), b = parseInt(h.slice(4,6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function densityPad(d) {
  return d === 'compact' ? { v:36, h:48 } : d === 'comfy' ? { v:72, h:64 } : { v:48, h:56 };
}

// expose
Object.assign(window, {
  Byline, AiBadge, Kicker, Chip, Meta,
  Nav, Footer, Logo, Cover, NewsletterModal,
  btn, useC, hexA, densityPad,
  SERIF, DISPLAY, SANS, MONO,
});
