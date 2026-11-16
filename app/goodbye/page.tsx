import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import Wordmark from "@/components/ui/WordMark";
import { fontClasses } from "@/components/shared/fontClasses";

export const metadata: Metadata = { title: "Account deleted" };

export default function GoodbyePage() {
  return (
    <main className={`${fontClasses} grid min-h-screen place-items-center bg-paper px-6 py-12 text-ink`}>
      <div className="w-full max-w-lg">
        <Link href="/" aria-label="Glycotrac home" className="inline-block">
          <Wordmark />
        </Link>

        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-10">
          <span className="grid size-14 place-items-center rounded-full bg-ok-bg text-ok" aria-hidden="true">
            <CircleCheck className="size-8" />
          </span>
          <h1 className="mt-6 text-4xl font-medium tracking-tight">Your account has been deleted</h1>
          <p className="mt-4 text-xl leading-relaxed text-ink/80">
            Your records and your login have been removed. A routine backup at our hosting provider may keep a copy for a short
            time before it expires.
          </p>
          <p className="mt-4 text-xl leading-relaxed text-ink/80">Thank you for trying Glycotrac. Take care of yourself.</p>

          <Link
            href="/"
            className="mt-8 inline-flex min-h-14 items-center rounded-full bg-forest px-8 text-lg font-semibold text-white transition hover:bg-pine"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
