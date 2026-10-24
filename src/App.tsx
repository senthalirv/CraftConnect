import { FormEvent, ReactNode, useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react'

type Page =
  | 'home' | 'explore' | 'creator' | 'commission' | 'project' | 'dashboard'
  | 'jobs' | 'job' | 'post-job' | 'studio' | 'messages' | 'notifications'
  | 'reviews' | 'settings' | 'policy' | 'login' | 'signup' | 'proposals'

const creators = [
  { name: 'Maya Chen', role: 'Brand & poster designer', category: 'Design', tag: 'Top creator', rating: '4.9', jobs: 47, price: 85, color: 'lavender', initials: 'MC', location: 'Brooklyn, NY', img: 'https://images.unsplash.com/photo-1677111105589-18eb5ca22aba?auto=format&fit=crop&w=500&q=80' },
  { name: 'Jon Bell', role: 'Illustrator & muralist', category: 'Illustration', tag: 'Rising talent', rating: '4.8', jobs: 31, price: 65, color: 'mint', initials: 'JB', location: 'Portland, OR', img: 'https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?auto=format&fit=crop&w=500&q=80' },
  { name: 'Amara Okafor', role: 'Video editor & animator', category: 'Video', tag: 'Fast responder', rating: '5.0', jobs: 26, price: 120, color: 'yellow', initials: 'AO', location: 'London, UK', img: '' },
  { name: 'Noah Park', role: 'Web developer', category: 'Development', tag: 'Top creator', rating: '4.9', jobs: 58, price: 95, color: 'coral', initials: 'NP', location: 'Toronto, CA', img: '' },
  { name: 'Sofia Reyes', role: 'Copywriter & brand voice', category: 'Writing', tag: 'Fast responder', rating: '4.7', jobs: 39, price: 70, color: 'yellow', initials: 'SR', location: 'Madrid, ES', img: '' },
  { name: 'Theo Martin', role: 'Editorial illustrator', category: 'Illustration', tag: 'Rising talent', rating: '4.9', jobs: 22, price: 75, color: 'mint', initials: 'TM', location: 'Paris, FR', img: '' },
]

type Job = { title: string; category: string; budget: string; time: string; proposals: number; color: string; brief?: string; deadline?: string; humanMade?: boolean }
type CommissionRequest = { id: string; title: string; creatorName: string; creatorInitials: string; creatorColor: string; brief: string; deadline: string; budget: string; reference: string; status: 'Pending review' | 'Accepted' | 'In progress' | 'Delivered' | 'Rejected'; createdAt: string }
type Proposal = { id: string; jobTitle: string; creatorName: string; coverLetter: string; price: string; delivery: string; status: 'Submitted' | 'Shortlisted' | 'Accepted' | 'Declined'; createdAt: string }
function usePersistentState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : initialValue } catch { return initialValue } })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* browser storage may be unavailable */ } }, [key, value])
  return [value, setValue]
}

const sampleJobs: Job[] = [
  { title: 'Album cover for indie pop release', category: 'Graphic design', budget: '$250–400', time: 'Posted 2h ago', proposals: 8, color: 'lavender', brief: 'Create vivid, tactile cover artwork with handmade textures and unexpected typography.', deadline: 'Within three weeks', humanMade: true },
  { title: 'Edit a 60-second launch reel', category: 'Video', budget: '$180 fixed', time: 'Posted 5h ago', proposals: 12, color: 'yellow', brief: 'Edit a short launch reel with clear pacing, captions and social-ready exports.', deadline: 'Within one week', humanMade: true },
  { title: 'Build a playful portfolio site', category: 'Development', budget: '$800–1,200', time: 'Posted yesterday', proposals: 5, color: 'mint', brief: 'Build a responsive portfolio website with a playful visual style.', deadline: 'Within one month', humanMade: true },
]

const nav: { id: Page; label: string }[] = [
  { id: 'explore', label: 'Find creators' },
  { id: 'jobs', label: 'Job board' },
  { id: 'dashboard', label: 'Workspace' },
  { id: 'messages', label: 'Messages' },
  { id: 'proposals', label: 'My proposals' },
]

function Button({ children, onClick, kind = 'primary', type = 'button', disabled = false }: { children: ReactNode; onClick?: () => void; kind?: 'primary' | 'secondary' | 'quiet' | 'dark'; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button className={`btn ${kind}`} onClick={onClick} type={type} disabled={disabled}>{children}</button>
}

function Field({ label, placeholder, type = 'text', area = false, value, onChange }: { label: string; placeholder?: string; type?: string; area?: boolean; value?: string; onChange?: (v: string) => void }) {
  return <label className="field"><span>{label}</span>{area
    ? <textarea placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)} />
    : <input type={type} placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)} />}</label>
}

