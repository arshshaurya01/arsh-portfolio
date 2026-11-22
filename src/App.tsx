import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import {
  motion, useMotionValue, useScroll, useSpring, useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowDown, ArrowUpRight, Phone } from 'lucide-react'

const portrait = '/arsh-profile.png'
const decorations = [
  { src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png', className: 'decor moon', x: -80, delay: .1, alt: '3D moon' },
  { src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png', className: 'decor object-left', x: -80, delay: .25, alt: 'Abstract 3D object' },
  { src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png', className: 'decor lego', x: 80, delay: .15, alt: '3D building block' },
  { src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png', className: 'decor object-right', x: 80, delay: .3, alt: 'Abstract 3D sculpture' },
]
const services = [['Website Development', 'Building websites and practical web experiences. Project experience includes JavaScript, HTML/CSS, Node.js, and live dashboard interfaces.']]
const projects = [{ name: 'Smart Umbrella — Campus Sharing System', type: 'Personal · Working prototype' }]

function FadeIn({ children, delay = 0, duration = .7, x = 0, y = 30, className = '' }: {
  children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; className?: string
}) {
  return <motion.div className={className} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: '50px', amount: 0 }} transition={{ delay, duration, ease: [.25, .1, .25, 1] }}>{children}</motion.div>
}

function ContactButton({ className = '' }: { className?: string }) {
  return <a className={`contact-button ${className}`} href="mailto:arshshaurya00@gmail.com">Contact Me <ArrowUpRight size={18} strokeWidth={2.4} /></a>
}

function Magnet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0); const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 160, damping: 22 }); const y = useSpring(my, { stiffness: 160, damping: 22 })
  const [active, setActive] = useState(false)
  const move = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect(); const dx = event.clientX - (rect.left + rect.width / 2); const dy = event.clientY - (rect.top + rect.height / 2)
    if (Math.abs(dx) < rect.width / 2 + 150 && Math.abs(dy) < rect.height / 2 + 150) { mx.set(dx / 3); my.set(dy / 3); setActive(true) }
    else reset()
  }
  const reset = () => { mx.set(0); my.set(0); setActive(false) }
  return <motion.div ref={ref} className={`magnet ${active ? 'magnet-active' : ''}`} style={{ x, y }} onMouseMove={move} onMouseLeave={reset}>{children}</motion.div>
}

function Hero() {
  return <section id="top" className="hero">
    <nav className="navbar" aria-label="Main navigation">
      <FadeIn delay={0} y={-20} className="nav-links"><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Projects</a><a href="#contact">Contact</a></FadeIn>
    </nav>
    <div className="hero-title-clip"><FadeIn delay={.15} y={40}><h1 className="hero-heading">Hi, i&apos;m Arsh</h1></FadeIn></div>
    <Magnet><FadeIn delay={.6} y={30} className="portrait-wrap"><img className="hero-portrait" src={portrait} alt="Arsh, web developer" /></FadeIn></Magnet>
    <div className="hero-bottom"><FadeIn delay={.35} y={20}><p className="hero-tagline">an experienced web developer creating useful digital experiences</p></FadeIn><FadeIn delay={.5} y={20}><ContactButton /></FadeIn></div>
    <a href="#gallery" className="scroll-cue" aria-label="Scroll to selected work"><ArrowDown size={17} /></a>
  </section>
}

function MarqueeRow({ images, progress, reverse = false }: { images: string[]; progress: MotionValue<number>; reverse?: boolean }) {
  const x = useTransform(progress, [0, 1], reverse ? ['-20%', '0%'] : ['0%', '-20%'])
  return <motion.div className="marquee-track" style={{ x }}>
    {[...images, ...images, ...images].map((label, index) => <div className="marquee-chip" key={`${label}-${index}`}><span>SHAURYAARSH / WEB DEVELOPER</span><strong>{label}</strong></div>)}
  </motion.div>
}

function Marquee() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1])
  return <section className="marquee-section" id="gallery" ref={ref} aria-label="Selected visual work">
    <div className="marquee-row"><MarqueeRow images={['WEBSITES','WEB DEVELOPMENT','INTERFACES','CAMPUS IOT']} progress={progress} /></div>
    <div className="marquee-row"><MarqueeRow images={['JAVASCRIPT','NODE.JS','HTML / CSS','ESP32 + RFID']} progress={progress} reverse /></div>
  </section>
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const words = text.split(' ')
  let charOffset = 0
  return <p className="animated-copy" ref={ref} aria-label={text}>{words.map((word, wordIndex) => {
    const start = charOffset; charOffset += word.length + 1
    return <span className="word" key={`${word}-${wordIndex}`}>{word.split('').map((char, charIndex) => {
      const index = start + charIndex
      return <RevealChar key={`${index}-${char}`} progress={scrollYProgress} index={index} total={text.length}>{char}</RevealChar>
    })}{wordIndex < words.length - 1 && <span> </span>}</span>
  })}</p>
}

