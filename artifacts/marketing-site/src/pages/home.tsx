import React, { useEffect, useState, useRef } from "react";
import { WaitlistForm } from "@/components/waitlist-form";
import { trackEvent } from "@/lib/analytics";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { name: "How it Works", href: "#how-it-works" },
  { name: "For Startups", href: "#for-startups" },
  { name: "Future Features", href: "#future-features" },
];

function useCounter(end: number, duration: number = 2000, startAnimating: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimating) return;
    
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeOutExpo * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startAnimating]);

  return count;
}

function AnimatedSection({ children, className = "", delay = 0, style = {} }: { children: React.ReactNode, className?: string, delay?: number, style?: React.CSSProperties }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // For counter trigger
  const [countersVisible, setCountersVisible] = useState(false);
  const countersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountersVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string, eventName?: string) => {
    if (eventName) trackEvent(eventName);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const foundersCount = useCounter(2400, 2000, countersVisible);
  const categoriesCount = useCounter(17, 1500, countersVisible);
  const citiesCount = useCounter(12, 1500, countersVisible);

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary bg-background">
      
      {/* 1. Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
          isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-3 shadow-sm text-foreground" : "bg-transparent py-5 text-white"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            orignhub
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href.substring(1)); }}
                className={`text-sm font-medium transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"}`}
              >
                {link.name}
              </a>
            ))}
            <Button
              onClick={() => scrollTo("waitlist", "nav_waitlist_clicked")}
              className={`rounded-full shadow-sm hover:shadow-md transition-all ${!isScrolled && "bg-white text-black hover:bg-white/90"}`}
            >
              Join Waitlist
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background text-foreground border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href.substring(1)); }}
                className="text-base font-medium py-2 border-b border-border/50"
              >
                {link.name}
              </a>
            ))}
            <Button
              onClick={() => scrollTo("waitlist", "nav_waitlist_clicked")}
              className="w-full mt-2"
            >
              Join Waitlist
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 1. Dark Hero Section */}
        <section className="pt-32 pb-24 md:pt-48 md:pb-36 px-4 relative overflow-hidden bg-[#0a0a0a]">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection className="max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-8 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Accepting Early Access
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
                  Find startup services and collaborators <span className="text-primary relative whitespace-nowrap">faster.</span>
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-xl">
                  Stop asking for intros. List what you need, find who can help, and actually get moving.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
                    onClick={() => scrollTo("waitlist", "hero_cta_clicked")}
                  >
                    Join the Waitlist
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg rounded-full text-white border-white/20 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm"
                    onClick={() => scrollTo("how-it-works")}
                  >
                    See How It Works
                  </Button>
                </div>
              </AnimatedSection>

              {/* Redesigned Visual Element Mockup */}
              <AnimatedSection delay={200} className="relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl bg-[#111] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 flex flex-col gap-4 overflow-hidden hidden md:flex">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/20">N</div>
                    <div>
                      <div className="font-semibold text-white text-base">Nexus Analytics</div>
                      <div className="text-sm text-zinc-400">Looking for: Design</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm hover:bg-primary/10">Matched</Badge>
                </div>
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg border border-orange-500/20">V</div>
                    <div>
                      <div className="font-semibold text-white text-base">Vanguard Design</div>
                      <div className="text-sm text-zinc-400 flex gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs">UI/UX</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs">Branding</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="h-9 px-4 bg-white text-black hover:bg-zinc-200">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/20">S</div>
                    <div>
                      <div className="font-semibold text-white text-base">Stack Growth</div>
                      <div className="text-sm text-zinc-400 flex gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs">SEO</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs">Ads</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="h-9 px-4 bg-white text-black hover:bg-zinc-200">Connect</Button>
                </div>
                
                <div className="mt-auto absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#111] to-transparent pointer-events-none"></div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 2. Social Proof Counter Strip */}
        <section ref={countersRef} className="py-8 bg-[#0a0a0a] border-y border-white/5">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-24 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">{foundersCount}{foundersCount === 2400 ? '+' : ''}</div>
                <div className="text-sm md:text-base text-zinc-400 font-medium">founders on waitlist</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">{categoriesCount}</div>
                <div className="text-sm md:text-base text-zinc-400 font-medium">service categories</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">{citiesCount}</div>
                <div className="text-sm md:text-base text-zinc-400 font-medium">cities represented</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Problem Section - Split Layout */}
        <section className="py-24 bg-background border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Stop relying on whose brother knows whom.</h2>
              <p className="text-lg text-muted-foreground">
                Founders rely on referrals, WhatsApp groups, LinkedIn posts, and events to find services, collaborators, mentors, and opportunities. Useful startups are hard to discover, and early teams lose time searching instead of building.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <AnimatedSection delay={100} className="bg-red-50/50 dark:bg-red-950/10 p-8 md:p-10 rounded-3xl border border-red-100 dark:border-red-900/30">
                <h3 className="text-xl font-semibold mb-8 text-red-900 dark:text-red-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  The old way
                </h3>
                <ul className="space-y-6">
                  {[
                    "Ask on Twitter/LinkedIn, get ghosted",
                    "WhatsApp groups where the same 10 people help",
                    "Referrals from referrals, no accountability",
                    "Miss opportunities because you didn't know who to ask"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-muted-foreground line-through decoration-red-200 dark:decoration-red-900/50 opacity-80">
                      <div className="mt-1 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full p-1 shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>

              <AnimatedSection delay={200} className="bg-primary/5 p-8 md:p-10 rounded-3xl border border-primary/20 shadow-sm">
                <h3 className="text-xl font-semibold mb-8 text-primary flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  With orignhub
                </h3>
                <ul className="space-y-6">
                  {[
                    "Browse verified startup profiles by category",
                    "Direct intros based on what you actually need",
                    "Transparent service listings with clear offerings",
                    "Discover opportunities you didn't know existed"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-foreground font-medium">
                      <div className="mt-1 bg-primary text-primary-foreground rounded-full p-1 shrink-0 shadow-sm">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 4. Solution */}
        <section className="py-24 px-4 bg-muted/20">
          <div className="container mx-auto max-w-6xl text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">One place. Every startup need.</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
                Profile → services → needs → matches. No back-and-forth, no cold outreach, no wasted time.
              </p>

              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {[
                  "Create Profile", "List Services", "Post Needs", "Discover", "Connect"
                ].map((action, i) => (
                  <div key={i} className="flex items-center gap-3 bg-card border border-border px-6 py-4 rounded-full shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="font-medium">{action}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Founder Testimonials */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Early founders are already on board.</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  quote: "We've been looking for a place to reach other startups without cold emailing random LinkedIn profiles. orignhub is exactly that gap.", 
                  name: "Priya Menon", 
                  role: "Founder @ Growthstack", 
                  city: "Bangalore",
                  color: "bg-purple-100 text-purple-700",
                  initial: "P"
                },
                { 
                  quote: "We're a D2C startup and we need tech, branding, and logistics help constantly. Having one place to find all of that from people who actually get startups is a game changer.", 
                  name: "Arjun Khanna", 
                  role: "Co-founder @ Packright", 
                  city: "Mumbai",
                  color: "bg-blue-100 text-blue-700",
                  initial: "A"
                },
                { 
                  quote: "As a marketing agency focused on startups, we struggle to get discovered outside our existing network. Can't wait for this.", 
                  name: "Sneha Rao", 
                  role: "CEO @ Fuelbase", 
                  city: "Delhi",
                  color: "bg-orange-100 text-orange-700",
                  initial: "S"
                }
              ].map((t, i) => (
                <AnimatedSection key={i} delay={i * 100} className="bg-background p-8 rounded-2xl border border-border shadow-sm flex flex-col">
                  <div className="mb-6 text-muted-foreground flex-1">"{t.quote}"</div>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center font-bold text-lg`}>
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                      <div className="text-xs text-muted-foreground mt-1 bg-muted inline-block px-2 py-0.5 rounded-full">{t.city}</div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* 5. How It Works */}
        <section id="how-it-works" className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16 text-center">How it works</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
              {/* Vertical line connecting steps on desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
              
              {[
                { step: 1, title: "Create your startup profile", desc: "Set up your company details, stage, and mission in minutes." },
                { step: 2, title: "List what you offer and need", desc: "Add tags for the services you sell and the help you're currently seeking." },
                { step: 3, title: "Discover relevant startups", desc: "Browse a curated directory of vetted founders and service providers." },
                { step: 4, title: "Connect and collaborate", desc: "Reach out directly through the platform to start working together." }
              ].map((item, i) => (
                <AnimatedSection 
                  key={i} 
                  delay={i * 150}
                  className={`relative flex flex-col ${i % 2 === 0 ? 'md:items-end md:text-right md:pr-12' : 'md:items-start md:pl-12 md:translate-y-24'}`}
                >
                  {/* Circle marker on the line */}
                  <div className={`hidden md:flex absolute top-6 w-10 h-10 rounded-full bg-background border-4 border-card items-center justify-center shadow-sm z-10 ${i % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}>
                    <div className="w-3 h-3 bg-primary rounded-full m-auto"></div>
                  </div>
                  
                  <div className="bg-card p-8 rounded-2xl border border-border shadow-sm w-full max-w-md relative z-0 hover:border-primary/30 transition-colors">
                    <div className="text-sm font-bold text-primary mb-3">Step {item.step}</div>
                    <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Audience */}
        <section id="for-startups" className="py-24 px-4 pt-48 bg-muted/20 border-t border-border">
          <div className="container mx-auto max-w-6xl">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16 text-center">Built for the whole ecosystem</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "For startups offering services", desc: "Get discovered by other startups looking for marketing, tech, logistics, analytics, AI, and more.", bg: "bg-primary/5 border-primary/10" },
                { title: "For startups looking for help", desc: "Find trusted service providers who understand startup culture and constraints.", bg: "bg-secondary border-border" },
                { title: "For mentors", desc: "Connect with early-stage founders who need your experience and guidance.", bg: "bg-card border-border shadow-sm" },
                { title: "For investors", desc: "Discover ambitious startups long before they raise a public round.", bg: "bg-card border-border shadow-sm" }
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 100} className={`${item.bg} p-8 rounded-2xl border`}>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Service Categories - Updated */}
        <section className="py-24 bg-background border-y border-border overflow-hidden">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold mb-12">Where startups go to get things done</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { tag: "Marketing", icon: "📣" },
                  { tag: "Technology", icon: "⚙️" },
                  { tag: "Logistics", icon: "🚚" },
                  { tag: "Analytics", icon: "📊" },
                  { tag: "FMCG", icon: "🛒" },
                  { tag: "AI", icon: "🤖" },
                  { tag: "Legal", icon: "⚖️" },
                  { tag: "Finance", icon: "💰" },
                  { tag: "Branding", icon: "🎨" },
                  { tag: "Sales", icon: "📈" },
                  { tag: "Design", icon: "🖌️" },
                  { tag: "Operations", icon: "🏭" },
                ].map((item) => (
                  <Badge key={item.tag} variant="outline" className="px-5 py-3 text-base font-medium bg-card hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all cursor-pointer shadow-sm">
                    <span className="mr-2 text-lg">{item.icon}</span> {item.tag}
                  </Badge>
                ))}
                <Badge variant="secondary" className="px-5 py-3 text-base font-medium bg-transparent border border-dashed border-border text-muted-foreground hover:bg-transparent">
                  and 5 more at launch
                </Badge>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* 8. Future Vision - Updated Copy */}
        <section id="future-features" className="py-24 px-4 bg-muted/20">
          <div className="container mx-auto max-w-4xl text-center">
            <AnimatedSection>
              <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                Roadmap
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Starting with services. Expanding into startup growth.</h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
                We're starting with services because that's where founders bleed money and time. Mentorship, verification, government schemes, and investor discovery come next.
              </p>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Mentorship</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Government schemes</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Company registration</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Startup verification</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Investor discovery</span>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* 9. Premium form section */}
        <section id="waitlist" className="py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <AnimatedSection className="text-left text-white order-2 lg:order-1">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">Get in before we open the doors.</h2>
                <p className="text-xl text-zinc-400 mb-10">
                  Tell us what you offer and what you need. Early members shape the platform.
                </p>
                
                <ul className="space-y-6 mb-10">
                  {[
                    "Be first to list your startup services",
                    "Unlock founding member benefits at launch",
                    "Shape the platform with your feedback",
                    "Early access to mentors and investors (Phase 2)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-zinc-300 font-medium">
                      <div className="mt-1 bg-primary/20 text-primary rounded-full p-1 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Accepting Early Access
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={200} className="order-1 lg:order-2">
                <WaitlistForm />
              </AnimatedSection>

            </div>
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tight mb-12 text-center" onClick={() => trackEvent("faq_opened")}>Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium text-lg">Is this only for startups?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    While the platform is built primarily for startup-to-startup collaboration, business users looking specifically for innovative startup services are also welcome to join as buyers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium text-lg">Can I join if I want to offer services?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    Yes. If your startup provides B2B services (marketing, development, legal, etc.) geared towards other startups, this is the perfect place to get discovered.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium text-lg">Can I join if I am looking for services?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    Absolutely. You can create a profile listing your needs, and the platform will help match you with vetted providers who understand startup constraints.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-medium text-lg">Will investors be part of the platform?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    Yes, investors can join to discover early-stage startups and follow their progress before they publicly announce funding rounds.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left font-medium text-lg">Is the platform live yet?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    We are currently in private beta and actively building the first public version. Joining the waitlist ensures you get notified as soon as we open up more spots.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left font-medium text-lg">Is there a cost to join the waitlist?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    No, joining the waitlist is completely free. Early access members will receive special founding member benefits when we launch.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* 11. Footer */}
      <footer className="py-12 bg-card border-t border-border text-center md:text-left">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-bold text-xl mb-2 text-foreground">orignhub</div>
            <p className="text-muted-foreground text-sm">The startup-first services marketplace.</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="mailto:hello@orignhub.com" className="text-muted-foreground hover:text-foreground transition-colors">hello@orignhub.com</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Note</a>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