function Chip({ children, active = false, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return <button className={`chip ${active ? 'active' : ''}`} onClick={onClick}>{children}</button>
}

function Badge({ children, tone = 'mint' }: { children: ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

function Avatar({ creator, size = 'md' }: { creator: typeof creators[0]; size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`avatar ${size} ${creator.color}`}>{creator.img ? <img src={creator.img} alt={`${creator.name}, ${creator.role}`} /> : creator.initials}</div>
}

function CreatorCard({ creator, openCreator }: { creator: typeof creators[0]; openCreator: (creator: typeof creators[0]) => void }) {
  return <article className="creator-card" onClick={() => openCreator(creator)} onKeyDown={e => e.key === 'Enter' && openCreator(creator)} tabIndex={0}>
    <div className={`creator-cover ${creator.color}`}><Avatar creator={creator} size="lg" /><Badge tone={creator.color}>{creator.tag}</Badge></div>
    <div className="card-body">
      <div className="row between"><div><h3>{creator.name}</h3><p>{creator.role}</p></div><b>★ {creator.rating}</b></div>
      <div className="creator-location">{creator.location} · {creator.category}</div>
      <div className="card-footer"><span>{creator.jobs} projects</span><strong>From ${creator.price}</strong></div>
    </div>
  </article>
}

function Header({ page, go }: { page: Page; go: (p: Page) => void }) {
  const [open, setOpen] = useState(false)
  return <header className="topbar">
    <button className="brand" onClick={() => go('home')}><span className="brand-mark">C</span>CraftConnect</button>
    <nav className={open ? 'open' : ''}>
      {nav.map(n => <button key={n.id} className={page === n.id ? 'nav-active' : ''} onClick={() => { go(n.id); setOpen(false) }}>{n.label}</button>)}
    </nav>
    <div className="header-actions"><button className="icon-btn" aria-label="Notifications" onClick={() => go('notifications')}>3</button><Button kind="quiet" onClick={() => go('login')}>Log in</Button><Button onClick={() => go('signup')}>Join free</Button></div>
    <button className="menu" aria-label="Toggle menu" onClick={() => setOpen(!open)}>Menu</button>
  </header>
}

function Home({ go, openCreator }: { go: (p: Page) => void; openCreator: (creator: typeof creators[0]) => void }) {
  return <>
    <main>
      <section className="hero wrap">
        <div className="hero-copy"><Badge tone="yellow">THE HUMAN-MADE MARKETPLACE</Badge><h1>Big ideas,<br /><span>made by people.</span></h1><p>Find brilliant students and independent creators to bring your next project to life—without the agency runaround.</p><div className="actions"><Button onClick={() => go('explore')}>Explore creators →</Button><Button kind="secondary" onClick={() => go('post-job')}>Post a job</Button></div><div className="trust"><b>4.9 average rating</b><span>•</span><span>2,400+ projects created</span></div></div>
        <div className="hero-art">
          <div className="art-card main-art"><img src="https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?auto=format&fit=crop&w=900&q=85" alt="A freelance designer working at a laptop" /></div>
          <div className="floating-note note-one">Available this week</div><div className="floating-note note-two">100% human-made</div>
        </div>
      </section>
      <section className="marquee"><span>DESIGN</span><i>✦</i><span>ILLUSTRATION</span><i>✦</i><span>VIDEO</span><i>✦</i><span>WRITING</span><i>✦</i><span>CODE</span></section>
      <section className="section wrap">
        <div className="section-head"><div><span className="eyebrow">PEOPLE TO KNOW</span><h2>Featured creators</h2></div><Button kind="secondary" onClick={() => go('explore')}>View everyone</Button></div>
        <div className="creator-grid">{creators.slice(0, 3).map(c => <CreatorCard key={c.name} creator={c} openCreator={openCreator} />)}</div>
      </section>
      <section className="section categories"><div className="wrap"><span className="eyebrow">START WITH A SKILL</span><h2>What are we making?</h2><div className="category-grid">{[['Brand & design','01','lavender'],['Art & illustration','02','yellow'],['Video & motion','03','coral'],['Writing & words','04','mint'],['Web & code','05','lavender']].map(x => <button key={x[0]} className={`category ${x[2]}`} onClick={() => go('explore')}><small>{x[1]}</small><strong>{x[0]}</strong><span>↗</span></button>)}</div></div></section>
      <section className="section wrap"><div className="cta"><div><Badge tone="yellow">CREATORS WELCOME</Badge><h2>Good at something?<br />Get paid for it.</h2><p>Build your page, set your terms, and do work you’re proud to sign.</p></div><Button kind="dark" onClick={() => go('signup')}>Become a creator →</Button></div></section>
    </main>
  </>
}

function Explore({ openCreator }: { openCreator: (creator: typeof creators[0]) => void }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All skills')
  const [sort, setSort] = useState('Recommended')
  const shown = useMemo(() => creators
    .filter(c => (c.name + c.role + c.category).toLowerCase().includes(query.toLowerCase()))
    .filter(c => filter === 'All skills' || c.category === filter)
    .sort((a, b) => sort === 'Price: low to high' ? a.price - b.price : sort === 'Most reviewed' ? b.jobs - a.jobs : Number(b.rating) - Number(a.rating)), [query, filter, sort])
  return <main className="wrap page">
    <div className="page-title"><div><span className="eyebrow">DISCOVER TALENT</span><h1>Find your creative match.</h1><p>Real people, clear prices, work worth talking about.</p></div><div className="result-count"><b>{shown.length}</b><span>creators found</span></div></div>
    <div className="searchbar"><label><span>Search</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try “album cover” or “React”" /></label><Button>Search</Button></div>
    <div className="explore-tools"><div className="filters">{['All skills','Design','Illustration','Video','Writing','Development'].map(x => <Chip key={x} active={filter === x} onClick={() => setFilter(x)}>{x}</Chip>)}</div><label className="sort-control"><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value)}><option>Recommended</option><option>Most reviewed</option><option>Price: low to high</option></select></label></div>
    {shown.length ? <div className="creator-grid three">{shown.map(c => <CreatorCard key={c.name} creator={c} openCreator={openCreator} />)}</div> : <Empty title="No creators found" text="Try another skill or clear your search." action="Clear filters" onClick={() => {setQuery('');setFilter('All skills')}} />}
  </main>
}

function CreatorProfile({ go, creator: c, isSaved, onToggleSave }: { go: (p: Page) => void; creator: typeof creators[0]; isSaved: boolean; onToggleSave: () => void }) {
  return <main className="wrap page">
    <button className="back" onClick={() => go('explore')}>← Back to creators</button>
    <section className="profile-hero">
      <div className="profile-person"><Avatar creator={c} size="lg" /><div><Badge tone="mint">AVAILABLE FOR WORK</Badge><h1>{c.name}</h1><p>{c.role} creating thoughtful, distinctive work for small businesses and big ideas.</p><div className="meta"><b>★ {c.rating} ({c.jobs} reviews)</b><span>{c.location}</span><span>Usually replies in 2h</span></div></div></div>
      <div className="profile-action"><span>Projects from</span><strong>${c.price}</strong><Button onClick={() => go('commission')}>Request commission →</Button><Button kind="secondary" onClick={onToggleSave}>{isSaved ? '♥ Saved creator' : '♡ Save creator'}</Button><Button kind="secondary" onClick={() => go('messages')}>Send a message</Button></div>
    </section>
    <div className="profile-layout"><div>
      <section className="content-section"><div className="section-head"><h2>Selected work</h2><span>6 projects</span></div><div className="portfolio-grid"><div className="work work-a"><b>PEACHY</b><span>Brand identity</span></div><div className="work work-b"><b>NOON</b><span>Poster series</span></div><div className="work work-c"><b>COMMON<br />GROUND</b><span>Packaging</span></div></div></section>
      <section className="content-section"><h2>Kind words</h2><div className="review"><div className="row between"><b>★★★★★</b><Badge>Verified project</Badge></div><blockquote>“{c.name.split(' ')[0]} understood the vibe immediately and made the whole process genuinely fun. The final result feels completely us.”</blockquote><p>Sam R. · Brand launch project</p></div><div className="review second-review"><div className="row between"><b>★★★★★</b><Badge>Verified project</Badge></div><blockquote>“Clear communication, thoughtful decisions, and beautiful work delivered right on time.”</blockquote><p>Jamie L. · Independent founder</p></div></section>
    </div><aside><h2>Services</h2>{[['Logo starter','2 concepts · 2 revisions','$185'],['Full visual identity','Logo, color, type & guide','$650'],['Event poster','Print + social formats','$120']].map(s => <button className="service" key={s[0]} onClick={() => go('commission')}><span><b>{s[0]}</b><small>{s[1]}</small></span><strong>{s[2]}</strong></button>)}</aside></div>
  </main>
}

function Commission({ go, creator, onCreateRequest }: { go: (p: Page) => void; creator: typeof creators[0]; onCreateRequest: (request: CommissionRequest) => void }) {
  const [sent, setSent] = useState(false)
  const [title, setTitle] = useState('')
  const [brief, setBrief] = useState('')
  const [deadline, setDeadline] = useState('')
  const [budget, setBudget] = useState(String(creator.price))
  const [reference, setReference] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !brief.trim() || !budget.trim()) return
    onCreateRequest({ id: `cc-${Date.now()}`, title: title.trim(), creatorName: creator.name, creatorInitials: creator.initials, creatorColor: creator.color, brief: brief.trim(), deadline, budget: budget.trim(), reference: reference.trim(), status: 'Pending review', createdAt: new Date().toLocaleDateString() })
    setSent(true)
  }
  if (sent) return <main className="wrap page"><div className="success card"><div className="success-mark">✓</div><Badge tone="mint">REQUEST SENT</Badge><h1>Your idea is on its way.</h1><p>Your request to {creator.name} has been added to My Commissions. This is a local demo—no payment will be taken.</p><Button onClick={() => go('project')}>View project tracker →</Button><Button kind="secondary" onClick={() => go('dashboard')}>Go to workspace</Button></div></main>
  return <main className="wrap page narrow"><button className="back" onClick={() => go('creator')}>← Back to {creator.name}’s profile</button><div className="form-head"><span className="eyebrow">NEW COMMISSION</span><h1>Tell {creator.name.split(' ')[0]} what you’re making.</h1><p>This is a mock request—no payment will be taken.</p></div><form className="form-card" onSubmit={submit}><div className="selected-service"><div><small>SELECTED SERVICE</small><b>Signature creative package</b><span>Creative direction, final deliverables & two revisions</span></div><strong>From ${creator.price}</strong></div><Field label="Project title" placeholder="e.g. A joyful identity for my bakery" value={title} onChange={setTitle} /><Field label="Requirements and deliverables" placeholder={`Share the idea, audience, style, and everything ${creator.name.split(' ')[0]} should know...`} area value={brief} onChange={setBrief} /><div className="two-col"><Field label="Ideal deadline" type="date" value={deadline} onChange={setDeadline} /><Field label="Budget (USD)" placeholder={`e.g. ${creator.price * 2}`} value={budget} onChange={setBudget} /></div><Field label="Reference link (optional)" placeholder="https://" value={reference} onChange={setReference} /><label className="upload"><input type="file" multiple accept=".png,.jpg,.jpeg,.pdf" /><b>Attach reference files</b><span>PNG, JPG, or PDF · Demo only; files are not uploaded</span></label><Button type="submit" disabled={!title.trim() || !brief.trim() || !budget.trim()}>Send commission request →</Button></form></main>
}

