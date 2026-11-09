export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-hairline border-t-primary" />
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}