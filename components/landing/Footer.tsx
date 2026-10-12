import Link from "next/link";
import Wordmark from "@/components/ui/WordMark";

export default function Footer() {
  return (
    <footer className="bg-forest px-6 py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-base text-white/70">
            DiaTrack is a tracking tool, not medical advice. Always follow your doctor&apos;s or pharmacist&apos;s instructions.
          </p>
        </div>

        <div className="grid content-start gap-3">
          <p className="text-sm text-white/60">Product</p>
          <a href="#features" className="text-lg">Features</a>
          <a href="#how" className="text-lg">How it works</a>
        </div>

        <div className="grid content-start gap-3">
          <p className="text-sm text-white/60">Account</p>
          <Link href="/login" className="text-lg">Log in</Link>
          <Link href="/signup" className="text-lg">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}