function Project({ go, request, onUpdateRequest }: { go: (p: Page) => void; request?: CommissionRequest; onUpdateRequest: (id: string, status: CommissionRequest['status']) => void }) {
  const title = request?.title || 'Peachy Bakery identity'
  const creatorName = request?.creatorName || 'Maya Chen'
  const budget = request?.budget ? (request.budget.includes('$') ? request.budget : `$${request.budget}`) : '$650 fixed'
  const status = request?.status || 'In progress'
  const progress = status === 'Pending review' ? 10 : status === 'Accepted' ? 25 : status === 'In progress' ? 62 : status === 'Delivered' ? 100 : 0
  return <main className="wrap page"><div className="page-title"><div><button className="back" onClick={() => go('dashboard')}>← All projects</button><Badge tone={status === 'Pending review' ? 'yellow' : status === 'Rejected' ? 'coral' : 'lavender'}>{status.toUpperCase()}</Badge><h1>{title}</h1><p>Working with {creatorName}{request?.deadline ? ` · Due ${request.deadline}` : ' · Deadline to be agreed'}</p></div><Button kind="secondary" onClick={() => go('messages')}>Message {creatorName.split(' ')[0]}</Button></div>
    <div className="project-layout"><div className="card padded"><h2>Project progress</h2><p>{request ? status === 'Pending review' ? 'Your request is saved and waiting for the creator to review it.' : status === 'Rejected' ? 'The creator declined this request. You can explore other creators.' : 'Your commission is tracked here. Update the status as the project moves forward.' : 'Track each stage of the creative process here.'}</p><div className="progress"><i style={{width: `${progress}%`}} /></div><div className="milestones">{[['1','Request submitted',request?.createdAt || 'Jun 10', 'done'],['2','Creator review',status === 'Pending review' ? 'Awaiting response' : status === 'Rejected' ? 'Declined' : 'Reviewed', status === 'Pending review' ? 'current' : 'done'],['3','Work in progress',status === 'In progress' ? 'Active' : status === 'Accepted' ? 'Ready to start' : status === 'Delivered' ? 'Completed' : 'Not started', status === 'In progress' ? 'current' : status === 'Accepted' ? 'current' : ''],['4','Final delivery',status === 'Delivered' ? 'Delivered' : 'Not started',status === 'Delivered' ? 'done' : '']].map(m => <div className={`milestone ${m[3]}`} key={m[0]}><span>{m[3] === 'done' ? '✓' : m[0]}</span><div><b>{m[1]}</b><small>{m[2]}</small></div>{m[3] === 'current' && <Badge tone="yellow">CURRENT</Badge>}</div>)}</div>{request?.brief && <div className="card padded" style={{marginTop:24}}><h3>Your brief</h3><p>{request.brief}</p>{request.reference && <p>Reference: <a href={request.reference} target="_blank" rel="noreferrer">{request.reference}</a></p>}</div>}
    {request && <div className="project-controls"><b>Prototype controls</b><p>Use these actions to demonstrate the commission lifecycle.</p><div className="actions">{status === 'Pending review' && <><Button onClick={() => onUpdateRequest(request.id, 'Accepted')}>Accept request</Button><Button kind="secondary" onClick={() => onUpdateRequest(request.id, 'Rejected')}>Decline</Button></>}{status === 'Accepted' && <Button onClick={() => onUpdateRequest(request.id, 'In progress')}>Start work →</Button>}{status === 'In progress' && <Button onClick={() => onUpdateRequest(request.id, 'Delivered')}>Mark as delivered ✓</Button>}{status === 'Delivered' && <Button onClick={() => go('reviews')}>Leave a review →</Button>}</div></div>}
    </div><aside><div className="card padded"><h3>Project details</h3><dl><div><dt>Budget</dt><dd>{budget}</dd></div><div><dt>Created</dt><dd>{request?.createdAt || 'June 8'}</dd></div><div><dt>Due date</dt><dd>{request?.deadline || 'To be agreed'}</dd></div><div><dt>Creator</dt><dd>{creatorName}</dd></div></dl></div><div className="card padded mint-box"><b>Everything stays human.</b><p>AI-generated work must be disclosed under our Human-Made Policy.</p><button className="text-link" onClick={() => go('policy')}>Read the policy →</button></div></aside></div>
  </main>
}

