import Reveal from "./Reveal";
import ArrowButton from "./ArrowButton";

export default function FinalCta() {
  return (
    <section className="bg-pine px-6 py-24 text-center text-white md:py-32">
      <Reveal className="mx-auto max-w-4xl">
        <h2 className="text-5xl font-normal leading-tight tracking-tight md:text-7xl">
          See what your day could look like with <span className="text-flame">glycotrac.</span>
        </h2>
        <div className="mt-10 flex justify-center">
          <ArrowButton href="/signup">Create your free account</ArrowButton>
        </div>
      </Reveal>
    </section>
  );
}