import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-[460px]" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={cn(
            "w-full rounded-3xl bg-[#121622] p-6 sm:p-7 shadow-2xl border border-white/10 text-white relative max-h-[90vh] overflow-y-auto no-scrollbar",
            maxWidth
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              {title ? (
                <h3 className="font-heading text-xl font-extrabold text-white">{title}</h3>
              ) : null}
              {subtitle ? (
                <p className="text-xs text-slate-300 mt-1">{subtitle}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          <div>{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default Modal;
