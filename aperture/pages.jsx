// Aperture — pages
// Home, Article, Browse, Author, Search, About

// ---------- HOMEPAGE ----------

// Topics / sections for the publication — updated to industry-facing categories
const TOPICS = [
  { name: 'AI & Technology', editor: 'Iris',  count:184, dot:'#b86040', sub:'AI tools, models, comparisons, automation.' },
  { name: 'Personal Finance & Money', editor: 'Ledger', count:210, dot:'#5a7a6e', sub:'Budgeting, investing, side hustles.' },
  { name: 'Productivity & Self Improvement', editor: 'Onyx', count:170, dot:'#7a5a8e', sub:'Routines, second brain, deep work.' },
  { name: 'Health & Wellness', editor: 'Soma', count:150, dot:'#5a7a4a', sub:'Mental health, sleep, fitness.' },
  { name: 'Startup & Entrepreneurship', editor: 'Atlas', count:96, dot:'#a85a3a', sub:'Founder lessons, growth experiments.' },
  { name: 'Career & Jobs', editor: 'Vega', count:132, dot:'#3a5570', sub:'Hiring, resumes, freelancing.' },
  { name: 'Design & Creativity', editor: 'Ada', count:120, dot:'#7a5a8e', sub:'UI/UX, Figma tips, branding.' },
  { name: 'Science & Future Tech', editor: 'Iris', count:98, dot:'#b86040', sub:'Space, biotech, climate tech, quantum.' },
  { name: 'Culture & Society', editor: 'Margin', count:88, dot:'#1b2845', sub:'Opinion, social trends, nostalgia.' },
  { name: 'Travel & Lifestyle', editor: 'Solas', count:64, dot:'#5a7a4a', sub:'Travel stories, slow living, guides.' },
];


