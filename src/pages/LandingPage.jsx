import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandMark } from "@/components/design/BrandMark";
import { LanguageSwitcher } from "@/components/design/LanguageSwitcher";
import { ThemeToggle } from "@/components/design/ThemeToggle";
import { LogisticsSlideshow } from "@/components/landing/LogisticsSlideshow";
import { LandingHeroBackground } from "@/components/landing/LandingHeroBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { calculateFare } from "@/lib/fare";
import { formatINR } from "@/lib/utils";
import {
  Truck,
  ArrowRight,
  Phone,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  PhoneCall,
  X,
  Compass,
  Boxes,
  Users,
  Building2,
  ChevronRight,
  Cpu,
  Smartphone,
  ExternalLink,
  Zap,
  LogIn,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { villages, vehicleTypes } = useData();
  const { isPrimaryMode } = useTheme();

  // Active section tracking for the pill bar
  const [activeTab, setActiveTab] = useState("about");

  // Track if user has scrolled past hero for subtle header enhancements
  const [isScrolled, setIsScrolled] = useState(false);

  // Helpline Modal State
  const [showHelplineModal, setShowHelplineModal] = useState(false);

  // Quick route calculator state for the Electric Blue Card
  const [selectedPickup, setSelectedPickup] = useState("Baramati");
  const [selectedDest, setSelectedDest] = useState("Phaltan");
  const [cargoWeight, setCargoWeight] = useState(35);

  const pickupVillage = villages.find((v) => v.name === selectedPickup) || villages[0];
  const destVillage = villages.find((v) => v.name === selectedDest) || villages[1];
  const miniTempo = vehicleTypes.find((v) => v.code === "mini_tempo") || vehicleTypes[0];

  const quickFare = calculateFare({
    pickupVillage,
    destinationVillage: destVillage,
    weight_kg: Number(cargoWeight || 35),
    mode: "shared",
    vehicleType: miniTempo,
  });

  const corridorRoutes = [
    { from: "Baramati", to: "Phaltan", dist: "38 km", time: "45 mins", runs: "14 runs/day" },
    { from: "Indapur", to: "Baramati", dist: "44 km", time: "55 mins", runs: "12 runs/day" },
    { from: "Daund", to: "Shirur", dist: "52 km", time: "1 hr 10m", runs: "10 runs/day" },
    { from: "Jejuri", to: "Baramati", dist: "42 km", time: "50 mins", runs: "16 runs/day" },
    { from: "Shirur", to: "Pune Mandi", dist: "65 km", time: "1 hr 30m", runs: "20 runs/day" },
  ];

  // Scrollspy observer: highlight active tab as user scrolls down one-by-one
  useEffect(() => {
    const sectionIds = ["about", "how-to-use", "workflow", "connectivity", "offline-remedies"];
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);

      const scrollPos = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // account for sticky pill bar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const tabItems = [
    { id: "about", label: "About the web" },
    { id: "how-to-use", label: "How to use" },
    { id: "workflow", label: "Workflow" },
    { id: "connectivity", label: "connectivity" },
    { id: "offline-remedies", label: "offline remedies" },
  ];

  // Dynamic Theme Colors
  const accentText = isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]";
  const accentBg = isPrimaryMode ? "bg-[#CCFF00] text-black" : "bg-[#FF6600] text-white";
  const subtextClass = isPrimaryMode ? "text-white/75" : "text-slate-600";
  const titleClass = isPrimaryMode ? "text-white" : "text-slate-900";
  const cardBgClass = isPrimaryMode
    ? "bg-[#121622] border-white/10 text-white shadow-xl"
    : "bg-white border-orange-100 text-slate-800 shadow-lg";

  return (
    <div
      className={`min-h-screen font-body flex flex-col relative transition-colors duration-300 ${isPrimaryMode
          ? "bg-[#07090E] text-white selection:bg-[#CCFF00] selection:text-black"
          : "bg-[#F8FAFC] text-slate-900 selection:bg-[#FF6600] selection:text-white"
        }`}
    >
      {/* Rich Multi-Spectrum Animated Corridor & Mesh Background */}
      <LandingHeroBackground isPrimaryMode={isPrimaryMode} />

      {/* =========================================================================
          1. FIRST NAVBAR (MATCHING THE EXACT WIREFRAME SKETCH UPLOADED BY USER)
          - Left tab: Logo, Home, Order a share tempo, get helpline number, with angled cut /
          - Right tab: Same as navbar with angled cut /
          ========================================================================= */}
      <header className="pt-3 px-4 sm:px-8 lg:px-12 max-w-[1536px] mx-auto w-full z-40 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Left Angled Tab Container */}
          <div
            className={`flex items-center gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-2xl sm:rounded-none relative backdrop-blur-xl shadow-2xl transition-all duration-300 border ${isPrimaryMode
                ? "bg-[#161B26]/95 border-white/15 text-white"
                : "bg-white/95 border-orange-200 text-slate-800"
              }`}
            style={{
              clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 100%, 0 100%)",
            }}
          >
            {/* Logo: User's custom Karwan logo */}
            <Link
              to="/"
              className={`flex items-center pr-2 border-r ${isPrimaryMode ? "border-white/15" : "border-slate-200"
                }`}
            >
              <BrandMark size="sm" />
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className={`transition hidden md:inline ${isPrimaryMode ? "text-white/80 hover:text-white" : "text-slate-700 hover:text-[#FF6600]"
                  }`}
              >
                Home
              </button>

              {/* Order a share tempo */}
              <Link
                to="/app"
                className={`flex items-center gap-1.5 font-heading font-black px-4 py-2 rounded-full text-xs transition active:scale-95 whitespace-nowrap ${isPrimaryMode
                    ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.45)] hover:bg-[#DFFF00]"
                    : "bg-[#FF6600] text-white shadow-[0_0_20px_rgba(255,102,0,0.45)] hover:bg-[#E65C00]"
                  }`}
              >
                <Truck size={14} />
                <span>Order a share tempo</span>
              </Link>

              {/* Get Helpline Number */}
              <button
                type="button"
                onClick={() => setShowHelplineModal(true)}
                className={`flex items-center gap-1.5 transition font-bold whitespace-nowrap ${isPrimaryMode ? "text-white/90 hover:text-[#CCFF00]" : "text-slate-700 hover:text-[#FF6600]"
                  }`}
              >
                <Phone size={13} className={accentText} />
                <span className="hidden sm:inline">get helpline number</span>
                <span className="sm:hidden">1800-VELQORA</span>
              </button>
            </div>

            {/* Right padding space for the angled cut */}
            <div className="w-6" />
          </div>

          {/* Right Angled Tab Container ("Same as navbar" in sketch) */}
          <div
            className={`hidden sm:flex items-center gap-3 px-6 py-2.5 backdrop-blur-xl shadow-2xl transition-all duration-300 border ${isPrimaryMode
                ? "bg-[#161B26]/95 border-white/15 text-white"
                : "bg-white/95 border-orange-200 text-slate-800"
              }`}
            style={{
              clipPath: "polygon(24px 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div className="w-2" />

            {/* Theme Toggle Mode (Primary ON / Orange-White OFF) */}
            <ThemeToggle />

            <div
              className={`flex items-center gap-2.5 pl-3 border-l text-xs font-bold ${isPrimaryMode ? "border-white/15" : "border-slate-200"
                }`}
            >
              <LanguageSwitcher compact />

              <Link
                to="/driver"
                className={`transition flex items-center gap-1 ${isPrimaryMode ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                title="Driver Partner Portal"
              >
                <Truck size={12} className={accentText} />
                <span>Driver</span>
              </Link>

              <Link
                to="/admin"
                className={`transition flex items-center gap-1 ${isPrimaryMode ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                title="Admin Operations HQ"
              >
                <Building2 size={12} className={accentText} />
                <span>Admin</span>
              </Link>

              <Link
                to="/login"
                className={`rounded-full px-3.5 py-1.5 transition font-bold flex items-center gap-1.5 text-xs shadow-md ${isPrimaryMode
                    ? "bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.35)] hover:bg-[#DFFF00]"
                    : "bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.35)] hover:bg-[#E65C00]"
                  }`}
              >
                <LogIn size={13} />
                <span>Login</span>
              </Link>

              <Link
                to="/app"
                className={`rounded-full px-3.5 py-1.5 transition ${isPrimaryMode
                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                    : "bg-orange-50 text-[#FF6600] border border-orange-200 hover:bg-orange-100"
                  }`}
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-2 space-y-12 flex-1 w-full relative z-10">
        {/* Full-width Hero Section (Container card removed) */}
        <section className="w-full relative py-4 lg:py-8 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
            {/* Left Side: "Write up here" */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.15] -mt-2 lg:-mt-5">
                Never pay for a full tempo again. <br />
                <span className={accentText}>Share rural logistics.</span>
              </h1>

              {/* Action Buttons pushed down to reveal background transit map */}
              <div className="pt-10 sm:pt-14 lg:pt-16 flex flex-wrap items-center gap-3">
                <Link
                  to="/app"
                  className={`flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-black transition active:scale-95 ${isPrimaryMode
                      ? "bg-[#CCFF00] text-black shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:bg-[#DFFF00]"
                      : "bg-[#FF6600] text-white shadow-[0_0_25px_rgba(255,102,0,0.4)] hover:bg-[#E65C00]"
                    }`}
                >
                  <Truck size={15} />
                  <span>Order Shared Tempo</span>
                  <ArrowRight size={15} />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowHelplineModal(true)}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-3.5 text-xs font-bold transition ${isPrimaryMode
                      ? "bg-white/10 border-white/15 text-white hover:bg-white/15"
                      : "bg-orange-50 border-orange-200 text-slate-800 hover:bg-orange-100"
                    }`}
                >
                  <PhoneCall size={14} className={accentText} />
                  <span>Call Toll-Free 1800</span>
                </button>
              </div>
            </div>

            {/* Right Side: Fare Estimation Card */}
            <div className="lg:col-span-5">
              <div
                className={`relative rounded-3xl p-6 sm:p-8 text-white border transition-all duration-300 ${isPrimaryMode
                    ? "bg-gradient-to-br from-[#0052FF] via-[#0047E0] to-[#0036B8] border-white/20 shadow-[0_20px_60px_-10px_rgba(204,255,0,0.45)] ring-2 ring-[#CCFF00]/40"
                    : "bg-gradient-to-br from-[#FF6600] via-[#F25C00] to-[#D94E00] border-orange-300 shadow-[0_20px_60px_-10px_rgba(255,102,0,0.35)] ring-2 ring-white/30"
                  }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                      <Zap size={18} className={isPrimaryMode ? "text-[#CCFF00]" : "text-white"} />
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase block ${isPrimaryMode ? "text-[#CCFF00]" : "text-white/90"
                          }`}
                      >
                        Live Route Match
                      </span>
                      <h3 className="font-heading font-black text-base text-white">
                        {selectedPickup} ➔ {selectedDest}
                      </h3>
                    </div>
                  </div>

                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold backdrop-blur-sm">
                    {quickFare.distance_km} km Corridor
                  </span>
                </div>

                {/* Interactive Fare Controls */}
                <div className="py-4 space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-white/80 block mb-1">
                        Pickup Mandi
                      </label>
                      <select
                        value={selectedPickup}
                        onChange={(e) => setSelectedPickup(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/25 px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-white"
                      >
                        {villages.map((v) => (
                          <option key={v.id} value={v.name} className="bg-[#121622] text-white">
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white/80 block mb-1">
                        Drop Mandi
                      </label>
                      <select
                        value={selectedDest}
                        onChange={(e) => setSelectedDest(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/25 px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-white"
                      >
                        {villages.map((v) => (
                          <option key={v.id} value={v.name} className="bg-[#121622] text-white">
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-white/80 mb-1">
                      <span>Cargo Weight</span>
                      <span className={isPrimaryMode ? "text-[#CCFF00]" : "text-white"}>
                        {cargoWeight} kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={250}
                      step={5}
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer h-1.5 bg-black/40 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Fare Display Comparison */}
                  <div className="rounded-2xl bg-black/35 p-3.5 border border-white/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/70 block uppercase font-bold tracking-wider">
                        Shared Fare (KarWan)
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span
                          className={`font-heading font-black text-2xl ${isPrimaryMode ? "text-[#CCFF00]" : "text-white"
                            }`}
                        >
                          {formatINR(quickFare.fare_total)}
                        </span>
                        <span className="text-white/60 line-through text-xs">
                          {formatINR(quickFare.individual_total)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-white/70 block">
                        Cost Per Kg
                      </span>
                      <span className="text-xs font-black text-white">
                        ₹{(quickFare.fare_total / (Number(cargoWeight) || 1)).toFixed(1)} / kg
                      </span>
                      <div
                        className={`text-[10px] font-black ${isPrimaryMode ? "text-[#CCFF00]" : "text-amber-200"
                          }`}
                      >
                        Save {formatINR(quickFare.savings)}
                      </div>
                    </div>
                  </div>

                  {/* Start Now Button */}
                  <div className="mt-4">
                    <Link
                      to="/app"
                      className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black transition active:scale-95 shadow-lg group ${isPrimaryMode
                          ? "bg-black/85 hover:bg-black border border-white/25 text-white hover:text-[#CCFF00]"
                          : "bg-white text-[#FF6600] hover:bg-orange-50 border border-white shadow-md"
                        }`}
                    >
                      <span>Start Now</span>
                      <ArrowRight
                        size={16}
                        className={`group-hover:translate-x-1 transition-transform ${isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
                          }`}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            STICKY PILL NAVBAR PANEL (SINGLE UNIFIED ELEMENT)
            - Visible naturally in the hero section when at top
            - When user scrolls down past hero, smoothly STICKS to top as the navbar
            - Features theme toggle and quick CTA when stickied
            ========================================================================= */}
        <div className="sticky top-3 z-50 py-2 w-full flex justify-center transition-all duration-300">
          <div
            className={`inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-full border backdrop-blur-2xl shadow-2xl transition-all duration-300 max-w-full overflow-x-auto no-scrollbar ${isPrimaryMode
                ? "bg-[#121622]/95 border-white/15"
                : "bg-white/95 border-orange-200"
              }`}
          >
            {/* Show Compact Logo when stickied */}
            {isScrolled && (
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`pl-3 pr-2 hidden sm:flex items-center gap-1.5 shrink-0 border-r ${isPrimaryMode ? "border-white/15" : "border-slate-200"
                  }`}
              >
                <BrandMark size="sm" />
              </Link>
            )}

            {/* The 5 Pill Buttons */}
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                    ? isPrimaryMode
                      ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.5)] scale-105"
                      : "bg-[#FF6600] text-white shadow-[0_0_20px_rgba(255,102,0,0.5)] scale-105"
                    : isPrimaryMode
                      ? "text-white/75 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Sticky Bar Theme Toggle */}
            <ThemeToggle compact className="shrink-0 ml-1" />

            {/* Show Quick CTA when stickied */}
            {isScrolled && (
              <Link
                to="/app"
                className={`ml-1 hidden lg:flex items-center gap-1.5 font-heading font-black px-4 py-2 rounded-full text-xs shadow-md transition active:scale-95 whitespace-nowrap shrink-0 ${isPrimaryMode
                    ? "bg-[#CCFF00] text-black hover:bg-[#DFFF00]"
                    : "bg-[#FF6600] text-white hover:bg-[#E65C00]"
                  }`}
              >
                <Truck size={13} />
                <span>Order Tempo</span>
              </Link>
            )}
          </div>
        </div>

        {/* =========================================================================
            3. SCROLLING INFO SECTIONS (CLEAN SPACING WITH ZERO JUMPS)
            ========================================================================= */}
        <div className="pt-8 pb-16 space-y-28 w-full">
          {/* SECTION 1: ABOUT THE WEB */}
          <section id="about" className="scroll-mt-28 space-y-8">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 rounded-full font-black items-center justify-center text-xs ${accentBg}`}
              >
                01
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>
                About KarWan Web Platform
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <h2 className={`font-heading font-black text-3xl sm:text-4xl leading-tight ${titleClass}`}>
                  Eliminating the <span className={accentText}>₹1,800 tempo hire trap</span> for rural producers.
                </h2>
                {/* <p className={`text-sm sm:text-base leading-relaxed ${subtextClass}`}>
                  Across rural Maharashtra, small farmers, dairies, grocery retailers, and handloom
                  weavers frequently need to transport small 20kg to 80kg parcels between mandis.
                  Traditional operators force them to rent an entire vehicle, making logistics
                  account for up to 35% of their total cost.
                </p>
                <p className={`text-sm sm:text-base leading-relaxed ${subtextClass}`}>
                  KarWan aggregates compatible packages moving along the same highway corridor
                  into one shared vehicle. Drivers earn guaranteed daily earnings, and rural shippers
                  pay strictly for their fair share of vehicle capacity.
                </p> */}

                <div className="pt-2 flex items-center gap-3">  
                  <Link
                    to="/app"
                    className={`rounded-xl font-black text-xs px-6 py-3.5 transition active:scale-95 ${isPrimaryMode
                        ? "bg-[#CCFF00] text-black shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:bg-[#DFFF00]"
                        : "bg-[#FF6600] text-white shadow-[0_0_25px_rgba(255,102,0,0.4)] hover:bg-[#E65C00]"
                      }`}
                  >
                    Book Shared Consignment
                  </Link>
                  <button
                    type="button"
                    onClick={() => scrollToSection("how-to-use")}
                    className={`text-xs font-bold underline transition ${isPrimaryMode ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-[#FF6600]"
                      }`}
                  >
                    See How It Works →
                  </button>
                </div>
              </div>

              {/* Visual Image Showcase for Section 1: Multiple Image Slideshow */}
              <div className="lg:col-span-6">
                <LogisticsSlideshow />
              </div>
            </div>
          </section>

          {/* SECTION 2: HOW TO USE */}
          <section id="how-to-use" className="scroll-mt-28 space-y-8">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 rounded-full font-black items-center justify-center text-xs ${isPrimaryMode ? "bg-[#0052FF] text-white" : "bg-[#FF6600] text-white"
                  }`}
              >
                02
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${isPrimaryMode ? "text-[#0052FF]" : "text-[#FF6600]"
                  }`}
              >
                Step-by-Step Guide
              </span>
            </div>

            <div className="space-y-4">
              <h2 className={`font-heading font-black text-3xl sm:text-4xl ${titleClass}`}>
                How to use KarWan in 4 simple steps.
              </h2>
              <p className={`text-sm sm:text-base max-w-2xl ${subtextClass}`}>
                Engineered for simplicity in rural environments without confusing GPS pins or
                complicated apps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step Card 1 */}
              <div
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between group transition ${cardBgClass}`}
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80"
                    alt="Mandi produce collection hub"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 h-8 w-8 rounded-xl font-black flex items-center justify-center text-xs shadow-md ${accentBg}`}
                  >
                    1
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className={`font-heading font-black text-lg ${titleClass}`}>
                    Pick Village Hub
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtextClass}`}>
                    Choose from registered APMC Mandi gates, Gram Panchayat cold rooms, or landmark
                    pickup pins.
                  </p>
                </div>
              </div>

              {/* Step Card 2 */}
              <div
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between group transition ${cardBgClass}`}
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                    alt="Package weighing and cargo classification"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 h-8 w-8 rounded-xl font-black flex items-center justify-center text-xs shadow-md ${isPrimaryMode ? "bg-[#0052FF] text-white" : "bg-[#FF6600] text-white"
                      }`}
                  >
                    2
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className={`font-heading font-black text-lg ${titleClass}`}>
                    Enter Weight & Cargo
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtextClass}`}>
                    Enter cargo weight (kg) and category. Instant fair-share fare calculated
                    transparently in real time.
                  </p>
                </div>
              </div>

              {/* Step Card 3 */}
              <div
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between group transition ${cardBgClass}`}
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80"
                    alt="Rural tempo driver loading shared freight"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 h-8 w-8 rounded-xl font-black flex items-center justify-center text-xs shadow-md ${accentBg}`}
                  >
                    3
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className={`font-heading font-black text-lg ${titleClass}`}>
                    Drop at Mandi Gate
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtextClass}`}>
                    Hand over parcel at your local village collection hub. Verified driver scans barcode
                    tag upon loading.
                  </p>
                </div>
              </div>

              {/* Step Card 4 */}
              <div
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between group transition ${cardBgClass}`}
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
                    alt="Digital delivery confirmation with QR"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 h-8 w-8 rounded-xl font-black flex items-center justify-center text-xs shadow-md ${isPrimaryMode ? "bg-[#0052FF] text-white" : "bg-[#FF6600] text-white"
                      }`}
                  >
                    4
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className={`font-heading font-black text-lg ${titleClass}`}>
                    PIN & QR Handover
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtextClass}`}>
                    Recipient confirms handover with 4-digit PIN verification. Instant GST tax
                    invoice generated automatically.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: WORKFLOW */}
          <section id="workflow" className="scroll-mt-28 space-y-8">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 rounded-full font-black items-center justify-center text-xs ${accentBg}`}
              >
                03
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>
                System Workflow
              </span>
            </div>

            <div className="space-y-4">
              <h2 className={`font-heading font-black text-3xl sm:text-4xl ${titleClass}`}>
                The 5-Rule Algorithmic Corridor Engine
              </h2>
              <p className={`text-sm sm:text-base max-w-2xl ${subtextClass}`}>
                How KarWan clusters rural cargo safely without delays, detour bloat, or perishable
                contamination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className={`rounded-3xl p-6 space-y-3 border ${cardBgClass}`}>
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center ${isPrimaryMode ? "bg-[#CCFF00]/15 text-[#CCFF00]" : "bg-orange-100 text-[#FF6600]"
                    }`}
                >
                  <Clock size={20} />
                </div>
                <span className={`font-heading font-black text-base block ${titleClass}`}>
                  Rule 1: Time Window
                </span>
                <p className={`text-xs leading-relaxed ${subtextClass}`}>
                  Parcels must share overlapping dispatch windows (within &le; 2 hours) to avoid
                  holding vehicles.
                </p>
              </div>

              <div className={`rounded-3xl p-6 space-y-3 border ${cardBgClass}`}>
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center ${isPrimaryMode ? "bg-[#0052FF]/20 text-[#0052FF]" : "bg-orange-100 text-[#FF6600]"
                    }`}
                >
                  <MapPin size={20} />
                </div>
                <span className={`font-heading font-black text-base block ${titleClass}`}>
                  Rule 2: Proximity
                </span>
                <p className={`text-xs leading-relaxed ${subtextClass}`}>
                  Pickup points &le; 30 km and destination &le; 40 km along the central highway
                  corridor axis.
                </p>
              </div>

              <div className={`rounded-3xl p-6 space-y-3 border ${cardBgClass}`}>
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center ${isPrimaryMode ? "bg-[#CCFF00]/15 text-[#CCFF00]" : "bg-orange-100 text-[#FF6600]"
                    }`}
                >
                  <Boxes size={20} />
                </div>
                <span className={`font-heading font-black text-base block ${titleClass}`}>
                  Rule 3: Capacity Limit
                </span>
                <p className={`text-xs leading-relaxed ${subtextClass}`}>
                  Combined weight is capped at 750 kg for Mini Tempos, maintaining vehicle safety
                  and speed.
                </p>
              </div>

              <div className={`rounded-3xl p-6 space-y-3 border ${cardBgClass}`}>
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center ${isPrimaryMode ? "bg-[#0052FF]/20 text-[#0052FF]" : "bg-orange-100 text-[#FF6600]"
                    }`}
                >
                  <Compass size={20} />
                </div>
                <span className={`font-heading font-black text-base block ${titleClass}`}>
                  Rule 4: Max Detour
                </span>
                <p className={`text-xs leading-relaxed ${subtextClass}`}>
                  Multi-drop detour cannot exceed 25% of the direct point-to-point corridor mileage.
                </p>
              </div>

              <div className={`rounded-3xl p-6 space-y-3 border ${cardBgClass}`}>
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center ${isPrimaryMode ? "bg-[#CCFF00]/15 text-[#CCFF00]" : "bg-orange-100 text-[#FF6600]"
                    }`}
                >
                  <ShieldCheck size={20} />
                </div>
                <span className={`font-heading font-black text-base block ${titleClass}`}>
                  Rule 5: Compatibility
                </span>
                <p className={`text-xs leading-relaxed ${subtextClass}`}>
                  Dairy & fresh produce are strictly isolated from contaminating or industrial chemical
                  goods.
                </p>
              </div>
            </div>

            <div
              className={`rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border ${isPrimaryMode ? "bg-white/5 border-white/10" : "bg-orange-50 border-orange-200"
                }`}
            >
              <div className="flex items-center gap-3">
                <Cpu size={20} className={`${accentText} shrink-0`} />
                <span className={`text-xs ${subtextClass}`}>
                  Corridor Engine matches trips in real time using local SQLite and indexed corridor
                  matrices.
                </span>
              </div>
              <Link
                to="/admin/shared-trips"
                className={`text-xs font-bold hover:underline flex items-center gap-1 shrink-0 ${accentText}`}
              >
                <span>Inspect Matching Engine in Admin HQ</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </section>

          {/* SECTION 4: CONNECTIVITY */}
          <section id="connectivity" className="scroll-mt-28 space-y-8">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 rounded-full font-black items-center justify-center text-xs ${isPrimaryMode ? "bg-[#0052FF] text-white" : "bg-[#FF6600] text-white"
                  }`}
              >
                04
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${isPrimaryMode ? "text-[#0052FF]" : "text-[#FF6600]"
                  }`}
              >
                Corridor Connectivity
              </span>
            </div>

            <div className="space-y-4">
              <h2 className={`font-heading font-black text-3xl sm:text-4xl ${titleClass}`}>
                Daily Guaranteed Regional Corridors
              </h2>
              <p className={`text-sm sm:text-base max-w-2xl ${subtextClass}`}>
                Fixed daily departure schedules connecting 6 key regional agricultural mandis across
                Western Maharashtra.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {corridorRoutes.map((route, idx) => (
                <div
                  key={idx}
                  className={`rounded-3xl border p-6 space-y-4 transition group ${cardBgClass}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full text-xs font-black px-3 py-1 ${isPrimaryMode
                          ? "bg-[#CCFF00]/15 text-[#CCFF00]"
                          : "bg-orange-100 text-[#FF6600]"
                        }`}
                    >
                      {route.runs}
                    </span>
                    <span
                      className={`text-xs font-medium ${isPrimaryMode ? "text-white/60" : "text-slate-500"
                        }`}
                    >
                      {route.time} transit
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-3 w-3 rounded-full ${isPrimaryMode ? "bg-[#CCFF00]" : "bg-[#FF6600]"
                          }`}
                      />
                      <div
                        className={`h-8 w-0.5 ${isPrimaryMode ? "bg-white/20" : "bg-slate-300"
                          }`}
                      />
                      <div
                        className={`h-3 w-3 rounded-full ${isPrimaryMode ? "bg-[#0052FF]" : "bg-orange-400"
                          }`}
                      />
                    </div>
                    <div>
                      <span className={`font-heading font-black text-lg block ${titleClass}`}>
                        {route.from}
                      </span>
                      <span className={`font-heading font-black text-lg block mt-2 ${titleClass}`}>
                        {route.to}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`pt-3 border-t flex items-center justify-between text-xs ${isPrimaryMode
                        ? "border-white/10 text-white/60"
                        : "border-slate-100 text-slate-500"
                      }`}
                  >
                    <span>
                      Corridor: <strong>{route.dist}</strong>
                    </span>
                    <Link
                      to="/app"
                      className={`font-black group-hover:underline flex items-center gap-1 ${accentText}`}
                    >
                      <span>Book Route</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Custom Route Request Card */}
              <div
                className={`rounded-3xl p-6 text-white space-y-4 flex flex-col justify-between shadow-xl ${isPrimaryMode
                    ? "bg-[#0052FF]"
                    : "bg-gradient-to-br from-[#FF6600] to-[#E65100]"
                  }`}
              >
                <div>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-black inline-block mb-2">
                    Village Expansion
                  </span>
                  <h3 className="font-heading font-black text-xl text-white">Need a New Panchayat Route?</h3>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    We add new Gram Panchayat collection centers weekly based on rural farmer volume.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHelplineModal(true)}
                  className="w-full py-3 rounded-2xl bg-black/80 hover:bg-black text-white text-xs font-black transition flex items-center justify-center gap-2"
                >
                  <Phone size={14} className={isPrimaryMode ? "text-[#CCFF00]" : "text-amber-300"} />
                  <span>Call 1800-VELQORA</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 5: OFFLINE REMEDIES */}
          <section id="offline-remedies" className="scroll-mt-28 space-y-8">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 rounded-full font-black items-center justify-center text-xs ${accentBg}`}
              >
                05
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>
                Offline Accessibility
              </span>
            </div>

            <div
              className={`rounded-3xl border p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isPrimaryMode
                  ? "bg-gradient-to-br from-[#121622] via-[#161B29] to-[#121622] border-white/15 text-white"
                  : "bg-white border-2 border-orange-200 text-slate-900"
                }`}
            >
              <div className="lg:col-span-7 space-y-5">
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold border ${isPrimaryMode
                      ? "bg-[#CCFF00]/15 border-[#CCFF00]/30 text-[#CCFF00]"
                      : "bg-orange-50 border-orange-200 text-[#FF6600]"
                    }`}
                >
                  <Smartphone size={14} />
                  <span>Zero Smartphone or Data Requirement</span>
                </div>

                <h2 className="font-heading font-black text-3xl sm:text-4xl leading-tight">
                  Dial <span className={accentText}>1800-VELQORA</span> from any ₹1,000 keypad phone.
                </h2>

                <p className={`text-sm sm:text-base leading-relaxed ${subtextClass}`}>
                  Rural India does not run exclusively on 5G smartphones. KarWan features a built-in
                  automated DTMF Phone IVR dialer. Farmers can simply pick up any basic phone, dial
                  our toll-free number, select their village code, hear automated audio rate quotes
                  in Marathi or Hindi, and receive instant booking confirmation via SMS.
                </p>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 ${subtextClass}`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={`${accentText} shrink-0`} />
                    <span>Press 1 for Baramati, 2 for Phaltan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={`${accentText} shrink-0`} />
                    <span>Marathi (मराठी) & Hindi (हिंदी) audio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={`${accentText} shrink-0`} />
                    <span>Free toll-free call from any mobile network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={`${accentText} shrink-0`} />
                    <span>Automated SMS driver & tracking update</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowHelplineModal(true)}
                    className={`rounded-xl font-black text-xs px-6 py-3.5 shadow-md transition active:scale-95 ${isPrimaryMode
                        ? "bg-[#CCFF00] text-black hover:bg-[#DFFF00]"
                        : "bg-[#FF6600] text-white hover:bg-[#E65C00]"
                      }`}
                  >
                    Dial 1800-VELQORA
                  </button>
                  <Link
                    to="/admin/ivr"
                    className={`rounded-xl font-bold text-xs px-5 py-3.5 border transition flex items-center gap-1.5 ${isPrimaryMode
                        ? "bg-white/10 hover:bg-white/15 text-white border-white/15"
                        : "bg-orange-50 hover:bg-orange-100 text-[#FF6600] border-orange-200"
                      }`}
                  >
                    <span>Launch Admin IVR Simulator</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>

              {/* Visual Keypad Phone Simulation */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  className={`w-64 rounded-3xl border-4 p-6 shadow-2xl space-y-4 text-center ${isPrimaryMode
                      ? "bg-black border-white/20 text-white"
                      : "bg-slate-900 border-orange-300 text-white"
                    }`}
                >
                  <div className={`text-[10px] font-mono uppercase tracking-widest ${accentText}`}>
                    KarWan Toll-Free IVR
                  </div>
                  <div className="rounded-xl bg-white/10 p-3 font-mono text-xs text-white/90">
                    &ldquo;Baramati sathi 1 daba, Phaltan sathi 2 daba...&rdquo;
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-base font-bold text-white">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <div
                        key={num}
                        className={`p-2.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer transition ${isPrimaryMode
                            ? "hover:bg-[#CCFF00] hover:text-black"
                            : "hover:bg-[#FF6600] hover:text-white"
                          }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* =========================================================================
          4. HELPLINE MODAL (TRIGGERS FROM "GET HELPLINE NUMBER")
          ========================================================================= */}
      {showHelplineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 sm:p-8 space-y-5 shadow-2xl relative ${isPrimaryMode
                ? "bg-[#161B26] border-white/20 text-white"
                : "bg-white border-orange-200 text-slate-900"
              }`}
          >
            <button
              type="button"
              onClick={() => setShowHelplineModal(false)}
              className={`absolute top-5 right-5 p-1 rounded-full ${isPrimaryMode
                  ? "text-white/60 hover:text-white bg-white/5"
                  : "text-slate-500 hover:text-slate-800 bg-slate-100"
                }`}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${isPrimaryMode ? "bg-[#CCFF00] text-black" : "bg-[#FF6600] text-white"
                  }`}
              >
                <PhoneCall size={22} />
              </div>
              <div>
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${accentText}`}>
                  Toll-Free Rural Support
                </span>
                <h3 className={`font-heading font-black text-xl ${titleClass}`}>
                  1800-VELQORA
                </h3>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border space-y-2.5 text-xs ${isPrimaryMode
                  ? "bg-black/40 border-white/10 text-white/80"
                  : "bg-orange-50 border-orange-100 text-slate-700"
                }`}
            >
              <div className="flex justify-between">
                <span>Direct Toll-Free:</span>
                <strong className={accentText}>1800-835-7672</strong>
              </div>
              <div className="flex justify-between">
                <span>Working Hours:</span>
                <span>05:00 AM – 10:00 PM Daily</span>
              </div>
              <div className="flex justify-between">
                <span>Supported Languages:</span>
                <span>मराठी · हिंदी · English</span>
              </div>
              <div className="flex justify-between">
                <span>Cost to Caller:</span>
                <span className="text-green-500 font-bold">100% Free Call</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="tel:18008357672"
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black shadow-lg transition active:scale-95 ${isPrimaryMode
                    ? "bg-[#CCFF00] text-black hover:bg-[#DFFF00]"
                    : "bg-[#FF6600] text-white hover:bg-[#E65C00]"
                  }`}
              >
                <Phone size={15} />
                <span>Call 1800-VELQORA Now</span>
              </a>

              <Link
                to="/admin/ivr"
                onClick={() => setShowHelplineModal(false)}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold transition ${isPrimaryMode
                    ? "bg-white/10 text-white hover:bg-white/15"
                    : "bg-orange-50 text-[#FF6600] hover:bg-orange-100"
                  }`}
              >
                <span>Launch Interactive Keypad Simulator</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. FOOTER
          ========================================================================= */}
      <footer
        className={`border-t py-10 text-xs transition-colors duration-300 ${isPrimaryMode
            ? "border-white/10 bg-[#040609] text-white/50"
            : "border-orange-200 bg-white text-slate-500 shadow-inner"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandMark size="sm" />
            <span>— Rural Shared Freight Network, Maharashtra</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/app"
              className={`transition ${isPrimaryMode ? "hover:text-white" : "hover:text-slate-900"}`}
            >
              Booking Form
            </Link>
            <Link
              to="/driver"
              className={`transition ${isPrimaryMode ? "hover:text-white" : "hover:text-slate-900"}`}
            >
              Driver Portal
            </Link>
            <Link
              to="/admin"
              className={`transition ${isPrimaryMode ? "hover:text-white" : "hover:text-slate-900"}`}
            >
              Admin HQ
            </Link>
            <button
              type="button"
              onClick={() => setShowHelplineModal(true)}
              className={`${accentText} hover:underline font-bold`}
            >
              1800-VELQORA
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
