export function AppFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container py-10 text-xs text-white/60">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DERKERK</p>
          <p>Black / White two-tone commerce.</p>
        </div>
      </div>
    </footer>
  );
}