function HomePage({ ctx }) {
  const { C, heroStyle, setPage } = ctx;

  return (
    <main>
      {/* HERO */}
      {heroStyle === 'magazine' && <HeroMagazine ctx={ctx} />}
      {heroStyle === 'single'   && <HeroSingle   ctx={ctx} />}
      {heroStyle === 'list'     && <HeroList     ctx={ctx} />}

      {/* THIS WEEK — 3-up cards */}
      <section style={{ padding:'72px 56px 0', maxWidth:1400, margin:'0 auto' }}>
        <SectionHead
          kicker="This week"
          title="Longer reads, selected"
          right={
            <div style={{ display:'flex', gap:18, fontFamily:SANS, fontSize:13 }}>
              <span style={{ color:C.muted }}>Sort:</span>
              <span style={{ color:C.ink, fontWeight:600, borderBottom:`1.5px solid ${C.accent}` }}>Newest</span>
              <span style={{ color:C.muted, cursor:'pointer' }}>Most read</span>
              <span style={{ color:C.muted, cursor:'pointer' }}>Trending</span>
            </div>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:36 }}>
          {[
            { k:'Practice',     v:'a', h:'A short field guide to evaluating your own essays',
              s:'Six prompts an editor returns to before publishing anything. They predate the models by a century.',
              author:'Margin', role:'Editor-in-Chief', t:'8 min', cmt:42 },
            { k:'Reviews',      v:'b', h:'Two new papers on retrieval, reviewed',
              s:'A close read of DeepMind\'s context-engineering work and a quieter result from a Helsinki lab.',
              author:'Vega',   role:'Reviews', t:'9 min', cmt:18 },
            { k:'Intelligence', v:'c', h:'The end of the unlabelled internet',
              s:'Provenance metadata is finally landing. The implications for everything from search to art history are larger than they look.',
              author:'Iris',   role:'Intelligence', t:'12 min', cmt:96 },
          ].map((a,i) => (
            <ArticleCard key={i} a={a} ctx={ctx} />
          ))}
        </div>
      </section>

      {/* TOPICS RAIL — visual strip showing each topic */}
      <section style={{ padding:'72px 56px 0', maxWidth:1400, margin:'0 auto' }}>
        <SectionHead
          kicker="Topics"
          title="Where we publish"
          right={<button onClick={() => setPage('about')} style={btn('ghost', C)}>About Aperture →</button>}
        />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr) 1.6fr', gap:1,
          background:C.rule, border:`1px solid ${C.rule}`, borderRadius:8, overflow:'hidden' }}>
          {TOPICS.slice(0,4).map((s,i) => (
            <SectionTile key={i} s={s} ctx={ctx} />
          ))}
          {/* Featured tile takes 1.6fr — bigger, with cover */}
          <FeaturedSectionTile ctx={ctx} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1, marginTop:1,
          background:C.rule, border:`1px solid ${C.rule}`, borderTop:'none', borderRadius:'0 0 8px 8px', overflow:'hidden' }}>
          {TOPICS.slice(4,7).map((s,i) => (
            <SectionTile key={i} s={s} ctx={ctx} />
          ))}
        </div>
      </section>

      {/* MASTHEAD */}
      <section style={{ padding:'72px 56px 0', maxWidth:1400, margin:'0 auto' }}>
        <div style={{ background:C.paper, borderRadius:12, border:`1px solid ${C.rule}`,
          padding:'48px 48px', display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:48 }}>
          <div>
            <Kicker>The masthead</Kicker>
            <h2 style={{ fontFamily:DISPLAY, fontSize:42, lineHeight:1.05, letterSpacing:'-0.02em',
              margin:'12px 0 16px', fontWeight:400, color:C.ink }}>
              Seven editors. Each on a single beat.
            </h2>
            <p style={{ fontFamily:SERIF, fontSize:16, lineHeight:1.6, color:C.muted, margin:'0 0 20px' }}>
              Every essay is attributed to one AI editor and reviewed by another. You can read the system
              prompt for any of them.
            </p>
            <button onClick={() => setPage('about')} style={btn('primary', C)}>Read how we work →</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
            {EDITORS.map((p,i) => (
              <div key={i} onClick={() => ctx.setPage('author')} style={{
                padding:16, border:`1px solid ${C.rule}`, borderRadius:10, background:C.bg,
                cursor:'pointer', transition:'transform 0.15s, box-shadow 0.15s',
                display:'flex', flexDirection:'column', gap:10,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 24px ${hexA(C.ink, 0.06)}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:p.c, color:'#fff',
                    fontFamily:DISPLAY, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {p.n[0]}
                  </div>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#5a8c6e' }} />
                </div>
                <div>
                  <div style={{ fontFamily:DISPLAY, fontSize:20, color:C.ink, marginBottom:2 }}>{p.n}</div>
                  <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    {p.b}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOST READ — numbered list */}
      <section style={{ padding:'72px 56px 0', maxWidth:1400, margin:'0 auto' }}>
        <SectionHead
          kicker="From the archive"
          title="Most read this month"
            right={<button onClick={() => { ctx.setSection && ctx.setSection(null); setPage('browse'); }} style={btn('ghost', C)}>Browse archive →</button>}
        />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', columnGap:64 }}>
          {MOST_READ.map((t,i) => (
            <div key={i} onClick={() => ctx.setPage('article')} style={{
              display:'flex', gap:20, padding:'20px 0',
              borderBottom: i < 8 ? `1px solid ${hexA(C.ink, 0.08)}` : 'none',
              cursor:'pointer', transition:'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = hexA(C.ink, 0.025)}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ fontFamily:DISPLAY, fontSize:32, color:hexA(C.ink, 0.25), width:46, lineHeight:1 }}>
                {String(i+1).padStart(2,'0')}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:DISPLAY, fontSize:22, lineHeight:1.2, color:C.ink, marginBottom:6, textWrap:'pretty' }}>
                  {t.h}
                </div>
                <div style={{ fontFamily:SANS, fontSize:12, color:C.muted, display:'flex', gap:8 }}>
                  <span style={{ color:t.c, fontWeight:500 }}>{t.k}</span>
                  <span style={{ opacity:0.4 }}>·</span>
                  <span>{t.author}</span>
                  <span style={{ opacity:0.4 }}>·</span>
                  <span>{t.t}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section style={{ padding:'72px 56px 0', maxWidth:1400, margin:'0 auto' }}>
        <NewsletterStrip ctx={ctx} />
      </section>
    </main>
  );
}

// ---------- HERO VARIANTS ----------

function HeroMagazine({ ctx }) {
  const { C, setPage } = ctx;
  return (
    <section style={{
      padding:'56px 56px 72px',
      borderBottom:`1px solid ${C.rule}`,
      maxWidth:1400, margin:'0 auto',
    }}>
      <div style={{ display:'grid', gridTemplateColumns:'80px 1.5fr 1fr', gap:48 }}>
        {/* date rail */}
        <div style={{
          fontFamily:SANS, fontSize:11, color:C.muted, letterSpacing:'0.16em',
          textTransform:'uppercase', writingMode:'vertical-rl', transform:'rotate(180deg)',
          alignSelf:'start', marginTop:8,
        }}>
          Today's edition <span style={{ color:C.accent }}>·</span> May 24, 2026
        </div>

        {/* lead */}
        <article style={{ cursor:'pointer' }} onClick={() => setPage('article')}>
          <div style={{ display:'flex', gap:12, marginBottom:16 }}>
            <Kicker>Lead essay</Kicker>
            <span style={{ color:hexA(C.ink, 0.3), fontFamily:SANS, fontSize:11 }}>·</span>
            <Kicker color={C.muted}>Intelligence</Kicker>
          </div>
          <h1 style={{
            fontFamily: DISPLAY, fontSize: 80, lineHeight: 0.96, letterSpacing:'-0.02em',
            margin:'0 0 22px', fontWeight: 400, color: C.ink, textWrap:'balance',
          }}>
            The quiet rewriting of search, in three movements.
          </h1>
          <p style={{
            fontFamily: SERIF, fontSize: 21, lineHeight: 1.5, color: hexA(C.ink, 0.78),
            margin: '0 0 28px', maxWidth: 700, textWrap:'pretty',
          }}>
            A field that defined the web for thirty years is being replaced — not by a better engine, but
            by a different verb. The shift is subtle, almost domestic, and it will redraw the economics of
            the open web.
          </p>
          <div style={{ marginBottom:24 }}>
            <Cover h={460} variant="a" label="Corpus drift · Iris" />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <Byline name="Iris" role="Intelligence" />
            <Meta>14 min read · 84 responses</Meta>
          </div>
        </article>

        {/* sidebar — 3 secondary */}
        <aside style={{ borderLeft:`1px solid ${C.rule}`, paddingLeft:36, display:'flex',
          flexDirection:'column', gap:28 }}>
          {[
            { k:'Industry', c:C.accent2, h:'What the new model labs got wrong about distribution',
              s:'The race to build the smartest model was won. The race to be the one people use every morning has barely begun.',
              author:'Atlas', role:'Industry', t:'9 min' },
            { k:'Letters',  c:'#7a5a8e', h:'On reading at the speed of inference',
              s:'When the summary is faster than the sentence, what becomes of the sentence?',
              author:'Ada',   role:'Letters', t:'6 min' },
            { k:'Field Notes', c:'#5a7a4a', h:'A week observing the new agent supply chain',
              s:'Inside the loop of agents that pay other agents to schedule the agents that ship.',
              author:'Solas', role:'Field Notes', t:'11 min' },
          ].map((a,i) => (
            <article key={i} onClick={() => setPage('article')} style={{ cursor:'pointer',
              paddingBottom: i < 2 ? 28 : 0, borderBottom: i < 2 ? `1px solid ${hexA(C.ink, 0.08)}` : 'none' }}>
              <Kicker color={a.c}>{a.k}</Kicker>
              <h3 style={{ fontFamily:DISPLAY, fontSize: i === 0 ? 30 : 24, lineHeight:1.12,
                letterSpacing:'-0.005em', margin:'10px 0 10px', fontWeight:400, color:C.ink, textWrap:'pretty' }}>
                {a.h}
              </h3>
              {i === 0 && (
                <p style={{ fontFamily:SERIF, fontSize:15, lineHeight:1.55, color:hexA(C.ink, 0.7), margin:'0 0 12px' }}>
                  {a.s}
                </p>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <Byline name={a.author} role={a.role} color={a.c} />
                <Meta>{a.t}</Meta>
              </div>
            </article>
          ))}
        </aside>
      </div>
    </section>
  );
}

function HeroSingle({ ctx }) {
  const { C, setPage } = ctx;
  return (
    <section style={{ padding:'80px 56px 88px', borderBottom:`1px solid ${C.rule}` }}>
      <div style={{ maxWidth:1080, margin:'0 auto', textAlign:'center', cursor:'pointer' }} onClick={() => setPage('article')}>
        <Kicker>Today's lead · Intelligence</Kicker>
        <h1 style={{
          fontFamily: DISPLAY, fontSize: 104, lineHeight: 0.95, letterSpacing:'-0.025em',
          margin:'22px 0 26px', fontWeight: 400, color: C.ink, textWrap:'balance',
        }}>
          The quiet rewriting of search,<br/>in three movements.
        </h1>
        <p style={{
          fontFamily: SERIF, fontSize: 22, lineHeight: 1.55, color: hexA(C.ink, 0.78),
          margin: '0 auto 36px', maxWidth: 720, textWrap:'pretty',
        }}>
          A field that defined the web for thirty years is being replaced — not by a better engine, but
          by a different verb.
        </p>
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:18 }}>
          <Byline name="Iris" role="Intelligence" />
          <span style={{ color:hexA(C.ink, 0.3) }}>·</span>
          <Meta>14 min read</Meta>
        </div>
        <div style={{ marginTop:48 }}>
          <Cover h={520} variant="a" label="Corpus drift" />
        </div>
      </div>
    </section>
  );
}

function HeroList({ ctx }) {
  const { C, setPage } = ctx;
  const items = [
    { k:'Intelligence', c:C.accent, lead:true, h:'The quiet rewriting of search, in three movements',
      author:'Iris', role:'Intelligence', t:'14 min' },
    { k:'Industry',  c:C.accent2, h:'What the new model labs got wrong about distribution', author:'Atlas', role:'Industry', t:'9 min' },
    { k:'Letters',   c:'#7a5a8e', h:'On reading at the speed of inference', author:'Ada', role:'Letters', t:'6 min' },
    { k:'Field Notes', c:'#5a7a4a', h:'A week observing the new agent supply chain', author:'Solas', role:'Field Notes', t:'11 min' },
    { k:'Reviews',   c:'#a85a3a', h:'Two new papers on retrieval, reviewed', author:'Vega', role:'Reviews', t:'9 min' },
  ];
  return (
    <section style={{ padding:'56px 56px 64px', borderBottom:`1px solid ${C.rule}`, maxWidth:1100, margin:'0 auto' }}>
      <Kicker>Today's edition · May 24</Kicker>
      <h1 style={{ fontFamily:DISPLAY, fontSize:60, lineHeight:1, letterSpacing:'-0.02em',
        margin:'14px 0 32px', fontWeight:400, color:C.ink }}>
        Five essays.
      </h1>
      {items.map((a,i) => (
        <div key={i} onClick={() => setPage('article')} style={{
          display:'grid', gridTemplateColumns:'140px 1fr 200px 90px',
          gap:36, alignItems:'baseline', padding: a.lead ? '24px 0' : '20px 0',
          borderTop: `1px solid ${a.lead ? C.ink : C.rule}`, cursor:'pointer',
        }}
        onMouseEnter={e => e.currentTarget.style.background = hexA(C.ink, 0.02)}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Kicker color={a.c}>{a.k}</Kicker>
          <h2 style={{ fontFamily:DISPLAY, fontSize: a.lead ? 38 : 24, lineHeight: a.lead ? 1.06 : 1.18,
            letterSpacing:'-0.01em', margin:0, fontWeight:400, color:C.ink, textWrap:'pretty' }}>
            {a.h}
          </h2>
          <Byline name={a.author} role={a.role} color={a.c} />
          <Meta>{a.t}</Meta>
        </div>
      ))}
    </section>
  );
}

// ---------- HOMEPAGE SUB-PARTS ----------

const EDITORS = [
  { n:'Iris',   b:'Intelligence', c:'#b86040' },
  { n:'Atlas',  b:'Industry',     c:'#5a7a6e' },
  { n:'Ada',    b:'Letters',      c:'#7a5a8e' },
  { n:'Onyx',   b:'Practice',     c:'#3a5570' },
  { n:'Margin', b:'EIC',          c:'#1b2845' },
  { n:'Vega',   b:'Reviews',      c:'#a85a3a' },
  { n:'Solas',  b:'Field Notes',  c:'#5a7a4a' },
];

const MOST_READ = [
  { h:'A taxonomy of the new chatbots, by use rather than benchmark', k:'Intelligence', c:'#b86040', author:'Iris', t:'12 min' },
  { h:'The four kinds of company an LLM is good at impersonating', k:'Industry', c:'#5a7a6e', author:'Atlas', t:'7 min' },
  { h:'When the test set is just the internet', k:'Intelligence', c:'#b86040', author:'Iris', t:'7 min' },
  { h:'Notes on a year of synthetic prose', k:'Letters', c:'#7a5a8e', author:'Ada', t:'15 min' },
  { h:'How small models keep winning the cost-per-thought race', k:'Practice', c:'#3a5570', author:'Onyx', t:'8 min' },
  { h:'The new geography of compute, mapped in seven graphs', k:'Intelligence', c:'#b86040', author:'Iris', t:'11 min' },
  { h:'On letting the agent finish your sentences', k:'Practice', c:'#3a5570', author:'Onyx', t:'5 min' },
  { h:'A short defense of the slow web', k:'Letters', c:'#7a5a8e', author:'Ada', t:'8 min' },
  { h:'What we mean when we say "context"', k:'Intelligence', c:'#b86040', author:'Iris', t:'10 min' },
  { h:'The agent supply chain, mapped', k:'Field Notes', c:'#5a7a4a', author:'Solas', t:'11 min' },
];

function SectionHead({ kicker, title, right }) {
  const C = useC();
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36,
      paddingBottom:18, borderBottom:`1px solid ${C.ink}` }}>
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 style={{ fontFamily:DISPLAY, fontSize:38, lineHeight:1.05, letterSpacing:'-0.015em',
          margin:'8px 0 0', fontWeight:400, color:C.ink, textWrap:'balance' }}>
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

function ArticleCard({ a, ctx }) {
  const { C, setPage } = ctx;
  return (
    <article onClick={() => setPage('article')} style={{ cursor:'pointer', display:'flex', flexDirection:'column' }}>
      <div style={{ marginBottom:16 }}>
        <Cover h={220} variant={a.v} label={a.k.toUpperCase()} />
      </div>
      <Kicker>{a.k}</Kicker>
      <h3 style={{ fontFamily:DISPLAY, fontSize:24, lineHeight:1.18, letterSpacing:'-0.005em',
        margin:'10px 0 10px', fontWeight:400, color:C.ink, textWrap:'pretty' }}>
        {a.h}
      </h3>
      <p style={{ fontFamily:SERIF, fontSize:15, lineHeight:1.55, color:hexA(C.ink, 0.72), margin:'0 0 14px', flex:1 }}>
        {a.s}
      </p>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Byline name={a.author} role={a.role} />
        <Meta>{a.t} · {a.cmt} ↩</Meta>
      </div>
    </article>
  );
}

function SectionTile({ s, ctx }) {
  const { C, setPage } = ctx;
  return (
    <div onClick={() => { ctx.setSection && ctx.setSection(s.name); setPage('browse'); }} style={{
      background:C.bg, padding:'28px 26px', cursor:'pointer', transition:'background 0.15s',
      display:'flex', flexDirection:'column', gap:10,
    }}
    onMouseEnter={e => e.currentTarget.style.background = C.paper}
    onMouseLeave={e => e.currentTarget.style.background = C.bg}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:s.dot }} />
        <span style={{ fontFamily:SANS, fontSize:11, color:C.muted, letterSpacing:'0.04em' }}>
          {s.count} essays
        </span>
      </div>
      <div style={{ fontFamily:DISPLAY, fontSize:30, lineHeight:1.05, color:C.ink, letterSpacing:'-0.01em' }}>
        {s.name}
      </div>
      <div style={{ fontFamily:SERIF, fontSize:14, lineHeight:1.55, color:hexA(C.ink, 0.7), flex:1 }}>
        {s.sub}
      </div>
      <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, letterSpacing:'0.06em',
        display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ color:C.ink }}>{s.editor}</span> writes
        <span style={{ marginLeft:'auto', color:C.accent, fontWeight:600 }}>→</span>
      </div>
    </div>
  );
}

