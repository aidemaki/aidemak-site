import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mic,
  Zap,
  ArrowRight,
  Users,
  BarChart3,
} from "lucide-react";

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polygon points="5,0 65,40 5,80" fill="currentColor" />
      <polygon points="50,10 110,40 50,70" fill="currentColor" />
    </svg>
  );
}

/* ─── Scroll-driven progress hook ─── */
function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    // 0 = element top hits viewport bottom, 1 = element bottom hits viewport top
    const total = rect.height + windowH;
    const scrolled = windowH - rect.top;
    setProgress(Math.max(0, Math.min(1, scrolled / total)));
  }, [ref]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return progress;
}

/* ─── Services data ─── */
const services = [
  {
    icon: <Mic className="w-8 h-8" />,
    title: "Studio-Quality\nAI Dubbing",
    description:
      "YouTube's built-in dubbing sounds robotic. Ours doesn't. We deliver natural, expressive voice dubbing that your audience won't believe is AI-generated.",
    accent: "#18181b",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Fully Managed\nService",
    description:
      "We handle everything — translation, voice synthesis, quality review, and delivery. You keep creating content. We make it multilingual.",
    accent: "#18181b",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Strategic Language\nSelection",
    description:
      "We analyze your content and audience data to pick the languages that will maximize your revenue per video. No guesswork, just results.",
    accent: "#18181b",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Grow Your\nGlobal Subscribers",
    description:
      "Reach millions of viewers who don't speak your language. Turn every video into a subscriber magnet across new markets.",
    accent: "#18181b",
  },
];

/* ─── Animated service section (Apple-style sticky scroll) ─── */
function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);

  const totalItems = services.length;
  // Each service gets an equal slice of the progress
  const getItemProgress = (index: number) => {
    const sliceSize = 1 / totalItems;
    const start = index * sliceSize;
    const itemProgress = (progress - start) / sliceSize;
    return Math.max(0, Math.min(1, itemProgress));
  };

  // Which item is currently "active"
  const activeIndex = Math.min(
    totalItems - 1,
    Math.floor(progress * totalItems)
  );

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative scroll-mt-20"
      style={{ height: `${totalItems * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-6">
          {/* Section label */}
          <p
            className="text-sm font-medium uppercase tracking-wider mb-6 transition-all duration-500"
            style={{
              color: progress > 0.02 ? "#a1a1aa" : "transparent",
              transform: `translateY(${progress > 0.02 ? 0 : 20}px)`,
            }}
          >
            What we do
          </p>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: big title + description that changes */}
            <div className="relative" style={{ minHeight: "280px" }}>
              {services.map((service, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                return (
                  <div
                    key={service.title}
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : isPast
                        ? "translateY(-60px)"
                        : "translateY(60px)",
                    }}
                  >
                    <h2
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {service.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed max-w-md">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: visual indicator / progress */}
            <div className="hidden lg:flex flex-col items-end gap-6">
              {services.map((service, i) => {
                const itemP = getItemProgress(i);
                const isActive = i === activeIndex;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0.25,
                      transform: `translateX(${isActive ? 0 : 20}px)`,
                    }}
                  >
                    <div className="text-right">
                      <p
                        className="text-sm font-semibold transition-colors duration-500"
                        style={{ color: isActive ? "#18181b" : "#d4d4d8" }}
                      >
                        {service.title.replace("\n", " ")}
                      </p>
                    </div>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      {/* Progress ring */}
                      <svg className="absolute inset-0 w-12 h-12 -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#f4f4f5"
                          strokeWidth="2"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#18181b"
                          strokeWidth="2"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - itemP)}`}
                          className="transition-all duration-100"
                        />
                      </svg>
                      <div
                        className="relative z-10 transition-colors duration-500"
                        style={{ color: isActive ? "#18181b" : "#d4d4d8" }}
                      >
                        {service.icon}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: dot indicators */}
          <div className="flex lg:hidden gap-2 mt-8">
            {services.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === activeIndex ? "32px" : "8px",
                  backgroundColor: i === activeIndex ? "#18181b" : "#e4e4e7",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Scroll-reveal component ─── */
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactHandle, setContactHandle] = useState("");

  return (
    <div
      className="min-h-screen bg-white text-zinc-900"
      style={{
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-5 text-zinc-900" />
            <span className="text-lg font-semibold tracking-tight">
              Aidemak
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="#services"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Apply
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Now accepting new creators
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
                Your videos,
                <br />
                every language.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-lg">
                We dub your YouTube videos into the languages that matter most —
                Mandarin, Spanish, Japanese, and more. Studio-quality AI voices,
                fully managed, so you never lift a finger.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex items-center gap-4">
                <a href="#contact">
                  <Button
                    size="lg"
                    className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 px-6"
                  >
                    Apply for Demo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#services">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-zinc-500 hover:text-zinc-900"
                  >
                    Learn More
                  </Button>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="absolute top-12 right-0 opacity-[0.03] pointer-events-none hidden lg:block">
          <Logo className="w-[400px] h-[280px] text-zinc-900" />
        </div>
      </section>

      {/* ─── Scroll-animated Services ─── */}
      <ServicesSection />

      {/* How it works */}
      <section className="bg-zinc-50/50">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <Reveal>
            <div className="mb-14">
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Process
              </p>
              <h2 className="text-3xl font-bold tracking-tight">
                Three steps to go global
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect your channel",
                desc: "Link your YouTube channel with us. We analyze your content, audience, and growth potential across languages.",
              },
              {
                step: "02",
                title: "We handle everything",
                desc: "We pick the best languages for your niche, dub your videos with AI that sounds like you, and deliver ready-to-publish files.",
              },
              {
                step: "03",
                title: "Watch it grow",
                desc: "New subscribers, more views, higher revenue — from audiences you couldn't reach before.",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 150}>
                <div>
                  <span className="text-xs font-mono text-zinc-300 font-bold">
                    {item.step}
                  </span>
                  <h3 className="font-semibold mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="contact" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center max-w-xl mx-auto">
            <Reveal>
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Apply now
              </p>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                See what your channel sounds like in a new language.
              </h2>
            </Reveal>

            {!showForm ? (
              <Reveal delay={100}>
                <Button
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 px-8"
                >
                  Request Free Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Reveal>
            ) : (
              <div
                className="text-left space-y-4 mt-4"
                style={{
                  animation: "fadeSlideUp 0.4s ease-out forwards",
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    YouTube Channel or Video Link
                  </label>
                  <Input
                    placeholder="https://youtube.com/@yourchannel"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="bg-white border-zinc-200 focus-visible:ring-zinc-300"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Preferred Contact Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {["Email", "WhatsApp", "Telegram"].map((method) => (
                      <button
                        key={method}
                        onClick={() => setContactMethod(method)}
                        className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                          contactMethod === method
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder={
                      contactMethod === "Email"
                        ? "your@email.com"
                        : contactMethod === "WhatsApp"
                        ? "Your phone number"
                        : contactMethod === "Telegram"
                        ? "@yourusername"
                        : "Select a method above, then enter your details"
                    }
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    className="bg-white border-zinc-200 focus-visible:ring-zinc-300"
                  />
                </div>
                <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 gap-2 mt-2">
                  Submit Application
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-xs text-zinc-400 text-center">
                  No commitment required.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-400">Aidemak</span>
          </div>
          <p className="text-xs text-zinc-300">
            &copy; {new Date().getFullYear()} Aidemak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