function RevealChar({ progress, index, total, children }: { progress: MotionValue<number>; index: number; total: number; children: string }) {
  const start = index / total; const end = start + 1 / total
  const opacity = useTransform(progress, [start, end], [.2, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

function About() {
  const copy = "I’m Arsh, an experienced web developer who builds websites and useful digital experiences. I enjoy bringing ideas to life through clear interfaces and practical technology. My Smart Umbrella project combines a student portal and operator dashboard with ESP32 stations, RFID access, rain detection, and transaction tracking."
  return <section id="about" className="about-section">
    {decorations.map((item) => <FadeIn key={item.alt} delay={item.delay} duration={.9} x={item.x} className={item.className}><img src={item.src} loading="lazy" alt={item.alt} /></FadeIn>)}
    <div className="about-content"><FadeIn><h2 className="hero-heading section-heading">About me</h2></FadeIn><FadeIn delay={.1} className="about-copy-wrap"><AnimatedText text={copy} /></FadeIn><FadeIn delay={.25}><ContactButton /></FadeIn></div>
  </section>
}

function Services() {
  return <section id="services" className="services-section"><FadeIn><h2 className="section-heading services-heading">Services</h2></FadeIn><div className="service-list">{services.map(([name, description], index) => <FadeIn key={name} delay={index * .1} className="service-item"><span className="service-number">{String(index + 1).padStart(2, '0')}</span><div className="service-copy"><h3>{name}</h3><p>{description}</p></div></FadeIn>)}</div></section>
}

function ProjectCard({ project, index, progress, total }: { project: typeof projects[number]; index: number; progress: MotionValue<number>; total: number }) {
  const targetScale = 1 - (total - 1 - index) * .03
  const scale = useTransform(progress, [0, 1], [1, targetScale])
  return <div className="project-card-shell" style={{ top: `calc(7.5rem + ${index * 28}px)` }}><motion.article className="project-card" style={{ scale }}>
    <div className="project-top"><span className="project-num">{String(index + 1).padStart(2, '0')}</span><div className="project-title"><span>{project.type}</span><h3>{project.name}</h3></div><span className="live-button prototype-label">Working prototype</span></div>
    <div className="project-details">
      <div className="project-description"><span className="project-kicker">CAMPUS IOT · SHARING SYSTEM</span><p>A campus umbrella borrowing and return prototype built around two ESP32 stations. Students can borrow at one station and return at another — “Take Anywhere, Return Anywhere.”</p><div className="project-tags"><span>ESP32</span><span>RFID</span><span>Node.js</span><span>JavaScript</span><span>HTML / CSS</span></div><p className="project-note">Station A includes rain detection. The physical umbrella lock is a planned enhancement.</p></div>
      <div className="dashboard-preview" aria-label="Illustrative preview of the Smart Umbrella dashboard"><div className="dash-top"><span>SMART UMBRELLA</span><span className="dash-live"><i /> SYSTEM ONLINE</span></div><div className="dash-sub">CAMPUS STATIONS <span>LIVE OVERVIEW</span></div><div className="station-grid"><div className="station-card"><span>STATION A</span><b>RAIN SENSOR</b><em>ACTIVE</em></div><div className="station-card"><span>STATION B</span><b>RETURN POINT</b><em>ONLINE</em></div></div><div className="dash-sub transaction-title">RECENT TRANSACTIONS <span>VIEW ALL ↗</span></div><div className="transaction"><span className="transaction-icon">↗</span><span>Umbrella borrowed</span><small>STATION A</small><b>ACTIVE</b></div><div className="transaction"><span className="transaction-icon return">↙</span><span>Umbrella returned</span><small>STATION B</small><b>COMPLETE</b></div><div className="dash-bottom"><span>TAKE ANYWHERE</span><span>RETURN ANYWHERE ↗</span></div></div>
    </div>
  </motion.article></div>
}

function Projects() {
  return <section id="projects" className="projects-section"><FadeIn><h2 className="section-heading project-heading hero-heading">Projects</h2></FadeIn><div className="project-stack-list">{projects.map((project, index) => <ProjectProgressCard key={project.name} project={project} index={index} total={projects.length} />)}</div></section>
}

function ProjectProgressCard({ project, index, total }: { project: typeof projects[number]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return <div ref={ref} className="project-card-container"><ProjectCard project={project} index={index} total={total} progress={scrollYProgress} /></div>
}

function App() {
  return <main className="page"><Hero /><Marquee /><About /><Services /><Projects /><footer id="contact" className="footer"><span>ARSH <i>®</i> WEB DEVELOPER</span><a href="https://www.linkedin.com/in/arsh-raj-b6a628315" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={16}/></a><a href="tel:9229539352"><Phone size={15}/> 9229539352</a><a href="mailto:arshshaurya00@gmail.com">LET&apos;S TALK <ArrowUpRight size={16}/></a></footer></main>
}

export default App
