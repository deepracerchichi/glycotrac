import Link from "next/link";
import Reveal from "./Reveal";

export default function Statement() {
  return (
    <section className="bg-white px-6 pb-20 md:pb-28">
      <Reveal className="mx-auto max-w-6xl rounded-[2.5rem] bg-sage p-8 md:p-14">
        <p className="max-w-4xl text-3xl leading-tight tracking-tight md:text-5xl">
          Taking medication on time shouldn&apos;t depend on anyone&apos;s memory.
        </p>
        <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* <Link
            href="/signup"
            className="inline-flex min-h-14 items-center rounded-full bg-forest px-8 text-lg font-medium text-white"
          >
            Get started
          </Link> */}
          <p className="max-w-xs text-base text-ink/70">
            glycotrac is a tracking tool, not medical advice.
          </p>
        </div>
      </Reveal>
    </section>
  );
}