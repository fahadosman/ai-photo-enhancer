import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-white/90">Built for stunning AI photo enhancement.</p>
          <p className="mt-1 text-xs text-white/50">Fast, beautiful, and creator-friendly.</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="footer-link-vine">
              Privacy
            </Link>
            <Link href="/terms" className="footer-link-vine">
              Terms
            </Link>
            <Link href="/contact" className="footer-link-vine">
              Contact
            </Link>
            <Link
              href="https://github.com/fahadosman/ai-photo-enhancer"
              target="_blank"
              rel="noreferrer"
              className="footer-link-vine"
            >
              GitHub
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/fahadosman/ai-photo-enhancer"
              target="_blank"
              rel="noreferrer"
              className="footer-social-vine"
              aria-label="GitHub"
            >
              <Github size={16} />
            </Link>
            <Link
              href="https://x.com/fahadosman"
              target="_blank"
              rel="noreferrer"
              className="footer-social-vine"
              aria-label="X"
            >
              <Twitter size={16} />
            </Link>
            <Link
              href="https://instagram.com/fahadosman"
              target="_blank"
              rel="noreferrer"
              className="footer-social-vine"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-4 text-center text-xs text-white/75">
          copyright @fahadusman 2026
        </div>
      </div>
    </footer>
  );
}
