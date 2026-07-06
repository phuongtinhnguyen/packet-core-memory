import { letterContent } from "../data/content.js";

export default function Letter() {
  return (
    <section className="letter" aria-label={letterContent.label}>
      <p>{letterContent.body}</p>
    </section>
  );
}
