import { introContent } from "../data/content.js";

export default function Intro() {
  return (
    <section className="intro" aria-label={introContent.label}>
      <p className="eyebrow">{introContent.eyebrow}</p>
      <h1>{introContent.title}</h1>
      <p className="intro-copy">{introContent.body}</p>
    </section>
  );
}
