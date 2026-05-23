import { useState, useEffect, useRef } from "react";

const ITEM_HEIGHT = 220;
const COLUMNS = 4;
const BUFFER = 3;

export default function VirtualGallery({ images, onImageClick, selected, onToggleSelect }) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerHeight(el.clientHeight);

    const handleScroll = () => setScrollTop(el.scrollTop);
    const handleResize = () => setContainerHeight(el.clientHeight);

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const rowCount = Math.ceil(images.length / COLUMNS);
  const totalHeight = rowCount * ITEM_HEIGHT;

  const startRow = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
  const endRow = Math.min(rowCount, Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER);

  const visibleImages = [];
  for (let row = startRow; row < endRow; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const index = row * COLUMNS + col;
      if (index < images.length) {
        visibleImages.push({ ...images[index], index, row, col });
      }
    }
  }

  return (
    <div ref={containerRef} style={s.container}>
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleImages.map((img) => (
          <div
            key={img.index}
            style={{
              ...s.cell,
              position: "absolute",
              top: img.row * ITEM_HEIGHT,
              left: `${(img.col / COLUMNS) * 100}%`,
              width: `${100 / COLUMNS}%`,
            }}
          >
            <div
              style={s.imageWrap}
              onMouseEnter={() => setHoveredIndex(img.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selected.includes(img.index)}
                onChange={() => onToggleSelect(img.index)}
                style={s.checkbox}
                onClick={e => e.stopPropagation()}
              />

              {/* Image — clicking triggers preview */}
              <img
                src={img.src}
                alt={`photo-${img.index}`}
                style={{
                  ...s.img,
                  transform: hoveredIndex === img.index ? "scale(1.05)" : "scale(1)",
                }}
                onClick={() => onImageClick(img)}
              />

              {/* Hover overlay — pointer-events none so it doesn't block clicks */}
              {hoveredIndex === img.index && (
                <div style={s.overlay}>
                  <span style={s.overlayText}>View</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: {
    height: "calc(100vh - 280px)",
    overflowY: "auto",
    overflowX: "hidden",
  },
  cell: {
    padding: "6px",
    boxSizing: "border-box",
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    height: "200px",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    background: "#f0ece8",
  },
  checkbox: {
    position: "absolute",
    top: "8px",
    left: "8px",
    zIndex: 3,
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#c9956c",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none", // ← this is the fix
    borderRadius: "12px",
  },
  overlayText: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    background: "rgba(0,0,0,0.4)",
    padding: "6px 14px",
    borderRadius: "20px",
  },
};