function Dashboard({ go, requests, onOpenRequest }: { go: (p: Page) => void; requests: CommissionRequest[]; onOpenRequest: (request: CommissionRequest) => void }) {
  const [role, setRole] = useState<'client'|'creator'>('client')
  return <main className="wrap page">
    <div className="page-title"><div><span className="eyebrow">{role.toUpperCase()} WORKSPACE</span><h1>{role === 'client' ? 'Good morning, Alex.' : 'Make something great today.'}</h1><p>{role === 'client' ? 'Here’s what’s moving across your projects.' : 'Your commissions, earnings, and opportunities in one place.'}</p></div><div className="role-switch"><button className={role === 'client' ? 'active':''} onClick={() => setRole('client')}>Client</button><button className={role === 'creator' ? 'active':''} onClick={() => setRole('creator')}>Creator</button></div></div>
    <div className="stat-grid">{(role === 'client' ? [['Active projects','2','coral'],['Awaiting review','1','yellow'],['Saved creators','12','lavender']] : [['This month','$1,840','mint'],['Active projects','4','coral'],['New inquiries','3','yellow']]).map(s => <div className={`stat ${s[2]}`} key={s[0]}><span>{s[0]}</span><strong>{s[1]}</strong></div>)}</div>
    <div className="dashboard-grid"><section><div className="section-head"><h2>{role === 'client' ? 'Active projects' : 'Your commissions'}</h2><Button kind="secondary" onClick={() => go(role === 'client' ? 'explore' : 'studio')}>{role === 'client' ? '+ New project' : 'Manage services'}</Button></div>{requests.map(r => <button className="project-row" key={r.id} onClick={() => { onOpenRequest(r); go('project') }}><div className={`avatar sm ${r.creatorColor}`}>{r.creatorInitials}</div><div><b>{r.title}</b><span>{r.creatorName} · Commission request</span></div><Badge tone={r.status === 'Pending review' ? 'yellow' : 'lavender'}>{r.status.toUpperCase()}</Badge><strong>{r.status === 'Pending review' ? '10%' : r.status === 'Delivered' ? '100%' : '25%'}</strong></button>)}<button className="project-row" onClick={() => go('project')}><Avatar creator={creators[0]} size="sm" /><div><b>Peachy Bakery identity</b><span>Maya Chen · Logo concepts ready</span></div><Badge tone="yellow">IN REVIEW</Badge><strong>62%</strong></button><button className="project-row" onClick={() => go('project')}><Avatar creator={creators[2]} size="sm" /><div><b>Summer launch reel</b><span>Amara Okafor · First cut in progress</span></div><Badge tone="lavender">IN PROGRESS</Badge><strong>35%</strong></button></section><aside className="card padded"><h2>Quick actions</h2>{[['Messages','messages'],['Notifications','notifications'],['Leave a review','reviews'],['Profile settings','settings']].map(x => <button className="quick" key={x[0]} onClick={() => go(x[1] as Page)}>{x[0]}<span>→</span></button>)}</aside></div>
  </main>
}

function Jobs({ go, jobs, onSelectJob }: { go: (p: Page) => void; jobs: Job[]; onSelectJob: (job: Job) => void }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [budget, setBudget] = useState('Any budget')
  const [humanOnly, setHumanOnly] = useState(true)
  const shown = jobs.filter(j => (j.title + ' ' + j.category + ' ' + (j.brief || '')).toLowerCase().includes(query.toLowerCase()))
    .filter(j => category === 'All categories' || j.category.toLowerCase().includes(category.toLowerCase()))
    .filter(j => budget === 'Any budget' || (budget === '$100–500' && /100|180|250|300|400|500/.test(j.budget)) || (budget === '$500+' && /650|800|1,|1200|1,200/.test(j.budget)))
    .filter(j => !humanOnly || j.humanMade !== false)
  return <main className="wrap page"><div className="page-title"><div><span className="eyebrow">OPEN BRIEFS</span><h1>Find work worth making.</h1><p>Browse fresh opportunities from clients who value your craft.</p></div><Button onClick={() => go('post-job')}>Post a job →</Button></div><div className="searchbar"><label><span>Search open jobs</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by skill or keyword" /></label><Button kind="secondary" onClick={() => setQuery('')}>Clear</Button></div><div className="jobs-layout"><aside className="filter-panel"><b>Filter jobs</b><label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option><option>Graphic design</option><option>Illustration</option><option>Video</option><option>Writing</option><option>Development</option></select></label><label>Budget<select value={budget} onChange={e => setBudget(e.target.value)}><option>Any budget</option><option>$100–500</option><option>$500+</option></select></label><label className="check"><input type="checkbox" checked={humanOnly} onChange={e => setHumanOnly(e.target.checked)} /> Human-made only</label><Button kind="quiet" onClick={() => { setQuery(''); setCategory('All categories'); setBudget('Any budget'); setHumanOnly(false) }}>Reset filters</Button></aside><section className="job-list"><div className="row between"><b>{shown.length} open {shown.length === 1 ? 'job' : 'jobs'}</b><span>Newest first</span></div>{shown.length ? shown.map((j,i) => <button className="job-card" key={`${j.title}-${i}`} onClick={() => { onSelectJob(j); go('job') }}><div><div className="row"><Badge tone={j.color}>{j.category}</Badge><span>{j.time}</span></div><h2>{j.title}</h2><p>{j.brief || 'Looking for a thoughtful collaborator with clear communication and a strong point of view.'}</p><div className="job-meta"><b>{j.budget}</b><span>{j.proposals} proposals</span></div></div><span className="arrow">↗</span></button>) : <Empty title="No jobs match those filters" text="Try a different keyword or clear your filters." action="Clear filters" onClick={() => { setQuery(''); setCategory('All categories'); setBudget('Any budget'); setHumanOnly(false) }} />}</section></div></main>
}