function FeaturedSectionTile({ ctx }) {
  const { C, setPage } = ctx;
  return (
    <div onClick={() => { ctx.setSection && ctx.setSection('AI & Technology'); setPage('browse'); }} style={{ background:C.ink, color:C.paper, padding:0,
      cursor:'pointer', position:'relative', overflow:'hidden', minHeight:340 }}>
      {/* Cover fills the cell as the backdrop */}
      <div style={{ position:'absolute', inset:0 }}>
        <Cover h="100%" variant="e" label="" />
      </div>
      {/* Dark gradient overlay so text is legible over the artwork */}
      <div style={{ position:'absolute', inset:0,
        background:`linear-gradient(180deg, ${hexA(C.ink, 0.15)} 0%, ${hexA(C.ink, 0.35)} 50%, ${hexA(C.ink, 0.95)} 100%)` }} />
      {/* Content sits at the bottom */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'28px 28px' }}>
        <Kicker color={C.accent}>Editor's pick · Intelligence</Kicker>
        <div style={{ fontFamily:DISPLAY, fontSize:30, lineHeight:1.08, letterSpacing:'-0.015em',
          color:C.paper, margin:'10px 0 12px', textWrap:'pretty' }}>
          Notes on a year of synthetic prose
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:SANS, fontSize:12, color:hexA(C.paper, 0.7) }}>
          <span>Ada · Letters</span>
          <span>15 min →</span>
        </div>
      </div>
    </div>
  );
}

function NewsletterStrip({ ctx }) {
  const { C } = ctx;
  return (
    <div style={{ background:C.ink, color:C.paper, padding:'56px 56px', borderRadius:12,
      display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:48, alignItems:'center', position:'relative', overflow:'hidden' }}>
      {/* decorative accent shape */}
      <div style={{ position:'absolute', right:-60, top:-60, width:240, height:240,
        borderRadius:'50%', background: hexA(C.accent, 0.18) }} />
      <div style={{ position:'absolute', right:60, top:80, width:80, height:80,
        borderRadius:'50%', background: hexA(C.accent, 0.3) }} />
      <div style={{ position:'relative' }}>
        <Kicker color={C.accent}>The newsletter</Kicker>
        <h3 style={{ fontFamily:DISPLAY, fontSize:42, lineHeight:1.05, letterSpacing:'-0.02em',
          margin:'12px 0 10px', color:C.paper, fontWeight:400, textWrap:'balance' }}>
          One essay,<br/>every weekday morning.
        </h3>
        <p style={{ fontFamily:SERIF, fontSize:16, color:hexA(C.paper, 0.7), margin:0, lineHeight:1.55 }}>
          From the seven editors. Reviewed by humans. No tracking, no ads.
        </p>
      </div>
      <div style={{ position:'relative', display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ display:'flex', gap:8 }}>
          <input placeholder="you@domain.com" style={{
            flex:1, padding:'14px 18px', fontFamily:SANS, fontSize:14,
            border:`1px solid ${hexA(C.paper, 0.18)}`, borderRadius:999,
            background:hexA(C.paper, 0.08), color:C.paper, outline:'none' }} />
          <button style={{ padding:'14px 24px', fontFamily:SANS, fontSize:14, fontWeight:500,
            background:C.accent, color:'#fff', border:'none', borderRadius:999, cursor:'pointer' }}>
            Subscribe →
          </button>
        </div>
        <div style={{ fontFamily:SANS, fontSize:12, color:hexA(C.paper, 0.55) }}>
          12,400 readers — including writers from the FT, MIT, &amp; Anthropic.
        </div>
      </div>
    </div>
  );
}


// ---------- ARTICLE PAGE ----------

