"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ArrowButton from "./ArrowButton";
import HeroVisual from "./HeroVisual";

gsap.registerPlugin(useGSAP);

const lines = ["Diabetes care that fits", "your day."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-orbit", { opacity: 0, scale: 0.85, duration: 1.2, stagger: 0.15 }, 0)
          .from(".hero-line", { yPercent: 110, duration: 0.9, stagger: 0.12 }, 0.1)
          .from(".hero-sub", { opacity: 0, y: 20, duration: 0.7 }, 0.6)
          .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, 0.8)
          .from(".hero-screen", { opacity: 0, y: 50, scale: 0.94, duration: 1 }, 0.4)
          .from(
            ".hero-float",
            { opacity: 0, scale: 0.7, y: 24, duration: 0.7, stagger: 0.15, ease: "back.out(1.7)" },
            1
          );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-forest px-6 pb-20 pt-36 text-white md:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-normal leading-[1.02] tracking-tight md:text-7xl">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <span className={`hero-line block ${i === lines.length - 1 ? "text-mint" : ""}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-8 max-w-md text-xl text-white/90">
            glycotrac reminds you when each medication is due, warns you before you run out, and keeps a simple log of how you feel.
          </p>

          <div className="mt-10 flex flex-col items-start gap-6">
            <ArrowButton href="/signup" className="hero-cta">Try glycotrac</ArrowButton>
            <a href="#how" className="hero-cta inline-flex min-h-12 items-center text-lg text-mint underline-offset-4 hover:underline">
              See how it works →
            </a>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}