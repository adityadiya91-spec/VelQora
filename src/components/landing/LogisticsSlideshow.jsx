import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Truck,
  Package,
  Boxes,
  Pause,
  Play,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const SLIDES = [
  {
    id: "truck-corridor",
    type: "truck",
    badge: "Western Maharashtra Corridor",
    title: "Two-Way Cargo Pooling Along Regional Highways",
    subtitle: "High-frequency freight carriers connecting rural clusters",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
    features: ["Zero Dead-Head Mileage", "Pay strictly by load share"],
    location: "Baramati - Phaltan Highway",
  },
  {
    id: "packaging-crates",
    type: "packaging",
    badge: "Standardized Agro Packaging",
    title: "Protective Crating for Agricultural Produce & Dairy",
    subtitle: "Durable ventilated plastic crates and secure produce containers",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    features: ["Zero in-transit spillage", "Color-coded regional batching"],
    location: "Baramati Mandi Sorting Yard",
  },
  {
    id: "truck-tempo",
    type: "truck",
    badge: "Rural Micro-Fleet",
    title: "Shared Mini Tempos for Village-to-Mandi Drops",
    subtitle: "Ideal for 20kg to 350kg agricultural and retail consignments",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    features: ["Scheduled morning departures", "No full-tempo penalty fee"],
    location: "Indapur - Daund Sector",
  },
  {
    id: "packaging-boxes",
    type: "packaging",
    badge: "MSME Parcel Packaging",
    title: "Reinforced Corrugated Box Packaging for Commercial Goods",
    subtitle: "Tamper-evident strapping and barcode consignment identification",
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80",
    features: ["Industrial grade strapping", "Verified recipient handoff"],
    location: "MIDC Cluster Hub",
  },
  {
    id: "truck-heavy",
    type: "truck",
    badge: "Inter-District Freight",
    title: "High-Capacity Shared Trucks for Mandi Bulk Shipments",
    subtitle: "Consolidated multi-farmer transport to Pune and Solapur markets",
    image:
      "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=1200&q=80",
    features: ["Up to 55% fare reduction", "Live status updates via SMS"],
    location: "Jejuri Mandi Route",
  },
  {
    id: "packaging-hub",
    type: "packaging",
    badge: "Hub Sorting & Packaging",
    title: "Automated Parcel Weighing & Consignment Bundling",
    subtitle: "Physical verification and weighing at regional drop-off counters",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    features: ["Calibrated electronic scales", "Instant printed & SMS e-receipt"],
    location: "Phaltan Aggregation Counter",
  },
];

export function LogisticsSlideshow() {
  const { isPrimaryMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4200);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const activeSlide = SLIDES[currentIndex];

  // Theme-dependent colors
  const accentColor = isPrimaryMode ? "#CCFF00" : "#FF6600";
  const accentBg = isPrimaryMode ? "bg-[#CCFF00]" : "bg-[#FF6600]";
  const accentText = isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]";
  const containerBorder = isPrimaryMode ? "border-white/15" : "border-orange-200";
  const containerBg = isPrimaryMode ? "bg-white/5" : "bg-white";

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border ${containerBorder} ${containerBg} shadow-2xl group transition-all duration-300`}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides Viewport */}
      <div className="relative w-full h-80 sm:h-[420px] overflow-hidden bg-black/60">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-black/50 to-black/20 p-5 sm:p-8 flex flex-col justify-between pointer-events-none">
          
          {/* Top Bar inside Slide */}
          <div className="flex items-center justify-between w-full pointer-events-auto">
            {/* Slide Type Pill (Truck vs Packaging) */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                  activeSlide.type === "truck"
                    ? isPrimaryMode
                      ? "bg-[#0052FF] text-white"
                      : "bg-[#FF6600] text-white"
                    : isPrimaryMode
                    ? "bg-[#CCFF00] text-black"
                    : "bg-white text-[#FF6600] border border-orange-300"
                }`}
              >
                {activeSlide.type === "truck" ? (
                  <Truck size={13} />
                ) : (
                  <Package size={13} />
                )}
                <span>{activeSlide.type === "truck" ? "Truck Fleet" : "Packaging & Crates"}</span>
              </span>

              <span className="text-[11px] font-semibold text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline">
                {activeSlide.location}
              </span>
            </div>

            {/* Play/Pause & Counter */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs text-white">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-white text-white/80 transition"
                title={isPlaying ? "Pause Slideshow" : "Resume Slideshow"}
                aria-label={isPlaying ? "Pause Slideshow" : "Resume Slideshow"}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <span className="font-mono text-[11px] font-bold">
                0{currentIndex + 1} / 0{SLIDES.length}
              </span>
            </div>
          </div>

          {/* Bottom Caption Information */}
          <div className="space-y-2 pointer-events-auto max-w-xl">
            <span
              className={`text-xs font-bold uppercase tracking-widest ${accentText} block drop-shadow-sm`}
            >
              {activeSlide.badge}
            </span>
            <h3 className="font-heading font-black text-lg sm:text-2xl text-white leading-tight drop-shadow-md">
              {activeSlide.title}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm line-clamp-1 sm:line-clamp-2 drop-shadow">
              {activeSlide.subtitle}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-white/90">
              {activeSlide.features.map((feat, fidx) => (
                <span key={fidx} className="flex items-center gap-1.5 font-medium drop-shadow">
                  <CheckCircle2 size={14} className={accentText} />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all active:scale-90 opacity-90 group-hover:opacity-100"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all active:scale-90 opacity-90 group-hover:opacity-100"
          aria-label="Next Slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Bottom Thumbnail / Indicator Bar */}
      <div
        className={`px-4 py-3 flex items-center justify-between gap-2 border-t ${
          isPrimaryMode
            ? "border-white/10 bg-[#121622]/90"
            : "border-orange-100 bg-[#FFF7ED]"
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {SLIDES.map((slide, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  isCurrent
                    ? isPrimaryMode
                      ? "bg-[#CCFF00] text-black shadow-md scale-105"
                      : "bg-[#FF6600] text-white shadow-md scale-105"
                    : isPrimaryMode
                    ? "text-white/60 hover:text-white bg-white/5"
                    : "text-slate-600 hover:text-slate-900 bg-white border border-slate-200"
                }`}
              >
                {slide.type === "truck" ? <Truck size={12} /> : <Package size={12} />}
                <span>
                  {idx + 1}. {slide.type === "truck" ? "Truck" : "Packaging"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Auto-play Indicator Dot */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isPlaying ? "animate-pulse" : ""
            } ${accentBg}`}
          />
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isPrimaryMode ? "text-white/60" : "text-slate-500"
            }`}
          >
            {isPlaying ? "Slideshow live" : "Paused"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LogisticsSlideshow;
