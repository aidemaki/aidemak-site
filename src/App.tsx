import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mic,
  Zap,
  ArrowRight,
  Users,
  BarChart3,
  Globe,
} from "lucide-react";

/* ─── i18n ─── */
type Lang = "en" | "zh-TW" | "zh-CN" | "ja";

const langLabels: Record<Lang, string> = {
  en: "EN",
  "zh-TW": "繁",
  "zh-CN": "简",
  ja: "JP",
};

const t: Record<Lang, Record<string, string>> = {
  en: {
    badge: "Now accepting new creators",
    heroTitle1: "Your videos,",
    heroTitle2: "every language.",
    heroDesc:
      "We dub your YouTube videos into the languages that matter most — Mandarin, Spanish, Japanese, and more. Studio-quality AI voices, fully managed, so you never lift a finger.",
    heroCta: "Apply for Demo",
    heroLearn: "Learn More",
    whatWeDo: "What we do",
    svc1Title: "Studio-Quality\nAI Dubbing",
    svc1Desc:
      "YouTube's built-in dubbing sounds robotic. Ours doesn't. We deliver natural, expressive voice dubbing that your audience won't believe is AI-generated.",
    svc2Title: "Fully Managed\nService",
    svc2Desc:
      "We handle everything — translation, voice synthesis, quality review, and delivery. You keep creating content. We make it multilingual.",
    svc3Title: "Strategic Language\nSelection",
    svc3Desc:
      "We analyze your content and audience data to pick the languages that will maximize your revenue per video. No guesswork, just results.",
    svc4Title: "Grow Your\nGlobal Subscribers",
    svc4Desc:
      "Reach millions of viewers who don't speak your language. Turn every video into a subscriber magnet across new markets.",
    processLabel: "Process",
    processTitle: "Three steps to go global",
    step1Title: "Connect your channel",
    step1Desc:
      "Link your YouTube channel with us. We analyze your content, audience, and growth potential across languages.",
    step2Title: "We handle everything",
    step2Desc:
      "We pick the best languages for your niche, dub your videos with AI that sounds like you, and deliver ready-to-publish files.",
    step3Title: "Watch it grow",
    step3Desc:
      "New subscribers, more views, higher revenue — from audiences you couldn't reach before.",
    applyLabel: "Apply now",
    applyTitle: "See what your channel sounds like in a new language.",
    applyCta: "Request Free Demo",
    formYtLabel: "YouTube Channel or Video Link",
    formYtPlaceholder: "https://youtube.com/@yourchannel",
    formContactLabel: "Preferred Contact Method",
    formContactPlaceholder: "Select a method above, then enter your details",
    formEmailPlaceholder: "your@email.com",
    formWhatsAppPlaceholder: "Your phone number",
    formTelegramPlaceholder: "@yourusername",
    formSubmit: "Submit Application",
    formNote: "No commitment required.",
    footerRights: "All rights reserved.",
  },
  "zh-TW": {
    badge: "現正接受新創作者申請",
    heroTitle1: "你的影片，",
    heroTitle2: "每種語言。",
    heroDesc:
      "我們將你的 YouTube 影片配音成最重要的語言 — 普通話、西班牙語、日語等等。錄音室級 AI 配音，全程託管，你無需費心。",
    heroCta: "申請試用",
    heroLearn: "了解更多",
    whatWeDo: "我們的服務",
    svc1Title: "錄音室級\nAI 配音",
    svc1Desc:
      "YouTube 內建配音聽起來生硬機械。我們的不會。我們提供自然、富有表現力的配音，你的觀眾不會相信這是 AI 生成的。",
    svc2Title: "全程託管\n服務",
    svc2Desc:
      "我們處理一切 — 翻譯、語音合成、品質審核和交付。你繼續創作內容，我們讓它變成多語言。",
    svc3Title: "策略性\n語言選擇",
    svc3Desc:
      "我們分析你的內容和觀眾數據，選擇能最大化每支影片收益的語言。不靠猜測，只看結果。",
    svc4Title: "拓展你的\n全球訂閱者",
    svc4Desc:
      "觸及數百萬不說你語言的觀眾。讓每支影片都成為新市場的訂閱者磁鐵。",
    processLabel: "流程",
    processTitle: "三步走向全球",
    step1Title: "連接你的頻道",
    step1Desc:
      "將你的 YouTube 頻道與我們連結。我們分析你的內容、觀眾和跨語言成長潛力。",
    step2Title: "我們處理一切",
    step2Desc:
      "我們為你的領域選擇最佳語言，用聽起來像你的 AI 配音你的影片，並交付可直接發布的檔案。",
    step3Title: "見證成長",
    step3Desc: "新訂閱者、更多觀看、更高收入 — 來自你以前無法觸及的觀眾。",
    applyLabel: "立即申請",
    applyTitle: "聽聽你的頻道用另一種語言會是什麼樣。",
    applyCta: "申請免費試用",
    formYtLabel: "YouTube 頻道或影片連結",
    formYtPlaceholder: "https://youtube.com/@yourchannel",
    formContactLabel: "偏好的聯繫方式",
    formContactPlaceholder: "請先選擇上方的聯繫方式，再輸入詳細資訊",
    formEmailPlaceholder: "your@email.com",
    formWhatsAppPlaceholder: "你的電話號碼",
    formTelegramPlaceholder: "@yourusername",
    formSubmit: "提交申請",
    formNote: "無需任何承諾。",
    footerRights: "版權所有。",
  },
  "zh-CN": {
    badge: "现正接受新创作者申请",
    heroTitle1: "你的视频，",
    heroTitle2: "每种语言。",
    heroDesc:
      "我们将你的 YouTube 视频配音成最重要的语言 — 普通话、西班牙语、日语等等。录音棚级 AI 配音，全程托管，你无需费心。",
    heroCta: "申请试用",
    heroLearn: "了解更多",
    whatWeDo: "我们的服务",
    svc1Title: "录音棚级\nAI 配音",
    svc1Desc:
      "YouTube 内置配音听起来生硬机械。我们的不会。我们提供自然、富有表现力的配音，你的观众不会相信这是 AI 生成的。",
    svc2Title: "全程托管\n服务",
    svc2Desc:
      "我们处理一切 — 翻译、语音合成、质量审核和交付。你继续创作内容，我们让它变成多语言。",
    svc3Title: "策略性\n语言选择",
    svc3Desc:
      "我们分析你的内容和观众数据，选择能最大化每个视频收益的语言。不靠猜测，只看结果。",
    svc4Title: "拓展你的\n全球订阅者",
    svc4Desc:
      "触及数百万不说你语言的观众。让每个视频都成为新市场的订阅者磁铁。",
    processLabel: "流程",
    processTitle: "三步走向全球",
    step1Title: "连接你的频道",
    step1Desc:
      "将你的 YouTube 频道与我们连接。我们分析你的内容、观众和跨语言增长潜力。",
    step2Title: "我们处理一切",
    step2Desc:
      "我们为你的领域选择最佳语言，用听起来像你的 AI 配音你的视频，并交付可直接发布的文件。",
    step3Title: "见证增长",
    step3Desc: "新订阅者、更多观看、更高收入 — 来自你以前无法触及的观众。",
    applyLabel: "立即申请",
    applyTitle: "听听你的频道用另一种语言会是什么样。",
    applyCta: "申请免费试用",
    formYtLabel: "YouTube 频道或视频链接",
    formYtPlaceholder: "https://youtube.com/@yourchannel",
    formContactLabel: "偏好的联系方式",
    formContactPlaceholder: "请先选择上方的联系方式，再输入详细信息",
    formEmailPlaceholder: "your@email.com",
    formWhatsAppPlaceholder: "你的电话号码",
    formTelegramPlaceholder: "@yourusername",
    formSubmit: "提交申请",
    formNote: "无需任何承诺。",
    footerRights: "版权所有。",
  },
  ja: {
    badge: "新しいクリエイターを募集中",
    heroTitle1: "あなたの動画を、",
    heroTitle2: "あらゆる言語で。",
    heroDesc:
      "YouTube動画を最も重要な言語に吹き替えます — 中国語、スペイン語、日本語など。スタジオ品質のAI音声で、フルマネージド。あなたは何もする必要がありません。",
    heroCta: "デモを申し込む",
    heroLearn: "詳しく見る",
    whatWeDo: "サービス内容",
    svc1Title: "スタジオ品質の\nAI吹き替え",
    svc1Desc:
      "YouTubeの内蔵吹き替えはロボットのように聞こえます。私たちのは違います。視聴者がAI生成だと信じられないほど自然で表現力豊かな吹き替えを提供します。",
    svc2Title: "フルマネージド\nサービス",
    svc2Desc:
      "翻訳、音声合成、品質レビュー、納品まですべてお任せください。あなたはコンテンツ制作に集中するだけ。私たちが多言語化します。",
    svc3Title: "戦略的な\n言語選択",
    svc3Desc:
      "コンテンツと視聴者データを分析し、動画ごとの収益を最大化する言語を選びます。推測ではなく、結果で判断します。",
    svc4Title: "グローバル\n登録者を増やす",
    svc4Desc:
      "あなたの言語を話さない数百万の視聴者にリーチ。すべての動画を新しい市場での登録者獲得の武器に。",
    processLabel: "プロセス",
    processTitle: "3ステップでグローバルへ",
    step1Title: "チャンネルを接続",
    step1Desc:
      "YouTubeチャンネルを私たちとリンク。コンテンツ、視聴者、多言語での成長ポテンシャルを分析します。",
    step2Title: "すべてお任せ",
    step2Desc:
      "あなたのニッチに最適な言語を選び、あなたの声に似たAIで動画を吹き替え、すぐに公開できるファイルを納品します。",
    step3Title: "成長を見届ける",
    step3Desc:
      "新しい登録者、より多い再生回数、より高い収益 — 以前はリーチできなかった視聴者から。",
    applyLabel: "今すぐ申し込む",
    applyTitle: "あなたのチャンネルが別の言語でどう聞こえるか体験してください。",
    applyCta: "無料デモをリクエスト",
    formYtLabel: "YouTubeチャンネルまたは動画リンク",
    formYtPlaceholder: "https://youtube.com/@yourchannel",
    formContactLabel: "希望する連絡方法",
    formContactPlaceholder: "上から連絡方法を選んでから詳細を入力してください",
    formEmailPlaceholder: "your@email.com",
    formWhatsAppPlaceholder: "電話番号",
    formTelegramPlaceholder: "@yourusername",
    formSubmit: "申し込みを送信",
    formNote: "コミットメントは不要です。",
    footerRights: "All rights reserved.",
  },
};

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

