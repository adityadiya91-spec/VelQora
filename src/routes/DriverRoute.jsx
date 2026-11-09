import { NavLink, Outlet, Link } from "react-router-dom";
import { Truck, DollarSign, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/design/BrandMark";
import { ThemeToggle } from "@/components/design/ThemeToggle";
import { LanguageSwitcher } from "@/components/design/LanguageSwitcher";
import { useTheme } from "@/contexts/ThemeContext";

export default function DriverRoute() {
  const { isPrimaryMode } = useTheme();
  const tabs = [
    { to: "/driver", label: "Trips & Corridors", icon: Truck, end: true },
    { to: "/driver/earnings", label: "Settled Earnings", icon: DollarSign, end: false },
    { to: "/driver/profile", label: "Carrier Profile", icon: UserCheck, end: false },
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
      {/* Desktop & Mobile Header Bar - Clean style matching User App */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b shadow-xl backdrop-blur-xl transition-all duration-300",
          isPrimaryMode
            ? "border-white/10 bg-[#0B0E14]/90 text-white"
            : "border-orange-200 bg-white/95 text-slate-900 shadow-md"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/driver" className="flex items-center gap-3 group">
              <BrandMark size="md" />
              <span
                className={cn(
                  "hidden sm:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wider uppercase font-mono transition-colors",
                  isPrimaryMode
                    ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                    : "bg-[#FF6600]/15 text-[#FF6600] border-[#FF6600]/30"
                )}
              >
                Carrier Partner
              </span>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav
              className={cn(
                "hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl border transition-all",
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

          {/* Right Controls: Theme Toggle, Language Switcher, Active Duty, Driver Profile Pill */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle compact={true} />
            <div className="hidden sm:block">
              <LanguageSwitcher compact />
            </div>

            <div className="hidden lg:flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Carrier Active</span>
            </div>

            {/* Driver Profile Pill */}
            <Link
              to="/driver/profile"
              className={cn(
                "flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-3.5 transition shadow-xs ml-1",
                isPrimaryMode
                  ? "border-white/10 bg-white/5 hover:border-[#CCFF00]/40 text-white"
                  : "border-orange-200 bg-orange-50 hover:border-orange-400 text-slate-800"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full font-heading font-black text-xs",
                  isPrimaryMode
                    ? "bg-[#CCFF00] text-black"
                    : "bg-[#FF6600] text-white"
                )}
              >
                RA
              </div>
              <span className="text-xs font-bold max-w-[120px] truncate hidden sm:inline">
                Rajesh Pawar
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>

      {/* Mobile-Only Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-[430px] -translate-x-1/2">
        <div
          className={cn(
            "rounded-2xl border p-2 shadow-2xl backdrop-blur-xl",
            isPrimaryMode
              ? "border-white/15 bg-[#121622]/90"
              : "border-orange-200 bg-white/95"
          )}
        >
          <div className="grid grid-cols-3 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition",
                      isActive
                        ? isPrimaryMode
                          ? "bg-[#CCFF00] text-black font-black shadow-md"
                          : "bg-[#FF6600] text-white font-black shadow-md"
                        : isPrimaryMode
                        ? "text-white/60 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                    )
                  }
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
