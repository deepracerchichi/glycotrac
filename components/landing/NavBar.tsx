import Link from "next/link";
import Wordmark from "@/components/ui/WordMark";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 md:grid md:grid-cols-3">
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="font-medium">Features</a>
          <a href="#how" className="font-medium">How it works</a>
        </div>

        <Link href="/" className="md:justify-self-center">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-2 md:justify-self-end">
          <Link href="/login" className="flex min-h-12 items-center px-3 font-medium">
            Log in
          </Link>
          <Link href="/signup" className="flex min-h-12 items-center rounded-xl bg-mint px-5 font-bold text-forest">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}