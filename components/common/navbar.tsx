import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold">
          AI Photo Enhancer
        </Link>
        <nav className="flex items-center gap-4 text-sm text-secondary">
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/sign-in" className="btn-vine px-4 py-1.5 text-sm">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
