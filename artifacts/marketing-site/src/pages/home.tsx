import React, { useEffect, useState } from "react";
import { WaitlistForm } from "@/components/waitlist-form";
import { trackEvent } from "@/lib/analytics";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "lucide-react";

const navLinks = [
  { name: "How it Works", href: "#how-it-works" },
  { name: "For Startups", href: "#for-startups" },
  { name: "Future Features", href: "#future-features" },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string, eventName?: string) => {
    if (eventName) trackEvent(eventName);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* 1. Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button
              onClick={() => scrollTo("waitlist", "nav_waitlist_clicked")}
              className="rounded-full shadow-sm hover:shadow-md transition-all"
            >
              Join Waitlist
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
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
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href.substring(1)); }}
                className="text-base font-medium text-foreground py-2 border-b border-border/50"
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
        {/* 2. Hero */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden">
          {/* Subtle abstract background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Accepting Early Access
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground">
                  Find startup services and collaborators <span className="text-primary relative whitespace-nowrap">faster.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                  A startup-first marketplace where founders can list what they offer, discover the help they need, and connect with other startups to grow faster.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                    onClick={() => scrollTo("waitlist", "hero_cta_clicked")}
                  >
                    Join the Waitlist
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg rounded-full"
                    onClick={() => scrollTo("how-it-works")}
                  >
                    See How It Works
                  </Button>
                </div>
              </div>

              {/* Visual Element */}
              <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl bg-card border border-border shadow-2xl p-6 flex flex-col gap-4 overflow-hidden hidden md:flex">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">N</div>
                    <div>
                      <div className="font-semibold text-sm">Nexus Analytics</div>
                      <div className="text-xs text-muted-foreground">Looking for: Design</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Matched</Badge>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">V</div>
                    <div>
                      <div className="font-semibold text-sm">Vanguard Design</div>
                      <div className="text-xs text-muted-foreground">Offering: UI/UX</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8">Connect</Button>
                </div>
                
                {/* Abstract grid */}
                <div className="mt-auto grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
                      <div className={`w-8 h-2 rounded-full ${i % 2 === 0 ? 'bg-primary/20' : 'bg-muted-foreground/20'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Problem */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Startup growth still depends too much on scattered networks.</h2>
              <p className="text-lg text-muted-foreground">
                Founders rely on referrals, WhatsApp groups, LinkedIn posts, and events to find services, collaborators, mentors, and opportunities. Useful startups are hard to discover, and early teams lose time searching instead of building.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "No central directory", desc: "Finding vetted services meant for startup budgets and culture is a guessing game." },
                { title: "Wasted time", desc: "Hours spent asking for intros on LinkedIn and slack communities instead of executing." },
                { title: "Missed collaborations", desc: "The perfect synergy might be a startup in the same city, but you never cross paths." }
              ].map((item, i) => (
                <div key={i} className="bg-background p-8 rounded-2xl border border-border shadow-sm">
                  <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Solution */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">A focused marketplace for startup-to-startup growth.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
              Create a profile, list your services, add what you need, and get matched with startups that can help.
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
          </div>
        </section>

        {/* 5. How It Works */}
        <section id="how-it-works" className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16 text-center">How it works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
              {/* Vertical line connecting steps on desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
              
              {[
                { step: 1, title: "Create your startup profile", desc: "Set up your company details, stage, and mission in minutes." },
                { step: 2, title: "List what you offer and need", desc: "Add tags for the services you sell and the help you're currently seeking." },
                { step: 3, title: "Discover relevant startups", desc: "Browse a curated directory of vetted founders and service providers." },
                { step: 4, title: "Connect and collaborate", desc: "Reach out directly through the platform to start working together." }
              ].map((item, i) => (
                <div key={i} className={`relative flex flex-col ${i % 2 === 0 ? 'md:items-end md:text-right md:pr-12' : 'md:items-start md:pl-12 md:translate-y-24'}`}>
                  {/* Circle marker on the line */}
                  <div className={`hidden md:flex absolute top-6 w-10 h-10 rounded-full bg-background border-4 border-card flex-items-center justify-center shadow-sm z-10 ${i % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}>
                    <div className="w-3 h-3 bg-primary rounded-full m-auto"></div>
                  </div>
                  
                  <div className="bg-background p-8 rounded-2xl border border-border shadow-sm w-full max-w-md relative z-0 hover:border-primary/30 transition-colors">
                    <div className="text-sm font-bold text-primary mb-3">Step {item.step}</div>
                    <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Audience */}
        <section id="for-startups" className="py-24 px-4 pt-48">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16 text-center">Built for the whole ecosystem</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                <h3 className="text-xl font-bold mb-3">For startups offering services</h3>
                <p className="text-muted-foreground">Get discovered by other startups looking for marketing, tech, logistics, analytics, AI, and more.</p>
              </div>
              <div className="bg-secondary p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-bold mb-3">For startups looking for help</h3>
                <p className="text-muted-foreground">Find trusted service providers who understand startup culture and constraints.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                <h3 className="text-xl font-bold mb-3">For mentors</h3>
                <p className="text-muted-foreground">Connect with early-stage founders who need your experience and guidance.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                <h3 className="text-xl font-bold mb-3">For investors</h3>
                <p className="text-muted-foreground">Discover ambitious startups long before they raise a public round.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Service Categories */}
        <section className="py-24 bg-muted/30 border-y border-border overflow-hidden">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-2xl font-bold mb-10 text-muted-foreground">Popular Service Categories</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {["Marketing", "Technology", "Logistics", "Analytics", "FMCG", "AI", "Legal", "Finance", "Branding", "Sales", "Design", "Operations"].map((tag) => (
                <Badge key={tag} variant="outline" className="px-4 py-2 text-base font-medium bg-background hover:bg-muted transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Future Vision */}
        <section id="future-features" className="py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              Roadmap
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Starting with services. Expanding into startup growth.</h2>
            <p className="text-lg text-muted-foreground mb-12">
              orignhub is starting as a services marketplace, but our vision is a complete growth ecosystem for founders.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Mentorship</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Government schemes</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Company registration</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Startup verification</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border"></div> Investor discovery</span>
            </div>
          </div>
        </section>

        {/* 9. Lead Capture Form */}
        <section id="waitlist" className="py-24 px-4 bg-muted/50 border-y border-border">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12" onClick={() => trackEvent("lead_form_started")}>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Join the early access list.</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tell us what you offer, what you need, and how you would use a startup services marketplace. Space is limited for our first cohort.
              </p>
            </div>
            
            <WaitlistForm />
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto max-w-3xl">
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
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
