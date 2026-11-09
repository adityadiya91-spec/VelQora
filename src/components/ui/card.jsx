import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("rounded-lg border border-hairline bg-white p-5 shadow-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