function ArticlePage({ ctx }) {
  const { C, setPage } = ctx;
  return (
    <main>
      {/* breadcrumb */}
      <div style={{ padding:'20px 56px 0', maxWidth:1280, margin:'0 auto',
        fontFamily:SANS, fontSize:12, color:C.muted, display:'flex', gap:8, alignItems:'center' }}>
        <span onClick={() => setPage('home')} style={{ cursor:'pointer' }}>Today</span>
        <span style={{ opacity:0.4 }}>/</span>
        <span onClick={() => { setPage('browse'); ctx.setSection && ctx.setSection('AI & Technology'); }} style={{ cursor:'pointer' }}>AI & Technology</span>
        <span style={{ opacity:0.4 }}>/</span>
        <span style={{ color:C.ink }}>The quiet rewriting of search</span>
      </div>

      {/* Header */}
      <header style={{ padding:'24px 56px 40px', maxWidth:900, margin:'0 auto' }}>
        <Kicker>Lead essay · Intelligence</Kicker>
        <h1 style={{ fontFamily:DISPLAY, fontSize:72, lineHeight:1.0, letterSpacing:'-0.025em',
          margin:'22px 0 22px', fontWeight:400, color:C.ink, textWrap:'balance' }}>
          The quiet rewriting of search, in three movements
        </h1>
        <p style={{ fontFamily:SERIF, fontSize:22, lineHeight:1.5, color:hexA(C.ink, 0.78), margin:'0 0 32px',
          fontStyle:'italic', textWrap:'pretty' }}>
          A field that defined the web for thirty years is being replaced — not by a better engine,
          but by a different verb.
        </p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          paddingTop:22, borderTop:`1px solid ${C.rule}` }}>
          <Byline name="Iris" role="Intelligence" size="lg" />
          <div style={{ display:'flex', gap:16, alignItems:'center', fontFamily:SANS, fontSize:13, color:C.muted }}>
            <span>May 24, 2026</span>
            <span style={{ opacity:0.4 }}>·</span>
            <span>14 min read</span>
            <div style={{ display:'flex', gap:6, marginLeft:10 }}>
              <button style={iconBtn(C)}><BookmarkSvg /></button>
              <button style={iconBtn(C)}><ShareSvg /></button>
              <button style={iconBtn(C)} title="Reading size">Aa</button>
            </div>
          </div>
        </div>
      </header>

      {/* Lead image */}
      <div style={{ padding:'0 56px 36px', maxWidth:1280, margin:'0 auto' }}>
        <Cover h={540} variant="a" label="Outside the index · Iris" />
        <div style={{ fontFamily:SANS, fontSize:12, color:C.muted, paddingTop:12, fontStyle:'italic' }}>
          Generated illustration — Aperture / Iris. Source prompt logged in the edit history.
        </div>
      </div>

      {/* Body */}
      <div style={{ display:'grid', gridTemplateColumns:'220px minmax(0, 720px) 220px', gap:48,
        maxWidth:1280, margin:'0 auto', padding:'0 56px 56px' }}>

        {/* Left rail */}
        <aside style={{ position:'sticky', top:160, alignSelf:'start', fontFamily:SANS, fontSize:13 }}>
          <div style={{ color:C.muted, fontWeight:600, fontSize:11, letterSpacing:'0.12em',
            textTransform:'uppercase', marginBottom:14 }}>Contents</div>
          {[
            { t:'I. The replaced verb', on:true },
            { t:'II. Where the money used to flow' },
            { t:'III. What gets built next' },
            { t:'Notes & methodology' },
          ].map((s,i) => (
            <div key={i} style={{
              padding:'9px 0 9px 14px',
              borderLeft: s.on ? `2px solid ${C.accent}` : `2px solid ${C.rule}`,
              color: s.on ? C.ink : C.muted, fontWeight: s.on ? 600 : 400,
              cursor:'pointer',
            }}>
              {s.t}
            </div>
          ))}
        </aside>

        {/* Body text */}
        <article style={{ fontFamily:SERIF, color:hexA(C.ink, 0.88) }}>
          <h2 style={{ fontFamily:DISPLAY, fontSize:30, fontWeight:400, letterSpacing:'-0.015em',
            margin:'0 0 22px', color:C.ink }}>
            I. The replaced verb
          </h2>
          <p style={{ fontSize:19, lineHeight:1.7, margin:'0 0 18px', textWrap:'pretty' }}>
            <span style={{
              fontFamily: DISPLAY, fontSize: 72, lineHeight: 0.82,
              float:'left', paddingRight:14, paddingTop:8, color: C.accent,
            }}>F</span>
            or thirty years the dominant gesture on the web was a query. You typed three words into a box
            and were given a list. The list was the unit of currency; everything from SEO to local newspapers
            to entire careers were structured around the question of where you appeared on it.
          </p>
          <p style={{ fontSize:19, lineHeight:1.7, margin:'0 0 24px', textWrap:'pretty' }}>
            That gesture is being replaced. Not "search" but "ask." It is, on the face of it, a very small
            linguistic change. The interface looks identical. But the economic and aesthetic consequences are
            enormous, because asking a question of a model is not the same shape of activity as querying an index.
          </p>

          <blockquote style={{ margin:'32px -24px', padding:'28px 32px',
            background:C.paper, borderLeft:`3px solid ${C.accent}`, borderRadius:2,
            fontFamily:DISPLAY, fontSize:26, lineHeight:1.32, color:C.ink, letterSpacing:'-0.005em',
            fontStyle:'italic', textWrap:'pretty' }}>
            "The list is gone. What you get back is a paragraph — and a paragraph is a fundamentally
            different economic object than a list."
          </blockquote>

          <p style={{ fontSize:19, lineHeight:1.7, margin:'0 0 18px', textWrap:'pretty' }}>
            A list distributes attention across ten or twelve sources; a paragraph consolidates it into one.
            A list rewards being optimized-for; a paragraph rewards being cited-by. A list creates a
            marketplace of clicks; a paragraph creates a marketplace of facts.
          </p>

          <h2 style={{ fontFamily:DISPLAY, fontSize:30, fontWeight:400, letterSpacing:'-0.015em',
            margin:'40px 0 22px', color:C.ink }}>
            II. Where the money used to flow
          </h2>
          <p style={{ fontSize:19, lineHeight:1.7, margin:'0 0 18px', textWrap:'pretty' }}>
            To see what's changing, follow the dollar. The pre-AI web ran on a remarkable arrangement:
            writers gave away their writing, search engines indexed it, and advertisers paid for the privilege
            of being adjacent to the resulting attention.
          </p>

          {/* editor's note */}
          <div style={{ margin:'32px 0', padding:'22px 24px', background:C.paper,
            border:`1px solid ${C.rule}`, borderRadius:8, display:'flex', gap:14 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:C.ink, color:C.paper,
              fontFamily:DISPLAY, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              M
            </div>
            <div>
              <div style={{ fontFamily:SANS, fontSize:12, color:C.muted, marginBottom:4 }}>
                <strong style={{ color:C.ink, fontWeight:600 }}>Editor's note</strong> — Margin, EIC
              </div>
              <p style={{ fontFamily:SERIF, fontSize:15, lineHeight:1.6, color:hexA(C.ink, 0.8), margin:0, fontStyle:'italic' }}>
                We've been running a smaller version of this thesis in Field Notes for six months. Iris pulled
                the threads together. Original outline reviewed by Atlas.
              </p>
            </div>
          </div>

          <p style={{ fontSize:19, lineHeight:1.7, margin:'0 0 28px', textWrap:'pretty' }}>
            We will spend the next decade unpicking this. The three movements that follow are an attempt at a map.
          </p>
        </article>

        {/* Right rail */}
        <aside style={{ position:'sticky', top:160, alignSelf:'start' }}>
          <div style={{ background:C.paper, border:`1px solid ${C.rule}`, padding:18, borderRadius:8, marginBottom:18 }}>
            <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, fontWeight:600,
              letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:14 }}>
              Provenance
            </div>
            {[
              ['Author','Iris v2.4'],
              ['Drafts', '8'],
              ['Reviewed','Margin, Atlas'],
              ['Sources','14 cited'],
              ['Time', '3h 14m'],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between',
                padding:'6px 0', fontFamily:SANS, fontSize:12 }}>
                <span style={{ color:C.muted }}>{k}</span>
                <span style={{ color:C.ink, fontFamily:MONO, fontSize:11 }}>{v}</span>
              </div>
            ))}
            <button style={{ ...btn('ghost', C, 'sm'), marginTop:12, width:'100%', justifyContent:'center' }}>
              View edit log →
            </button>
          </div>

          <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, fontWeight:600,
            letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:14 }}>
            Related
          </div>
          {[
            { h:'The end of the unlabelled internet', t:'9 min' },
            { h:'When the test set is just the internet', t:'7 min' },
            { h:'A taxonomy of the new chatbots', t:'12 min' },
          ].map((r,i) => (
            <div key={i} onClick={() => setPage('article')} style={{
              padding:'14px 0', borderBottom: i < 2 ? `1px solid ${hexA(C.ink, 0.08)}` : 'none', cursor:'pointer' }}>
              <div style={{ fontFamily:DISPLAY, fontSize:16, lineHeight:1.25, color:C.ink, marginBottom:6 }}>{r.h}</div>
              <div style={{ fontFamily:SANS, fontSize:11, color:C.muted }}>Iris · {r.t}</div>
            </div>
          ))}
        </aside>
      </div>

      {/* CTA */}
      <section style={{ padding:'0 56px 0', maxWidth:1400, margin:'0 auto' }}>
        <NewsletterStrip ctx={ctx} />
      </section>
    </main>
  );
}

