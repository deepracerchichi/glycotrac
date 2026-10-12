import { inter, mono } from "@/components/landing/fonts";
import Navbar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import Ticker from "@/components/landing/Ticker";
import Overview from "@/components/landing/Overview";
import Statement from "@/components/landing/Statement";
import Principles from "@/components/landing/Principles";
import WeekTable from "@/components/landing/WeekTable";
import Rows from "@/components/landing/Rows";
import Steps from "@/components/landing/Steps";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main
      className={`${inter.variable} ${mono.variable} font-landing [&_h1]:font-landing [&_h2]:font-landing [&_h3]:font-landing bg-paper text-ink`}
    >
      <Navbar />
      <Hero />
      <Ticker />
      <Overview />
      <Statement />
      <Principles />
      <WeekTable />
      <Rows />
      <Steps />
      <FinalCta />
      <Footer />
    </main>
  );
}