import Link from "next/link";
import Wordmark from "@/components/ui/WordMark";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav aria-label="Primary" className="mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-2xl bg-white px-3 py-2.5 sm:px-4 sm:py-3 shadow-lg ring-1 ring-black/5 md:grid md:grid-cols-3">
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="font-medium">Features</a>
          <a href="#how" className="font-medium">How it works</a>
        </div>

        <Link href="/" className="md:justify-self-center">
          <Wordmark />
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:justify-self-end">
          <Link href="/login" className="flex min-h-12 items-center whitespace-nowrap px-2 font-medium sm:px-3">
            Log in
          </Link>
          <Link href="/signup" className="flex min-h-12 items-center whitespace-nowrap rounded-xl bg-mint px-4 font-bold text-forest transition hover:bg-mint/80 sm:px-5">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}