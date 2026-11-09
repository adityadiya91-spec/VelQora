import { NavLink, Outlet, Link } from "react-router-dom";
import { Home, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import { BrandMark } from "@/components/design/BrandMark";
import { LanguageSwitcher } from "@/components/design/LanguageSwitcher";
import { ThemeToggle } from "@/components/design/ThemeToggle";

export default function TabLayout() {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { isPrimaryMode } = useTheme();

  const tabs = [
    {
      to: "/app",
      label: t("newShipment") || "Book Consignment",
      icon: Home,
      end: true,
    },
    {
      to: "/bookings",
      label: t("bookings"),
      icon: Package,
      end: false,
    },
    {
      to: "/profile",
      label: t("profile"),
      icon: User,
      end: false,
    },
  ];

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-colors duration-300",
        isPrimaryMode
          ? "bg-[#07090E] text-white selection:bg-[#CCFF00] selection:text-black"
          : "bg-[#F8FAFC] text-slate-900 selection:bg-[#FF6600] selection:text-white"
      )}
    >
      {/* Desktop Web Navigation Bar */}
      <header
        className={cn(
          "hidden md:block sticky top-0 z-40 border-b shadow-xl backdrop-blur-xl transition-all duration-300",
          isPrimaryMode
            ? "border-white/10 bg-[#0B0E14]/90 text-white"
            : "border-orange-200 bg-white/95 text-slate-900 shadow-md"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 h-20">
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <BrandMark size="md" />
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav
              className={cn(
                "flex items-center gap-1.5 p-1.5 rounded-2xl border transition-all",
                isPrimaryMode
                  ? "bg-white/5 border-white/10"
                  : "bg-orange-50 border-orange-200"
              )}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.end}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
                        isActive
                          ? isPrimaryMode
                            ? "bg-[#CCFF00] text-black font-extrabold shadow-[0_0_15px_rgba(204,255,0,0.35)]"
                            : "bg-[#FF6600] text-white font-extrabold shadow-[0_0_15px_rgba(255,102,0,0.35)]"
                          : isPrimaryMode
                          ? "text-white/70 hover:text-white hover:bg-white/5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-orange-100/60"
                      )
                    }
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Persona Switcher, Language Switcher, Theme Toggle & Profile Badge */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle compact={true} />
            <LanguageSwitcher compact />

            {/* User Profile Pill */}
            <Link
              to="/profile"
              className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3.5 hover:border-[#CCFF00]/40 transition shadow-xs ml-1"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CCFF00] text-black font-heading font-black text-xs">
                {(profile?.business_name || profile?.full_name || "K")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span className="text-xs font-bold text-white max-w-[120px] truncate">
                {profile?.business_name || profile?.full_name || "Kisan Agro"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Top App Bar with Branding & Quick Toggles */}
      <header
        className={cn(
          "md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b shadow-md backdrop-blur-xl transition-all duration-300",
          isPrimaryMode
            ? "border-white/10 bg-[#0B0E14]/95 text-white"
            : "border-orange-200 bg-white/95 text-slate-900"
        )}
      >
        <Link to="/" className="flex items-center gap-2">
          <BrandMark size="sm" />
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle compact={true} />
          <LanguageSwitcher compact />
          <Link
            to="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCFF00] text-black font-heading font-black text-xs shadow-xs"
            aria-label="Profile"
          >
            {(profile?.business_name || profile?.full_name || "K")
              .slice(0, 2)
              .toUpperCase()}
          </Link>
        </div>
      </header>

      {/* Main Responsive Web Stage */}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile-Only Bottom Tab Navigation Bar */}
      <nav className="md:hidden fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[420px] -translate-x-1/2 pb-safe">
        <div
          className={cn(
            "rounded-2xl border p-1.5 shadow-2xl backdrop-blur-2xl transition-all",
            isPrimaryMode
              ? "border-white/15 bg-[#121622]/95"
              : "border-orange-200 bg-white/95 shadow-xl"
          )}
        >
          <div className="grid grid-cols-3 gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 px-2 text-[11px] font-bold transition-all",
                      isActive
                        ? isPrimaryMode
                          ? "bg-[#CCFF00] text-black font-black shadow-md scale-[1.02]"
                          : "bg-[#FF6600] text-white font-black shadow-md scale-[1.02]"
                        : isPrimaryMode
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-500 hover:text-slate-900"
                    )
                  }
                >
                  <Icon size={18} />
                  <span className="truncate max-w-[85px] leading-tight">{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}