function JobDetail({ go, job, proposals, onSubmitProposal, isSaved, onToggleSave }: { go: (p: Page) => void; job: Job; proposals: Proposal[]; onSubmitProposal: (p: Proposal) => void; isSaved: boolean; onToggleSave: () => void }) {
  const [coverLetter, setCoverLetter] = useState('')
  const [price, setPrice] = useState('')
  const [delivery, setDelivery] = useState('')
  const mine = proposals.find(p => p.jobTitle === job.title)
  const [showForm, setShowForm] = useState(false)
  return <main className="wrap page"><button className="back" onClick={() => go('jobs')}>← Back to jobs</button><div className="job-detail"><article><div className="row"><Badge tone={job.color}>{job.category.toUpperCase()}</Badge><span>{job.time}</span></div><h1>{job.title}</h1><p className="lead">{job.brief || 'Looking for a thoughtful collaborator with a strong point of view and clear communication.'}</p><h2>What I need</h2><p>{job.brief || 'Deliverables and creative direction will be agreed with the selected creator.'}</p><h2>Deadline</h2><p>{job.deadline || 'To be agreed with the creator.'}</p><p>{job.humanMade === false ? 'AI tools may be used if disclosed and agreed.' : 'This brief requests human-made work.'}</p><div className="client-box"><div className="avatar sm yellow">ER</div><div><b>Posted by Elise R.</b><span>3 hires · 5.0 client rating</span></div></div></article><aside className="card padded proposal"><span>Project budget</span><strong>{job.budget}</strong><span>Fixed price · {job.deadline || 'Deadline to be agreed'}</span><Button kind="secondary" onClick={onToggleSave}>{isSaved ? '♥ Saved job' : '♡ Save job'}</Button>{mine ? <div className="applied"><b>Proposal {mine.status.toLowerCase()}</b><p>Your proposal: {mine.price}</p><Button kind="secondary" onClick={() => go('proposals')}>View my proposals</Button></div> : <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Close proposal form' : 'Send a proposal →'}</Button>}{showForm && !mine && <form className="proposal-form" onSubmit={e => { e.preventDefault(); if (!coverLetter.trim() || !price.trim()) return; onSubmitProposal({ id: `prop-${Date.now()}`, jobTitle: job.title, creatorName: 'Alex Santos', coverLetter: coverLetter.trim(), price: price.trim(), delivery: delivery.trim(), status: 'Submitted', createdAt: new Date().toLocaleDateString() }); setShowForm(false) }}><Field label="Cover letter" area value={coverLetter} onChange={setCoverLetter} placeholder="Explain why you are a good fit..." /><Field label="Your proposed price" value={price} onChange={setPrice} placeholder="$300" /><Field label="Delivery estimate" value={delivery} onChange={setDelivery} placeholder="e.g. 7 days" /><Button type="submit" disabled={!coverLetter.trim() || !price.trim()}>Submit proposal</Button></form>}<small>{job.proposals + proposals.filter(p => p.jobTitle === job.title).length} proposals so far</small></aside></div></main>
}

function ProposalList({ proposals, go, onUpdate }: { proposals: Proposal[]; go: (p: Page) => void; onUpdate: (id:string,status:Proposal['status'])=>void }) {
  return <main className="wrap page"><div className="page-title"><div><span className="eyebrow">CREATOR WORKSPACE</span><h1>My proposals.</h1><p>Track the opportunities you have applied for.</p></div><Button onClick={() => go('jobs')}>Find more work →</Button></div>{proposals.length ? <div className="proposal-list">{proposals.map(p => <article className="card padded" key={p.id}><div className="row between"><Badge tone={p.status === 'Accepted' ? 'mint' : p.status === 'Declined' ? 'coral' : 'yellow'}>{p.status.toUpperCase()}</Badge><small>{p.createdAt}</small></div><h2>{p.jobTitle}</h2><p>{p.coverLetter}</p><div className="row between"><b>Proposed price: {p.price}</b><span>{p.delivery || 'Delivery time to be agreed'}</span></div>{p.status === 'Submitted' || p.status === 'Shortlisted' ? <div className="actions" style={{marginTop:16}}><Button onClick={()=>onUpdate(p.id,'Accepted')}>Accept proposal</Button><Button kind="secondary" onClick={()=>onUpdate(p.id,p.status==='Submitted'?'Shortlisted':'Declined')}>{p.status==='Submitted'?'Shortlist':'Decline proposal'}</Button></div> : <p className="status-note">{p.status === 'Accepted' ? 'This proposal has been accepted in the demo.' : 'This proposal was declined in the demo.'}</p>}</article>)}</div> : <Empty title="No proposals yet" text="Browse the job board and send your first proposal." action="Browse jobs" onClick={() => go('jobs')} />}</main>
}

function PostJob({ go, onCreateJob }: { go: (p: Page) => void; onCreateJob: (job: Job) => void }) {
  const [done, setDone] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Graphic design')
  const [brief, setBrief] = useState('')
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [humanMade, setHumanMade] = useState(true)
  if (done) return <main className="wrap page"><div className="success card"><div className="success-mark">✓</div><h1>Your job is live.</h1><p>It has been added to the local demo job board. Creators can now discover your brief.</p><Button onClick={() => go('jobs')}>View job board</Button></div></main>
  return <main className="wrap page narrow"><button className="back" onClick={() => go('jobs')}>← Back to jobs</button><div className="form-head"><span className="eyebrow">POST A BRIEF</span><h1>What do you need made?</h1><p>Clear briefs get better proposals. You can edit this later.</p></div><form className="form-card" onSubmit={e => {e.preventDefault(); if (!title.trim() || !brief.trim() || !budget.trim()) return; onCreateJob({ title: title.trim(), category, brief: brief.trim(), budget: budget.trim(), deadline, time: 'Just now', proposals: 0, color: category === 'Video' ? 'yellow' : category === 'Development' ? 'mint' : category === 'Writing' ? 'coral' : category === 'Illustration' ? 'lavender' : 'lavender', humanMade }); setDone(true) }}><Field label="Job title" placeholder="e.g. Illustrations for a children’s zine" value={title} onChange={setTitle} /><label className="field"><span>Category</span><select value={category} onChange={e => setCategory(e.target.value)}><option>Graphic design</option><option>Illustration</option><option>Video</option><option>Writing</option><option>Development</option><option>Photography</option></select></label><Field label="Project brief" area value={brief} onChange={setBrief} placeholder="Describe the project, deliverables, style, and ideal collaborator..." /><div className="two-col"><Field label="Budget" value={budget} onChange={setBudget} placeholder="$300–500" /><Field label="Deadline" type="date" value={deadline} onChange={setDeadline} /></div><label className="check"><input type="checkbox" checked={humanMade} onChange={e => setHumanMade(e.target.checked)} /> This project must be entirely human-made</label><Button type="submit" disabled={!title.trim() || !brief.trim() || !budget.trim()}>Publish job →</Button></form></main>
}

function Studio() {
  const [tab, setTab] = useState('Services')
  const [services, setServices] = usePersistentState<{name:string;price:string;description:string}[]>('craftconnect-services', [{name:'Logo starter',price:'$185',description:'2 concepts · 2 revisions'},{name:'Full visual identity',price:'$650',description:'Logo, color, type & guide'},{name:'Event poster',price:'$120',description:'Print + social formats'}])
  const [projects, setProjects] = usePersistentState<{name:string;category:string;description:string}[]>('craftconnect-portfolio', [{name:'PEACHY',category:'Brand identity',description:'Brand identity concept'},{name:'NOON',category:'Poster series',description:'Editorial poster series'}])
  const [adding,setAdding] = useState(false); const [name,setName]=useState(''); const [price,setPrice]=useState(''); const [description,setDescription]=useState('')
  const submit = (e:FormEvent) => { e.preventDefault(); if(!name.trim()) return; if(tab==='Services') setServices([{name:name.trim(),price:price.trim() || 'Price on request',description:description.trim() || 'Custom creative service'},...services]); else setProjects([{name:name.trim(),category:price.trim() || 'Creative project',description:description.trim() || 'Portfolio project'},...projects]); setName('');setPrice('');setDescription('');setAdding(false) }
  return <main className="wrap page"><div className="page-title"><div><span className="eyebrow">CREATOR STUDIO</span><h1>Your storefront.</h1><p>Show the work you want more of and make it easy to buy.</p></div><Button kind="secondary" onClick={()=>setTab('Portfolio')}>Preview public profile</Button></div><div className="tabs">{['Services','Portfolio'].map(t => <Chip key={t} active={tab===t} onClick={() => {setTab(t);setAdding(false)}}>{t}</Chip>)}</div>{tab === 'Services' ? <section className="management"><div className="section-head"><h2>Service packages</h2><Button onClick={()=>setAdding(!adding)}>+ Add service</Button></div>{adding && <form className="form-card" onSubmit={submit}><Field label="Service name" value={name} onChange={setName} placeholder="e.g. Social media kit"/><div className="two-col"><Field label="Price" value={price} onChange={setPrice} placeholder="$150"/><Field label="What's included" value={description} onChange={setDescription} placeholder="Deliverables and revisions"/></div><Button type="submit" disabled={!name.trim()}>Save service</Button></form>}{services.map((x,i) => <div className="manage-row" key={`${x.name}-${i}`}><span className="drag">••</span><div><b>{x.name}</b><span>{x.description}</span></div><strong>{x.price}</strong><Button kind="quiet" onClick={()=>setServices(services.filter((_,j)=>j!==i))}>Remove</Button></div>)}</section> : <section className="management"><div className="section-head"><h2>Portfolio projects</h2><Button onClick={()=>setAdding(!adding)}>+ Add project</Button></div>{adding && <form className="form-card" onSubmit={submit}><Field label="Project name" value={name} onChange={setName} placeholder="e.g. Community poster series"/><div className="two-col"><Field label="Category" value={price} onChange={setPrice} placeholder="Branding"/><Field label="Description" value={description} onChange={setDescription} placeholder="What did you make?"/></div><Button type="submit" disabled={!name.trim()}>Save project</Button></form>}<div className="portfolio-grid">{projects.map((p,i)=><div className={`work ${['work-a','work-b','work-c'][i%3]}`} key={`${p.name}-${i}`}><b>{p.name}</b><span>{p.category}</span><button onClick={()=>setProjects(projects.filter((_,j)=>i!==j))}>Remove</button></div>)}<button className="add-work" onClick={()=>setAdding(true)}>+<span>Add project</span></button></div></section>}</main>
}

function Messages() {
  const [active, setActive] = useState(0); const [text,setText]=useState('')
  const [threads,setThreads] = usePersistentState<Record<string,string[]>>('craftconnect-messages', {'Maya Chen':['Hi Alex! I’ve uploaded the first concepts. I’d love to know which direction feels closest.','These are wonderful. Direction two really captures the warmth we talked about.'],'Jon Bell':['Thanks for the thoughtful feedback!'],'Amara Okafor':['I can share a first cut this week.']})
  const creator = creators[active]; const conversation = threads[creator.name] || []
  return <main className="wrap page"><div className="inbox card"><aside><div className="inbox-title"><h1>Messages</h1><Badge tone="coral">DEMO INBOX</Badge></div>{creators.slice(0,3).map((c,i) => <button className={`thread ${active===i?'active':''}`} onClick={() => setActive(i)} key={c.name}><Avatar creator={c} size="sm" /><span><b>{c.name}</b><small>{(threads[c.name] || ['Start a conversation']).slice(-1)[0]}</small></span><time>{i===0?'10:42':'Tue'}</time></button>)}</aside><section className="conversation"><div className="conversation-head"><Avatar creator={creator} size="sm" /><div><b>{creator.name}</b><span>Prototype conversation</span></div></div><div className="messages">{conversation.map((m,i)=><p className={`bubble ${i%2===0?'theirs':'mine'}`} key={`${m}-${i}`}>{m}</p>)}</div><form className="composer" onSubmit={e=>{e.preventDefault();if(text.trim()){setThreads({...threads,[creator.name]:[...conversation,text.trim()]});setText('')}}}><input placeholder="Write a message..." value={text} onChange={e=>setText(e.target.value)} /><Button type="submit" disabled={!text.trim()}>Send</Button></form></section></div></main>
}

function Notifications({ go }: { go: (p: Page) => void }) {
  const [read,setRead] = useState(false)
  return <main className="wrap page narrow"><div className="section-head"><div><span className="eyebrow">INBOX</span><h1>Notifications</h1></div><Button kind="quiet" onClick={() => setRead(true)}>{read ? 'All caught up ✓' : 'Mark all read'}</Button></div><div className="notification-list">{[['coral','Maya uploaded 3 logo concepts','Peachy Bakery identity · 8 minutes ago','project'],['yellow','New proposal on your job','Album cover brief · 1 hour ago','job'],['mint','Payment milestone approved','Summer launch reel · Yesterday','project'],['lavender','Jon sent you a message','“Thanks for the thoughtful feedback!” · Tuesday','messages']].map(n=><button className="notification" key={n[1]} onClick={()=>go(n[3] as Page)}><i className={n[0]} /><div><b>{n[1]}</b><span>{n[2]}</span></div><span>→</span></button>)}</div></main>
}

function Reviews() {
  const [done,setDone]=useState(false); const [rating,setRating]=useState(5); const [review,setReview]=useState('')
  const [reviews,setReviews]=usePersistentState<{rating:number;review:string;project:string;creator:string;date:string}[]>('craftconnect-reviews',[])
  return <main className="wrap page narrow"><span className="eyebrow">PROJECT FEEDBACK</span><h1>Leave a review</h1>{done?<div className="success card"><div className="success-mark">✓</div><h2>Thanks for sharing.</h2><p>Your review has been saved in this prototype.</p><div className="review"><b>{'★'.repeat(rating)}{'☆'.repeat(5-rating)}</b><p>{review}</p></div><Button onClick={()=>setDone(false)}>Write another review</Button></div>:<form className="form-card" onSubmit={e=>{e.preventDefault();if(!review.trim())return;setReviews([{rating,review:review.trim(),project:'Summer launch reel',creator:'Amara Okafor',date:new Date().toLocaleDateString()},...reviews]);setDone(true)}}><div className="review-person"><Avatar creator={creators[2]} size="md" /><div><b>Summer launch reel</b><span>Created by Amara Okafor</span></div></div><fieldset><legend>How was the work?</legend><div className="stars">{[1,2,3,4,5].map(x=><button type="button" aria-label={`${x} stars`} className={x<=rating?'selected':''} key={x} onClick={()=>setRating(x)}>★</button>)}</div></fieldset><Field label="Tell others about your experience" area value={review} onChange={setReview} placeholder="What stood out about working together?" /><label className="check"><input type="checkbox" defaultChecked /> Show this review on the creator’s profile</label><Button type="submit" disabled={!review.trim()}>Publish review</Button><small>{reviews.length} review(s) saved locally</small></form>}</main>
}

function Settings() {
  const [saved,setSaved]=useState(false)
  const [profile,setProfile]=usePersistentState('craftconnect-profile',{first:'Alex',last:'Santos',headline:'Independent coffee shop founder',bio:'Building neighborhood spaces for good coffee and better conversations.',location:'Austin, TX',email:'alex@example.com'})
  const update=(key:keyof typeof profile,value:string)=>{setProfile({...profile,[key]:value});setSaved(false)}
  return <main className="wrap page"><div className="page-title"><div><span className="eyebrow">ACCOUNT</span><h1>Profile settings</h1><p>Manage how you show up on CraftConnect. Changes are stored locally.</p></div></div><div className="settings-layout"><aside>{['Public profile','Account','Notifications','Payments'].map((x,i)=><button className={i===0?'active':''} key={x} onClick={()=>setSaved(false)}>{x}</button>)}</aside><form className="form-card" onSubmit={e=>{e.preventDefault();setSaved(true)}}><div className="profile-photo"><div className="avatar md coral">{profile.first[0]}{profile.last[0]}</div><div><b>Profile photo</b><small>Photo upload is a visual placeholder in this prototype.</small></div></div><div className="two-col"><Field label="First name" value={profile.first} onChange={v=>update('first',v)} /><Field label="Last name" value={profile.last} onChange={v=>update('last',v)} /></div><Field label="Headline" value={profile.headline} onChange={v=>update('headline',v)} /><Field label="Bio" area value={profile.bio} onChange={v=>update('bio',v)} /><Field label="Location" value={profile.location} onChange={v=>update('location',v)} /><Field label="Email address" type="email" value={profile.email} onChange={v=>update('email',v)} /><div className="form-actions">{saved&&<Badge tone="mint">CHANGES SAVED</Badge>}<Button type="submit">Save changes</Button></div></form></div></main>
}

function Policy() {
  return <main className="wrap page policy"><div className="policy-hero"><Badge tone="yellow">OUR PROMISE</Badge><h1>Made by humans.<br />Honest by default.</h1><p>CraftConnect exists to celebrate human skill, judgment, and creative partnership.</p></div><div className="policy-body"><aside><b>On this page</b><a href="#meaning">What human-made means</a><a href="#ai">AI transparency</a><a href="#report">Reporting concerns</a></aside><article><section id="meaning"><span>01</span><div><h2>What “human-made” means</h2><p>The creator you hire is the person directing and producing the work. Tools can support the process, but the craft, decisions, and accountability remain human.</p></div></section><section id="ai"><span>02</span><div><h2>AI use must be disclosed</h2><p>Creators must clearly disclose generative AI use before a client commits. Clients can require fully human-produced work in any brief.</p></div></section><section id="report"><span>03</span><div><h2>Trust goes both ways</h2><p>If work does not match its description, pause the project and report it. We review concerns with context and care—never by automation alone.</p></div></section></article></div></main>
}

function Auth({ mode, go }: { mode:'login'|'signup'; go:(p:Page)=>void }) {
  const [role,setRole]=useState('client')
  return <main className="auth-page"><div className="auth-art"><button className="brand" onClick={()=>go('home')}><span className="brand-mark">C</span>CraftConnect</button><div><Badge tone="yellow">REAL PEOPLE. REAL SKILLS.</Badge><h1>{mode==='login'?'Welcome back, maker.':'Find your people. Make great things.'}</h1><p>No bots pretending to care. Just talented people doing work they’re proud of.</p></div></div><div className="auth-form"><button className="back" onClick={()=>go('home')}>← Back home</button><form onSubmit={e=>{e.preventDefault();go('dashboard')}}><h2>{mode==='login'?'Log in to CraftConnect':'Create your account'}</h2><p>{mode==='login'?'Pick up where you left off.':'Start as a client or creator—you can switch anytime.'}</p>{mode==='signup'&&<div className="role-cards"><button type="button" className={role==='client'?'active':''} onClick={()=>setRole('client')}><b>I’m hiring</b><span>Find people for my project</span></button><button type="button" className={role==='creator'?'active':''} onClick={()=>setRole('creator')}><b>I’m creating</b><span>Offer my skills and services</span></button></div>}<Field label="Email address" type="email" placeholder="you@example.com" /><Field label="Password" type="password" placeholder="At least 8 characters" /><Button type="submit">{mode==='login'?'Log in →':'Create account →'}</Button><small>Prototype only—no account will be created.</small><p className="auth-switch">{mode==='login'?"New here? ":"Already a member? "}<button type="button" onClick={()=>go(mode==='login'?'signup':'login')}>{mode==='login'?'Create an account':'Log in'}</button></p></form></div></main>
}

function Empty({title,text,action,onClick}:{title:string;text:string;action:string;onClick:()=>void}) {
  return <div className="empty"><div>?</div><h2>{title}</h2><p>{text}</p><Button onClick={onClick}>{action}</Button></div>
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedCreator, setSelectedCreator] = useState(creators[0])
  const [selectedJob, setSelectedJob] = useState<Job>(sampleJobs[0])
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [jobListings, setJobListings] = usePersistentState<Job[]>('craftconnect-jobs', sampleJobs)
  const [commissionRequests, setCommissionRequests] = usePersistentState<CommissionRequest[]>('craftconnect-commissions', [])
  const [proposals, setProposals] = usePersistentState<Proposal[]>('craftconnect-proposals', [])
  const [savedCreators, setSavedCreators] = usePersistentState<string[]>('craftconnect-saved-creators', [])
  const [savedJobs, setSavedJobs] = usePersistentState<string[]>('craftconnect-saved-jobs', [])
  const createJob = (job: Job) => setJobListings([job, ...jobListings])
  const createCommission = (request: CommissionRequest) => { setCommissionRequests([request, ...commissionRequests]); setSelectedRequestId(request.id) }
  const updateRequest = (id: string, status: CommissionRequest['status']) => setCommissionRequests(commissionRequests.map(r => r.id === id ? {...r,status} : r))
  const createProposal = (proposal: Proposal) => setProposals([proposal, ...proposals])
  const updateProposal = (id: string, status: Proposal['status']) => setProposals(proposals.map(p => p.id === id ? {...p,status} : p))
  const selectRequest = (request: CommissionRequest) => setSelectedRequestId(request.id)
  const selectedRequest = commissionRequests.find(r => r.id === selectedRequestId) || commissionRequests[0]
  const selectJob = (job: Job) => setSelectedJob(job)
  const go = (p: Page) => { setPage(p); window.scrollTo({top:0,behavior:'smooth'}) }
  const openCreator = (creator: typeof creators[0]) => { setSelectedCreator(creator); go('creator') }
  const toggleSavedCreator = (name: string) => setSavedCreators(savedCreators.includes(name) ? savedCreators.filter(n => n !== name) : [...savedCreators,name])
  const content: Record<Page, ReactNode> = {
    home:<Home go={go} openCreator={openCreator}/>, explore:<Explore openCreator={openCreator}/>, creator:<CreatorProfile go={go} creator={selectedCreator} isSaved={savedCreators.includes(selectedCreator.name)} onToggleSave={()=>toggleSavedCreator(selectedCreator.name)}/>, commission:<Commission go={go} creator={selectedCreator} onCreateRequest={createCommission}/>, project:<Project go={go} request={selectedRequest} onUpdateRequest={updateRequest}/>,
    dashboard:<Dashboard go={go} requests={commissionRequests} onOpenRequest={selectRequest}/>, jobs:<Jobs go={go} jobs={jobListings} onSelectJob={selectJob}/>, job:<JobDetail go={go} job={selectedJob} proposals={proposals} onSubmitProposal={createProposal} isSaved={savedJobs.includes(selectedJob.title)} onToggleSave={()=>setSavedJobs(savedJobs.includes(selectedJob.title)?savedJobs.filter(t=>t!==selectedJob.title):[...savedJobs,selectedJob.title])}/>, 'post-job':<PostJob go={go} onCreateJob={createJob}/>, studio:<Studio/>, messages:<Messages/>, proposals:<ProposalList proposals={proposals} go={go} onUpdate={updateProposal}/>,
    notifications:<Notifications go={go}/>, reviews:<Reviews/>, settings:<Settings/>, policy:<Policy/>, login:<Auth mode="login" go={go}/>, signup:<Auth mode="signup" go={go}/>
  }
  const auth = page === 'login' || page === 'signup'
  return <div className="app">{!auth && <Header page={page} go={go}/>} {content[page]} {!auth && <footer><div className="wrap footer-grid"><div><button className="brand" onClick={()=>go('home')}><span className="brand-mark">C</span>CraftConnect</button><p>Real People. Real Skills. Real Creations.</p><p>{savedCreators.length} saved creator(s) · {savedJobs.length} saved job(s)</p></div><div><b>Explore</b><button onClick={()=>go('explore')}>Find creators</button><button onClick={()=>go('jobs')}>Job board</button><button onClick={()=>go('proposals')}>My proposals</button></div><div><b>Community</b><button onClick={()=>go('policy')}>Human-Made Policy</button><button onClick={()=>go('signup')}>Become a creator</button><button onClick={()=>go('studio')}>Creator studio</button></div><small>© 2026 CraftConnect<br/>Frontend prototype · Local demo data</small></div></footer>}</div>
}

export default App