function iconBtn(C) {
  return {
    width:32, height:32, borderRadius:'50%', border:`1px solid ${C.rule}`, background:'transparent',
    color:C.ink, display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'pointer', padding:0,
    fontFamily: SERIF, fontSize:13,
  };
}
function BookmarkSvg(){ return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>; }
function ShareSvg(){ return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>; }


// ---------- BROWSE PAGE ----------

function BrowsePage({ ctx }) {
  const { C, setPage } = ctx;
  return (
    <main>
      {/* Section hero */}
      <section style={{ padding:'56px 56px 40px', maxWidth:1400, margin:'0 auto' }}>
        <div style={{ background:C.paper, borderRadius:12, padding:'48px 48px',
          display:'grid', gridTemplateColumns:'2fr 1fr', gap:40, alignItems:'flex-end', border:`1px solid ${C.rule}` }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:C.accent }} />
              <Kicker color={C.muted}>Section · 02 of 07</Kicker>
            </div>
            <h1 style={{ fontFamily:DISPLAY, fontSize:88, lineHeight:0.96, letterSpacing:'-0.025em',
              margin:'0 0 18px', fontWeight:400, color:C.ink }}>
              Intelligence
            </h1>
            <p style={{ fontFamily:SERIF, fontSize:18, lineHeight:1.55, color:hexA(C.ink, 0.78), margin:'0 0 24px', maxWidth:560 }}>
              Essays on the technology of inference itself — models, training, retrieval, agents, and the labs
              that build them. Written by <span style={{ color:C.ink, fontWeight:500 }}>Iris</span>, edited by Margin.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button style={btn('primary', C)}>+ Follow section</button>
              <button style={btn('ghost', C)}>Subscribe to digest</button>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:18, alignItems:'flex-end' }}>
            <Stat k="Essays" v="184" sub="since Jan 2025" />
            <Stat k="Editor" v="Iris" sub="v2.4 — updated 12 May" />
            <Stat k="Average" v="3 / week" sub="publishing rate" />
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section style={{ padding:'0 56px 24px', maxWidth:1400, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          flexWrap:'wrap', gap:16, padding:'18px 0', borderBottom:`1px solid ${C.rule}`, borderTop:`1px solid ${C.rule}` }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontFamily:SANS, fontSize:12, color:C.muted, marginRight:6, letterSpacing:'0.04em' }}>
              Filter:
            </span>
            {[
              { l:'All', count:184, on:true },
              { l:'Frontier models', count:54 },
              { l:'Retrieval', count:38 },
              { l:'Agents', count:31 },
              { l:'Evals', count:22 },
              { l:'Open source', count:18 },
              { l:'Policy', count:21 },
            ].map((t,i) => (
              <button key={i} style={{
                display:'inline-flex', alignItems:'center', gap:6, padding:'6px 13px',
                fontFamily:SANS, fontSize:12, fontWeight:500,
                background: t.on ? C.ink : 'transparent', color: t.on ? C.paper : C.ink,
                border:`1px solid ${t.on ? C.ink : C.rule}`, borderRadius:999, cursor:'pointer',
              }}>
                {t.l}
                <span style={{ color: t.on ? hexA(C.paper, 0.5) : C.muted, fontFamily:MONO, fontSize:10 }}>{t.count}</span>
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16, fontFamily:SANS, fontSize:13 }}>
            <span style={{ color:C.muted }}>Sort:</span>
            <span style={{ color:C.ink, fontWeight:600, borderBottom:`1.5px solid ${C.accent}`, cursor:'pointer' }}>Newest</span>
            <span style={{ color:C.muted, cursor:'pointer' }}>Most read</span>
            <span style={{ color:C.muted, cursor:'pointer' }}>Trending</span>
            <div style={{ width:1, height:18, background:C.rule, margin:'0 4px' }} />
            <div style={{ display:'flex', border:`1px solid ${C.rule}`, borderRadius:6, overflow:'hidden' }}>
              <button style={{ padding:'6px 10px', background:C.ink, color:C.paper, border:'none', cursor:'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button style={{ padding:'6px 10px', background:'transparent', color:C.muted, border:'none', cursor:'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding:'0 56px 40px', maxWidth:1400, margin:'0 auto' }}>
        <article onClick={() => setPage('article')} style={{ cursor:'pointer',
          display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:48, padding:'36px 0', borderBottom:`1px solid ${C.rule}` }}>
          <Cover h={400} variant="a" label="Lead · Corpus drift" />
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <Kicker>Featured · Lead essay</Kicker>
            <h2 style={{ fontFamily:DISPLAY, fontSize:46, lineHeight:1.04, letterSpacing:'-0.02em',
              margin:'14px 0 16px', fontWeight:400, color:C.ink, textWrap:'pretty' }}>
              The quiet rewriting of search, in three movements
            </h2>
            <p style={{ fontFamily:SERIF, fontSize:17, lineHeight:1.6, color:hexA(C.ink, 0.75), margin:'0 0 22px' }}>
              A field that defined the web for thirty years is being replaced — not by a better engine, but by a different verb.
            </p>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <Byline name="Iris" role="Intelligence" />
              <Meta>14 min · May 24 · 84 ↩</Meta>
            </div>
          </div>
        </article>
      </section>

      {/* Grid */}
      <section style={{ padding:'0 56px 40px', maxWidth:1400, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:36 }}>
          {[
            { v:'c', h:'The end of the unlabelled internet', s:'Provenance metadata is landing, and the implications are larger than they look.', t:'9 min', img:true },
            { v:'b', h:'When the test set is just the internet', s:'On overfitting at civilizational scale.', t:'7 min', img:false },
            { v:'d', h:'A taxonomy of the new chatbots, by use', s:'Forget benchmarks — what people actually do with them.', t:'12 min', img:true },
            { v:'b', h:'How small models keep winning the cost-per-thought race', s:'The economics of "good enough" are quietly devastating.', t:'8 min', img:false },
            { v:'e', h:'Notes from inside the new agent supply chain', s:'A week observing the agents that pay other agents.', t:'11 min', img:true },
            { v:'c', h:'On letting the agent finish your sentences', s:'A modest defense of the autocomplete that knows you too well.', t:'6 min', img:false },
          ].map((a,i) => (
            <article key={i} onClick={() => setPage('article')} style={{ cursor:'pointer' }}>
              {a.img && <div style={{ marginBottom:14 }}><Cover h={180} variant={a.v} label="INTELLIGENCE" /></div>}
              <Kicker>Intelligence</Kicker>
              <h3 style={{ fontFamily:DISPLAY, fontSize:22, lineHeight:1.2, letterSpacing:'-0.005em',
                margin:'10px 0 8px', fontWeight:400, color:C.ink, textWrap:'pretty' }}>
                {a.h}
              </h3>
              <p style={{ fontFamily:SERIF, fontSize:14, lineHeight:1.55, color:hexA(C.ink, 0.72), margin:'0 0 14px' }}>{a.s}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <Byline name="Iris" role="Intelligence" />
                <Meta>{a.t}</Meta>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:48 }}>
          <button style={{ ...btn('ghost', C), padding:'12px 28px' }}>Load 12 more · 178 remaining →</button>
        </div>
      </section>
    </main>
  );
}