/* ─── Language switcher ─── */
function LangSwitcher({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <Globe className="w-4 h-4" />
        {langLabels[lang]}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 min-w-[80px] z-50">
          {(Object.keys(langLabels) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                l === lang
                  ? "bg-zinc-50 text-zinc-900 font-medium"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              {langLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Scroll-driven progress hook ─── */
function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const windowH = window.innerHeight;
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

/* ─── Animated service section (Apple-style sticky scroll) ─── */
function ServicesSection({ lang }: { lang: Lang }) {
  const strings = t[lang];
  const services = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: strings.svc1Title,
      description: strings.svc1Desc,
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: strings.svc2Title,
      description: strings.svc2Desc,
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: strings.svc3Title,
      description: strings.svc3Desc,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: strings.svc4Title,
      description: strings.svc4Desc,
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);

  const totalItems = services.length;
  const getItemProgress = (index: number) => {
    const sliceSize = 1 / totalItems;
    const start = index * sliceSize;
    const itemProgress = (progress - start) / sliceSize;
    return Math.max(0, Math.min(1, itemProgress));
  };

  const activeIndex = Math.min(
    totalItems - 1,
    Math.floor(progress * totalItems)
  );

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative"
      style={{ height: `${totalItems * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-6">
          <p
            className="text-sm font-medium uppercase tracking-wider mb-6 transition-all duration-500"
            style={{
              color: progress > 0.02 ? "#a1a1aa" : "transparent",
              transform: `translateY(${progress > 0.02 ? 0 : 20}px)`,
            }}
          >
            {strings.whatWeDo}
          </p>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative" style={{ minHeight: "280px" }}>
              {services.map((service, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                return (
                  <div
                    key={i}
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
                          strokeDashoffset={`${
                            2 * Math.PI * 20 * (1 - itemP)
                          }`}
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
  const [lang, setLang] = useState<Lang>("en");
  const [showForm, setShowForm] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactHandle, setContactHandle] = useState("");

  const s = t[lang];

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
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                {s.badge}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
                {s.heroTitle1}
                <br />
                {s.heroTitle2}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-lg">
                {s.heroDesc}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex items-center gap-4">
                <a href="#contact">
                  <Button
                    size="lg"
                    className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 px-6"
                  >
                    {s.heroCta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#services">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-zinc-500 hover:text-zinc-900"
                  >
                    {s.heroLearn}
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
      <ServicesSection lang={lang} />

      {/* How it works */}
      <section className="bg-zinc-50/50">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <Reveal>
            <div className="mb-14">
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
                {s.processLabel}
              </p>
              <h2 className="text-3xl font-bold tracking-tight">
                {s.processTitle}
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: s.step1Title,
                desc: s.step1Desc,
              },
              {
                step: "02",
                title: s.step2Title,
                desc: s.step2Desc,
              },
              {
                step: "03",
                title: s.step3Title,
                desc: s.step3Desc,
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
                {s.applyLabel}
              </p>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                {s.applyTitle}
              </h2>
            </Reveal>

            {!showForm ? (
              <Reveal delay={100}>
                <Button
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 px-8"
                >
                  {s.applyCta}
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
                    {s.formYtLabel}
                  </label>
                  <Input
                    placeholder={s.formYtPlaceholder}
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="bg-white border-zinc-200 focus-visible:ring-zinc-300"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    {s.formContactLabel}
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
                        ? s.formEmailPlaceholder
                        : contactMethod === "WhatsApp"
                        ? s.formWhatsAppPlaceholder
                        : contactMethod === "Telegram"
                        ? s.formTelegramPlaceholder
                        : s.formContactPlaceholder
                    }
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    className="bg-white border-zinc-200 focus-visible:ring-zinc-300"
                  />
                </div>
                <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 gap-2 mt-2">
                  {s.formSubmit}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-xs text-zinc-400 text-center">
                  {s.formNote}
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
            &copy; {new Date().getFullYear()} Aidemak. {s.footerRights}
          </p>
        </div>
      </footer>
    </div>
  );
}