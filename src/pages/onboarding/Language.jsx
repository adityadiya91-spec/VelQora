import { useNavigate } from "react-router-dom";
import { Screen } from "@/components/design/Screen";
import { ScreenHeader } from "@/components/design/ScreenHeader";
import { PillButton } from "@/components/design/PillButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const languages = [
  {
    code: "mr",
    label: "Marathi",
    native: "मराठी",
  },
  {
    code: "hi",
    label: "Hindi",
    native: "हिंदी",
  },
  {
    code: "en",
    label: "English",
    native: "English",
  },
];

export default function Language() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { isAuthenticated, profile } = useProfile();
  const { isPrimaryMode } = useTheme();

  const handleContinue = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!profile) {
      navigate("/profile-setup");
      return;
    }

    navigate("/app");
  };

  return (
    <Screen maxWidth="max-w-lg">
      <ScreenHeader
        title={t("chooseLanguage")}
        subtitle="आपण ती नंतर कधीही बदलू शकता."
        backTo="/welcome"
        showControls={true}
      />

      <div className="space-y-3">
        {languages.map((item) => {
          const isSelected = lang === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLang(item.code)}
              className={cn(
                "w-full rounded-2xl border-2 p-5 text-left transition-all duration-200",
                isSelected
                  ? isPrimaryMode
                    ? "border-[#CCFF00] bg-[#121622] shadow-[0_0_25px_rgba(204,255,0,0.2)] ring-2 ring-[#CCFF00]/30"
                    : "border-[#FF6600] bg-orange-50/80 shadow-md ring-2 ring-[#FF6600]/30"
                  : isPrimaryMode
                  ? "border-white/10 bg-[#121622]/60 hover:bg-[#121622] hover:border-white/20"
                  : "border-slate-200 bg-white hover:border-orange-200 shadow-sm"
              )}
            >
              <p
                className={cn(
                  "font-heading text-xl font-black",
                  isSelected
                    ? isPrimaryMode
                      ? "text-[#CCFF00]"
                      : "text-[#FF6600]"
                    : isPrimaryMode
                    ? "text-white"
                    : "text-slate-900"
                )}
              >
                {item.native}
              </p>

              <p
                className={cn(
                  "mt-1 text-sm font-medium",
                  isPrimaryMode ? "text-slate-400" : "text-slate-500"
                )}
              >
                {item.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <PillButton variant="coral" onClick={handleContinue}>
          {t("continue")}
        </PillButton>
      </div>
    </Screen>
  );
}