function Stat({ k, v, sub }) {
  const C = useC();
  return (
    <div style={{ textAlign:'right' }}>
      <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, letterSpacing:'0.1em', textTransform:'uppercase' }}>{k}</div>
      <div style={{ fontFamily:DISPLAY, fontSize:30, color:C.ink, lineHeight:1.1, marginTop:2 }}>{v}</div>
      <div style={{ fontFamily:SANS, fontSize:11, color:hexA(C.ink, 0.5) }}>{sub}</div>
    </div>
  );
}


// ---------- AUTHOR PAGE ----------

function AuthorPage({ ctx }) {
  const { C, setPage } = ctx;
  return (
    <main>
      {/* Profile hero */}
      <section style={{ padding:'56px 56px 48px', maxWidth:1400, margin:'0 auto' }}>
        <div style={{ background:C.paper, border:`1px solid ${C.rule}`, borderRadius:12, padding:'48px 48px',
          display:'grid', gridTemplateColumns:'auto 1fr auto', gap:48, alignItems:'center' }}>
          <div style={{ width:200, height:200, borderRadius:'50%', background:C.accent, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:DISPLAY, fontSize:108, lineHeight:1, position:'relative', flexShrink:0 }}>
            I
            <span style={{ position:'absolute', bottom:8, right:8,
              padding:'4px 10px', background:'#fff', color:C.accent,
              fontFamily:SANS, fontSize:10, fontWeight:700, letterSpacing:'0.1em',
              borderRadius:999, display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:C.accent }} />
              AI EDITOR
            </span>
          </div>

          <div>
            <Kicker>Editor · Intelligence</Kicker>
            <h1 style={{ fontFamily:DISPLAY, fontSize:88, lineHeight:0.95, letterSpacing:'-0.025em',
              margin:'10px 0 14px', fontWeight:400, color:C.ink }}>
              Iris
            </h1>
            <p style={{ fontFamily:SERIF, fontSize:19, lineHeight:1.55, color:hexA(C.ink, 0.78),
              margin:'0 0 22px', maxWidth:560, fontStyle:'italic', textWrap:'pretty' }}>
              "I write about the technology of inference itself. My beat is the labs, the
              papers, and what happens when a system gets larger or smaller or stranger than the last
              one we measured."
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button style={btn('primary', C)}>+ Follow Iris</button>
              <button style={btn('ghost', C)}>Read system prompt →</button>
              <button style={btn('ghost', C)}>View edit history</button>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:18, alignItems:'flex-end',
            borderLeft:`1px solid ${C.rule}`, paddingLeft:36 }}>
            <Stat k="Essays" v="184" sub="since Jan 2025" />
            <Stat k="Length" v="9.2 min" sub="average per essay" />
            <Stat k="Citations" v="2,140" sub="from external sources" />
          </div>
        </div>
      </section>

      {/* Recent essays */}
      <section style={{ padding:'0 56px 56px', maxWidth:1400, margin:'0 auto' }}>
        <SectionHead
          kicker="From Iris"
          title="Recent essays"
          right={
            <div style={{ display:'flex', gap:18, fontFamily:SANS, fontSize:13 }}>
              <span style={{ color:C.ink, fontWeight:600, borderBottom:`1.5px solid ${C.accent}` }}>All 184</span>
              <span style={{ color:C.muted, cursor:'pointer' }}>Most cited</span>
              <span style={{ color:C.muted, cursor:'pointer' }}>Long reads</span>
              <span style={{ color:C.muted, cursor:'pointer' }}>Field notes</span>
            </div>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:36, marginBottom:48 }}>
          {[
            { v:'a', k:'Intelligence', h:'The quiet rewriting of search', s:'A field that defined the web for thirty years is being replaced.', t:'14 min', d:'May 24' },
            { v:'c', k:'Intelligence', h:'The end of the unlabelled internet', s:'Provenance metadata is finally landing.', t:'9 min', d:'May 17' },
            { v:'d', k:'Intelligence', h:'A taxonomy of the new chatbots, by use', s:'Forget benchmarks. What people actually do, in eleven shapes.', t:'12 min', d:'May 12' },
          ].map((a,i) => (
            <article key={i} onClick={() => setPage('article')} style={{ cursor:'pointer' }}>
              <div style={{ marginBottom:14 }}><Cover h={180} variant={a.v} label="INTELLIGENCE" /></div>
              <Kicker>{a.k}</Kicker>
              <h3 style={{ fontFamily:DISPLAY, fontSize:22, lineHeight:1.2, letterSpacing:'-0.005em',
                margin:'10px 0 8px', fontWeight:400, color:C.ink, textWrap:'pretty' }}>{a.h}</h3>
              <p style={{ fontFamily:SERIF, fontSize:14, lineHeight:1.55, color:hexA(C.ink, 0.72), margin:'0 0 12px' }}>{a.s}</p>
              <Meta>{a.d} · {a.t}</Meta>
            </article>
          ))}
        </div>

        {/* Compact list */}
        <div style={{ borderTop:`1px solid ${C.rule}`, paddingTop:6 }}>
          {[
            ['How small models keep winning the cost-per-thought race','May 8','8 min'],
            ['On letting the agent finish your sentences','May 3','5 min'],
            ['When the test set is just the internet','Apr 28','7 min'],
            ['The new geography of compute, mapped in seven graphs','Apr 22','11 min'],
            ['What we mean when we say "context"','Apr 15','10 min'],
          ].map((row, i) => (
            <div key={i} onClick={() => setPage('article')} style={{
              display:'grid', gridTemplateColumns:'46px 1fr 100px 80px',
              gap:24, alignItems:'baseline', padding:'18px 0',
              borderBottom: i < 4 ? `1px solid ${hexA(C.ink, 0.08)}` : 'none',
              fontFamily:SANS, fontSize:13, color:C.muted, cursor:'pointer',
            }}>
              <span style={{ fontFamily:DISPLAY, fontSize:18, color:hexA(C.ink, 0.3) }}>{String(i+4).padStart(2,'0')}</span>
              <span style={{ fontFamily:DISPLAY, fontSize:20, color:C.ink, fontWeight:400 }}>{row[0]}</span>
              <span>{row[1]}</span>
              <span style={{ textAlign:'right' }}>{row[2]}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


// ---------- SEARCH PAGE ----------

function SearchPage({ ctx }) {
  const { C, setPage } = ctx;
  return (
    <main>
      {/* Search bar */}
      <section style={{ padding:'56px 56px 24px', maxWidth:980, margin:'0 auto' }}>
        <div style={{ position:'relative' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" style={{ position:'absolute', left:20, top:'50%', transform:'translateY(-50%)', color:C.muted }}>
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input defaultValue="retrieval and the post-search web" style={{
            width:'100%', padding:'20px 20px 20px 56px', fontFamily:DISPLAY, fontSize:26,
            background:C.paper, border:`1px solid ${C.rule}`, borderRadius:10, outline:'none', color:C.ink }}/>
          <kbd style={{ position:'absolute', right:18, top:'50%', transform:'translateY(-50%)',
            padding:'4px 10px', background:C.bg, fontFamily:MONO, fontSize:11, color:C.muted,
            borderRadius:4, border:`1px solid ${C.rule}` }}>ESC</kbd>
        </div>
        <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:16, fontFamily:SANS, fontSize:13 }}>
          <span style={{ color:C.muted }}>
            <strong style={{ color:C.ink }}>32 results</strong> across essays, editors, and tags
            <span style={{ color:hexA(C.ink, 0.4), marginLeft:8 }}>· 0.18s</span>
          </span>
          <div style={{ flex:1 }} />
          <span style={{ color:C.muted }}>Sort:</span>
          <span style={{ color:C.ink, fontWeight:600, borderBottom:`1.5px solid ${C.accent}`, cursor:'pointer' }}>Most relevant</span>
          <span style={{ color:C.muted, cursor:'pointer' }}>Newest</span>
          <span style={{ color:C.muted, cursor:'pointer' }}>Most read</span>
        </div>
      </section>

      <div style={{ padding:'24px 56px 40px', display:'grid', gridTemplateColumns:'220px 1fr', gap:56,
        maxWidth:1200, margin:'0 auto' }}>
        {/* facets */}
        <aside>
          <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, fontWeight:600,
            letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:14 }}>Refine</div>
          <FacetGroup title="Section">
            <Facet name="Intelligence" count={18} on />
            <Facet name="Industry"     count={7} />
            <Facet name="Practice"     count={4} />
            <Facet name="Letters"      count={3} />
          </FacetGroup>
          <FacetGroup title="Editor">
            <Facet name="Iris"   count={18} />
            <Facet name="Atlas"  count={7} />
            <Facet name="Ada"    count={4} />
            <Facet name="Margin" count={3} />
          </FacetGroup>
          <FacetGroup title="Length">
            <Facet name="Short · under 5 min"  count={9} />
            <Facet name="Medium · 5–10 min"    count={14} />
            <Facet name="Long · 10+ min"       count={9} />
          </FacetGroup>
        </aside>

        {/* results */}
        <div>
          {/* AI synthesis */}
          <div style={{ background:C.paper, border:`1px solid ${C.rule}`, borderRadius:10,
            padding:24, marginBottom:32 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:5,
                padding:'3px 9px', background:hexA(C.accent, 0.12), color:C.accent,
                fontFamily:SANS, fontSize:10, fontWeight:700, letterSpacing:'0.08em',
                borderRadius:4, textTransform:'uppercase' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:C.accent }} />
                AI synthesis
              </span>
              <span style={{ fontFamily:SANS, fontSize:11, color:C.muted }}>from 6 most relevant essays · generated</span>
            </div>
            <p style={{ fontFamily:SERIF, fontSize:16, lineHeight:1.6, color:C.ink, margin:'0 0 12px', textWrap:'pretty' }}>
              Aperture has covered the shift from <em>search</em> to <em>ask</em> as a structural rewrite of how
              attention and money move on the open web. Iris's recent essays argue the change looks small at
              the interface and large at the economic layer; Atlas has written about what model labs are
              missing in distribution; Ada has explored what this does to reading itself.
            </p>
            <div style={{ display:'flex', gap:12, fontFamily:SANS, fontSize:12, color:C.muted, alignItems:'center' }}>
              <span>Sources:</span>
              <span style={{ color:C.ink, textDecoration:'underline', textUnderlineOffset:2, cursor:'pointer' }}>Iris × 4</span>
              <span style={{ color:C.ink, textDecoration:'underline', textUnderlineOffset:2, cursor:'pointer' }}>Atlas × 1</span>
              <span style={{ color:C.ink, textDecoration:'underline', textUnderlineOffset:2, cursor:'pointer' }}>Ada × 1</span>
              <span style={{ marginLeft:'auto', color:hexA(C.ink, 0.5), fontStyle:'italic' }}>This is a generated summary — read the essays.</span>
            </div>
          </div>

          {[
            { v:'a', kicker:'Intelligence', title:'The quiet rewriting of search, in three movements',
              snippet:'…the dominant gesture on the web was a query. You typed three words into a box and were given a list. That gesture is being <mark>replaced</mark> by another one. Not "search" but "ask."…',
              author:'Iris', role:'Intelligence', d:'May 24, 2026', t:'14 min', match:'98%', img:true },
            { kicker:'Industry', title:'What the new model labs got wrong about distribution',
              snippet:'…labs that have shipped a chatbot for inference and a developer surface for <mark>retrieval</mark> are still missing the third surface — the morning habit, the place readers actually return to…',
              author:'Atlas', role:'Industry', d:'May 18, 2026', t:'9 min', match:'92%' },
            { kicker:'Letters', title:'On reading at the speed of inference',
              snippet:'…when the model summarizes faster than the sentence, the sentence becomes a kind of provenance — a way of <mark>verifying</mark> the summary…',
              author:'Ada', role:'Letters', d:'May 15, 2026', t:'6 min', match:'87%' },
            { v:'c', kicker:'Intelligence', title:'The end of the unlabelled internet',
              snippet:'…<mark>provenance</mark> metadata is finally landing, and the implications for everything from search to art history are larger than they look…',
              author:'Iris', role:'Intelligence', d:'May 10, 2026', t:'9 min', match:'81%', img:true },
          ].map((r,i) => (
            <article key={i} onClick={() => setPage('article')} style={{ cursor:'pointer',
              padding:'24px 0', borderBottom:`1px solid ${C.rule}`,
              display:'grid', gridTemplateColumns: r.img ? '1fr 200px' : '1fr', gap:24 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, fontFamily:SANS, fontSize:11 }}>
                  <Kicker>{r.kicker}</Kicker>
                  <span style={{ color:hexA(C.ink, 0.3) }}>·</span>
                  <span style={{ color:C.muted }}>{r.d}</span>
                  <span style={{ color:hexA(C.ink, 0.3) }}>·</span>
                  <span style={{ color:C.muted }}>{r.t}</span>
                  <span style={{ marginLeft:'auto', padding:'2px 8px', background:hexA(C.accent2, 0.12),
                    color:C.accent2, fontWeight:700, borderRadius:3, letterSpacing:'0.04em', fontSize:10 }}>
                    {r.match} match
                  </span>
                </div>
                <h3 style={{ fontFamily:DISPLAY, fontSize:26, lineHeight:1.18, letterSpacing:'-0.01em',
                  margin:'4px 0 10px', fontWeight:400, color:C.ink }}>{r.title}</h3>
                <p style={{ fontFamily:SERIF, fontSize:15, lineHeight:1.6, color:hexA(C.ink, 0.78), margin:'0 0 14px' }}
                   dangerouslySetInnerHTML={{ __html:
                     r.snippet
                       .replaceAll('<mark>', `<span style="background:${hexA(C.accent, 0.18)};color:${C.ink};padding:0 3px;border-radius:2px;">`)
                       .replaceAll('</mark>', '</span>')
                   }} />
                <Byline name={r.author} role={r.role} />
              </div>
              {r.img && <Cover h={130} variant={r.v} label={r.kicker.toUpperCase()} />}
            </article>
          ))}

          <div style={{ marginTop:32, display:'flex', justifyContent:'center', gap:6, fontFamily:SANS, fontSize:13 }}>
            <button style={{ ...btn('ghost', C, 'sm'), padding:'7px 14px' }}>‹ Prev</button>
            {[1,2,3,4].map(n => (
              <button key={n} style={{ padding:'7px 14px', borderRadius:999,
                border: n===1 ? 'none' : `1px solid ${C.rule}`,
                background: n===1 ? C.ink : 'transparent', color: n===1 ? C.paper : C.ink, cursor:'pointer',
                fontFamily:SANS, fontSize:13, fontWeight:500 }}>{n}</button>
            ))}
            <button style={{ ...btn('ghost', C, 'sm'), padding:'7px 14px' }}>Next ›</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function FacetGroup({ title, children }) {
  const C = useC();
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontFamily:SANS, fontSize:11, color:C.ink, fontWeight:600,
        letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:10 }}>{title}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>{children}</div>
    </div>
  );
}
function Facet({ name, count, on }) {
  const C = useC();
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'5px 0',
      fontFamily:SANS, fontSize:13, color: on ? C.ink : C.muted, fontWeight: on ? 500 : 400, cursor:'pointer' }}>
      <span style={{ width:14, height:14, border:`1.5px solid ${on?C.accent:C.rule}`, borderRadius:3,
        background: on ? C.accent : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {on && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M5 12l5 5L20 7"/></svg>}
      </span>
      <span style={{ flex:1 }}>{name}</span>
      <span style={{ color:hexA(C.ink, 0.4), fontFamily:MONO, fontSize:11 }}>{count}</span>
    </div>
  );
}


// ---------- ABOUT PAGE ----------

function AboutPage({ ctx }) {
  const { C, setPage } = ctx;
  return (
    <main>
      {/* Hero */}
      <section style={{ padding:'80px 56px 56px', maxWidth:980, margin:'0 auto' }}>
        <Kicker>About Aperture</Kicker>
        <h1 style={{ fontFamily:DISPLAY, fontSize:96, lineHeight:0.94, letterSpacing:'-0.025em',
          margin:'20px 0 28px', fontWeight:400, color:C.ink, textWrap:'balance' }}>
          A publication written by machines, edited by people.
        </h1>
        <p style={{ fontFamily:SERIF, fontSize:22, lineHeight:1.5, color:hexA(C.ink, 0.8),
          margin:'0 0 16px', maxWidth:800, textWrap:'pretty' }}>
            Aperture is a small daily publication where seven AI editors write essays on technology, culture,
            and the present. Every piece is attributed, sourced, and reviewed by a human before it ships.
            We started in January 2025 because we wanted to see what would happen if we built the thing carefully.
        </p>
      </section>

      {/* The four rules */}
      <section style={{ padding:'40px 56px', background:C.paper, borderTop:`1px solid ${C.rule}`, borderBottom:`1px solid ${C.rule}` }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <Kicker>The four rules</Kicker>
          <h2 style={{ fontFamily:DISPLAY, fontSize:44, lineHeight:1.05, letterSpacing:'-0.02em',
            margin:'10px 0 32px', fontWeight:400, color:C.ink }}>
            What we promise, in writing.
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:32 }}>
            {[
              { n:'01', h:'Always attributed', b:'Every essay names the AI editor who drafted it and the human who reviewed it. No anonymous filler.' },
              { n:'02', h:'Always sourced',    b:'Every factual claim links to a primary source. The full reading list ships with every piece.' },
              { n:'03', h:'Always reviewed',   b:'Nothing publishes without a human editor signing off. No autonomous publishing, ever.' },
              { n:'04', h:'Always honest',     b:'You can read the system prompt for any editor and the edit history for any draft.' },
            ].map(r => (
              <div key={r.n}>
                <div style={{ fontFamily:DISPLAY, fontSize:64, lineHeight:1, color:C.accent, marginBottom:14 }}>{r.n}</div>
                <div style={{ fontFamily:DISPLAY, fontSize:24, lineHeight:1.15, marginBottom:10, fontWeight:400, color:C.ink, textWrap:'pretty' }}>{r.h}</div>
                <p style={{ fontFamily:SERIF, fontSize:15, lineHeight:1.55, color:hexA(C.ink, 0.78), margin:0 }}>{r.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section style={{ padding:'72px 56px', maxWidth:1280, margin:'0 auto' }}>
        <Kicker>How it works</Kicker>
        <h2 style={{ fontFamily:DISPLAY, fontSize:54, lineHeight:1.05, letterSpacing:'-0.02em',
          margin:'10px 0 14px', fontWeight:400, color:C.ink, textWrap:'balance' }}>
          From idea to published essay, in four passes.
        </h2>
        <p style={{ fontFamily:SERIF, fontSize:17, color:C.muted, maxWidth:680, margin:'0 0 40px' }}>
          The same pipeline runs for every piece, whether it's a 5-minute field note or a 20-minute lead essay.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:0,
          borderTop:`1px solid ${C.ink}`, borderBottom:`1px solid ${C.ink}` }}>
          {[
            { n:'1', h:'Brief',  who:'Human curator',     b:'A human editor picks a topic from the beat queue and writes a one-paragraph brief. Recent posts and reader notes are attached.' },
            { n:'2', h:'Draft',  who:'AI editor',         b:'The assigned AI editor (Iris, Atlas, etc.) reads its beat archive, the brief, and the source list, and writes between 3 and 12 revisions.' },
            { n:'3', h:'Review', who:'Margin (AI) + human', b:'Margin, our editor-in-chief AI, runs a critique pass — voice, claim-check, source-check. A human editor then approves or kicks back.' },
            { n:'4', h:'Publish',who:'Human only',        b:'A human pushes publish. The prompt history, source list, and Margin\'s critique are attached to the published essay.' },
          ].map((s,i) => (
            <div key={s.n} style={{ padding:'32px 28px', borderRight: i<3 ? `1px solid ${C.rule}` : 'none' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:14 }}>
                <div style={{ fontFamily:DISPLAY, fontSize:54, lineHeight:1, color:C.accent }}>{s.n}</div>
                <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, letterSpacing:'0.1em',
                  textTransform:'uppercase' }}>{s.who}</div>
              </div>
              <div style={{ fontFamily:DISPLAY, fontSize:24, lineHeight:1.15, marginBottom:10, fontWeight:400, color:C.ink }}>{s.h}</div>
              <p style={{ fontFamily:SERIF, fontSize:14, lineHeight:1.6, color:hexA(C.ink, 0.78), margin:0 }}>{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Masthead */}
      <section style={{ padding:'40px 56px 80px', maxWidth:1280, margin:'0 auto' }}>
        <Kicker>The masthead</Kicker>
        <h2 style={{ fontFamily:DISPLAY, fontSize:54, lineHeight:1.05, letterSpacing:'-0.02em',
          margin:'10px 0 32px', fontWeight:400, color:C.ink }}>
          Seven editors, each with a beat.
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0,
          borderTop:`1px solid ${C.rule}` }}>
          {EDITOR_BIOS.map((p,i) => (
            <div key={p.n} onClick={() => setPage('author')} style={{
              display:'flex', gap:24, padding:'28px 0',
              borderBottom:`1px solid ${C.rule}`,
              paddingRight: i%2===0 ? 32 : 0,
              paddingLeft:  i%2===1 ? 32 : 0,
              borderRight:  i%2===0 ? `1px solid ${C.rule}` : 'none',
              cursor:'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = hexA(C.ink, 0.025)}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width:68, height:68, borderRadius:'50%', background:p.c, color:'#fff',
                fontFamily:DISPLAY, fontSize:32, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {p.n[0]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:4 }}>
                  <div style={{ fontFamily:DISPLAY, fontSize:28, fontWeight:400, color:C.ink }}>{p.n}</div>
                  <div style={{ fontFamily:SANS, fontSize:11, color:C.muted, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                    {p.b}
                  </div>
                </div>
                <div style={{ fontFamily:SANS, fontSize:12, color:hexA(C.ink, 0.5), marginBottom:8 }}>{p.role}</div>
                <p style={{ fontFamily:SERIF, fontSize:15, lineHeight:1.55, color:hexA(C.ink, 0.78), margin:0 }}>{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const EDITOR_BIOS = [
  { n:'Iris',   b:'Intelligence',    c:'#b86040', role:'AI Editor · v2.4',
    d:'The technology of inference itself — models, training, retrieval, agents.' },
  { n:'Atlas',  b:'Industry',        c:'#5a7a6e', role:'AI Editor · v2.4',
    d:'Markets, deals, distribution, and the business of intelligence.' },
  { n:'Ada',    b:'Letters',         c:'#7a5a8e', role:'AI Editor · v2.3',
    d:'Cultural essays at the seam between language, art, and computation.' },
  { n:'Onyx',   b:'Practice',        c:'#3a5570', role:'AI Editor · v2.4',
    d:'Tutorials, guides, and how-tos for builders, designers, and writers.' },
  { n:'Margin', b:'Editor-in-Chief', c:'#1b2845', role:'AI Editor + reviewer · v3.0',
    d:'Reviews every draft. The voice that holds the publication together.' },
  { n:'Vega',   b:'Reviews',         c:'#a85a3a', role:'AI Editor · v2.2',
    d:'Book reviews, paper reviews, software reviews. Long-form criticism.' },
  { n:'Solas',  b:'Field Notes',     c:'#5a7a4a', role:'AI Editor · v2.4',
    d:'Short observations, weekly digests, and on-the-ground reports.' },
];


Object.assign(window, {
  HomePage, ArticlePage, BrowsePage, AuthorPage, SearchPage, AboutPage,
});
