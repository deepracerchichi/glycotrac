"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ArrowButton from "./ArrowButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const items = [
  "Medication reminders",
  "Refill alerts",
  "One-tap dose logging",
  "Pill counting",
  "Missed-dose alerts",
  "Symptom tracking",
  "Meal logging",
  "Daily schedule",
  "Doctor summaries",
];
const N = items.length;
const looped = [...items, ...items, ...items];

const fade = (distance: number) =>
  distance === 0 ? 1 : Math.max(0.06, 0.3 - (distance - 1) * 0.07);

export default function Ticker() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".ticker-row", track.current);
      const rowH = rows[0].offsetHeight;
      const centerY = viewport.current!.offsetHeight / 2 - rowH / 2;
      let idx = N;

      const goTo = (animate: boolean) => {
        const duration = animate ? 0.6 : 0;

        gsap.to(track.current, {
          y: centerY - idx * rowH,
          duration,
          ease: "power3.inOut",
          overwrite: true,
          onComplete: () => {
            if (idx >= 2 * N) {
              idx -= N;
              goTo(false);
            }
          },
        });

        gsap.to(rows, {
          opacity: (i: number) => fade(Math.abs(i - idx)),
          duration,
          overwrite: true,
        });
      };

      goTo(false);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let inView = false;
        let hovering = false;

        const timer: gsap.core.Tween = gsap.delayedCall(2.2, () => {
          idx += 1;
          goTo(true);
          timer.restart(true);
        });
        timer.pause();

        const sync = () => (inView && !hovering ? timer.restart(true) : timer.pause());

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top 80%",
          end: "bottom 20%",
          onToggle: (self) => {
            inView = self.isActive;
            sync();
          },
        });

        const el = root.current!;
        const enter = () => {
          hovering = true;
          sync();
        };
        const leave = () => {
          hovering = false;
          sync();
        };
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);

        return () => {
          st.kill();
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-paper px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[14rem_1fr_auto] md:gap-12">
        <p className="text-xl leading-snug">glucotrac helps you with:</p>

        <div ref={viewport} aria-hidden="true" className="fade-y h-[22rem] overflow-hidden md:h-[30rem]">
          <ul ref={track} className="will-change-transform">
            {looped.map((label, i) => (
              <li
                key={i}
                className="ticker-row flex h-16 items-center whitespace-nowrap text-2xl tracking-tight sm:text-3xl md:text-5xl"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        <ul className="sr-only">
          {items.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>

        <ArrowButton href="/signup" variant="flame">Get started</ArrowButton>
      </div>
    </section>
  );
}