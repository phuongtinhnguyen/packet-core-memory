export default function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item) => (
        <div className="moment" key={item.date}>
          <time>{item.date}</time>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
