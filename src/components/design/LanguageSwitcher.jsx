import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ compact = false, className }) {
  const { lang, setLang } = useLanguage();

  const languages = [
    { code: "mr", label: "मराठी" },
    { code: "hi", label: "हिंदी" },
    { code: "en", label: "EN" },
  ];

  if (compact) {
    return (
      <div className={cn("inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#0B101D] p-1 shadow-sm", className)}>
        <Globe size={13} className="text-[#CCFF00] ml-1 mr-0.5" />
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-bold transition",
              lang === l.code
                ? "bg-[#CCFF00] text-black shadow-xs font-black"
                : "text-slate-400 hover:text-white"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={cn(
            "rounded-xl border py-3 px-2 text-center font-heading text-sm font-bold transition",
            lang === l.code
              ? "border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00] shadow-sm"
              : "border-white/10 bg-[#0B101D] text-slate-300 hover:border-[#CCFF00]/40 hover:text-white"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
