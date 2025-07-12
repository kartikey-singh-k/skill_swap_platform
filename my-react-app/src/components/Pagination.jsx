import React from "react";

function Pagination({ current, total, onChange }) {
  return (
    <div className="pagination">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}>&lt;</button>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={current === i + 1 ? "active" : ""}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => onChange(current + 1)} disabled={current === total}>&gt;</button>
    </div>
  );
}

export default Pagination;
