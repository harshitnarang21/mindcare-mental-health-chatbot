import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthProvider";

function AuthActions() {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  if (!user) {
    return (
      <button onClick={signInWithGoogle} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sign in</button>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Hi{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</span>
      <button onClick={signOut} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sign out</button>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: "Home", href: "/#top" },
    { label: "Features", href: "/#features" },
    { label: "Resources", href: "/#resources" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-teal-500 text-white shadow">
            <span className="text-sm font-bold">EM</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight">MINDCARE</div>
            <div className="text-xs text-muted-foreground">Student wellbeing</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
          <AuthActions />
          <a href="/#self-check" className="hidden md:inline-block">
            <Button size="sm">Start Self‑Check</Button>
          </a>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className={cn("border-t md:hidden", open ? "block" : "hidden")}> 
        <div className="mx-auto grid max-w-6xl gap-2 px-4 py-3">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
              {n.label}
            </a>
          ))}
          <div className="px-2 py-2"><AuthActions /></div>
          <a href="/#self-check" className="px-2 py-2">
            <Button className="w-full" size="sm">Start Self‑Check</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
