import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Layers,
  PhoneCall,
  CreditCard,
  BarChart3,
  Menu,
  X,
  Play,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/design/BrandMark";
import { ThemeToggle } from "@/components/design/ThemeToggle";

export default function AdminRoute() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { runMatchingEngine } = useData();
  const { isPrimaryMode } = useTheme();
  const [engineMessage, setEngineMessage] = useState("");
  const location = useLocation();

  const navItems = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin/analytics", label: "Analytics & KPIs", icon: BarChart3 },
    { to: "/admin/bookings", label: "Consignments", icon: Package },
    { to: "/admin/shared-trips", label: "Shared Route Runs", icon: Layers },
    { to: "/admin/parcels", label: "Parcel Inventory", icon: Package },
    { to: "/admin/entrepreneurs", label: "Entrepreneurs", icon: Users },
    { to: "/admin/drivers", label: "Carriers & Drivers", icon: Truck },
    { to: "/admin/ivr", label: "Keypad IVR Simulator", icon: PhoneCall },
    { to: "/admin/payments", label: "Settlements", icon: CreditCard },
  ];

  const handleRunEngine = () => {
    const res = runMatchingEngine();
    setEngineMessage(res.message);
    setTimeout(() => setEngineMessage(""), 4500);
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col md:flex-row transition-colors duration-300",
        isPrimaryMode
          ? "bg-[#07090E] text-white selection:bg-[#CCFF00] selection:text-black"
          : "bg-[#F8FAFC] text-slate-900 selection:bg-[#FF6600] selection:text-white"
      )}
    >
      {/* Sidebar for Desktop */}
      <aside
        className={cn(
          "hidden md:flex w-64 flex-col border-r transition-all shrink-0",
          isPrimaryMode
            ? "border-white/10 bg-[#121622] text-white"
            : "border-orange-200 bg-white text-slate-900 shadow-md"
        )}
      >
        <div
          className={cn(
            "p-5 border-b flex items-center justify-between",
            isPrimaryMode ? "border-white/10" : "border-orange-100"
          )}
        >
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <BrandMark size="sm" />
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wider uppercase font-mono",
                isPrimaryMode
                  ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                  : "bg-[#FF6600]/15 text-[#FF6600] border-[#FF6600]/30"
              )}
            >
              Admin OPS
            </span>
          </Link>
        </div>

        {/* Global Dispatch Trigger */}
        <div
          className={cn(
            "p-4 border-b",
            isPrimaryMode ? "border-white/10 bg-[#0B101D]/70" : "border-orange-100 bg-orange-50/70"
          )}
        >
          <button
            type="button"
            onClick={handleRunEngine}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-heading text-xs font-extrabold transition active:scale-95 shadow-md",
              isPrimaryMode
                ? "bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:bg-[#b8e600]"
                : "bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.3)] hover:bg-[#e65c00]"
            )}
          >
            <Play size={13} className={isPrimaryMode ? "fill-black" : "fill-white"} /> Run Matching Engine
          </button>
          {engineMessage && (
            <p
              className={cn(
                "mt-2 text-[11px] font-semibold animate-fade-in leading-tight",
                isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
              )}
            >
              {engineMessage}
            </p>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition",
                    isActive
                      ? isPrimaryMode
                        ? "bg-[#CCFF00] text-black shadow-md font-extrabold"
                        : "bg-[#FF6600] text-white shadow-md font-extrabold"
                      : isPrimaryMode
                      ? "text-slate-400 hover:bg-white/5 hover:text-white"
                      : "text-slate-600 hover:bg-orange-50 hover:text-slate-900"
                  )
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Session */}
        <div className="p-4 border-t border-white/10">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:border-[#CCFF00]/40 transition"
          >
            <span>Admin Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#121622]/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <BrandMark size="sm" />
            <span className="text-[#CCFF00] text-xs font-bold font-mono">OPS</span>
          </div>
        </div>

        <button
          onClick={handleRunEngine}
          className="rounded-xl bg-[#CCFF00] text-black px-3 py-1.5 text-xs font-extrabold shadow-sm"
        >
          Match Engine
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="w-72 bg-[#121622] border-r border-white/10 h-full p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-heading font-extrabold text-lg text-white">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition",
                        isActive
                          ? "bg-[#CCFF00] text-black font-extrabold"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )
                    }
                  >
                    <item.icon size={16} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <Link
              to="/login"
              className="text-center py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-slate-300 hover:text-white"
            >
              Admin Sign Out
            </Link>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-white/10 bg-[#121622]/90 backdrop-blur-xl px-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">
              Live Rural Cluster: <span className="text-slate-200">Pune–Satara Corridor (6 Active Nodes)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact={true} />
            <span className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-xs font-bold text-slate-200">
              Regional Admin: <span className="text-[#CCFF00]">Maharashtra Central</span>
            </span>
          </div>
        </header>

        {/* Main Routed Outlet */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
