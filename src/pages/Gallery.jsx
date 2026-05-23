import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import VirtualGallery from "../components/VirtualGallery";
import { saveImageMetadata, loadImageMetadata } from "../utils/imageIndexedDb";
import { setCachedImage, isCached } from "../utils/imageCache";

const generateImages = () =>
  Array.from({ length: 100 }, (_, i) => ({
    src: `https://picsum.photos/seed/${i + 1}/400/300`,
    id: i,
  }));

export default function Gallery() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [loadedFromCache, setLoadedFromCache] = useState(false);
  const [cacheCount, setCacheCount] = useState(0);
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/watermark.worker.js", import.meta.url),
      { type: "module" }
    );
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    initGallery();
  }, []);

  const initGallery = async () => {
    try {
      // Try loading from IndexedDB first
      const cached = await loadImageMetadata();

      if (cached && cached.length >= 100) {
        // Load from cache
        const cachedImages = cached.map((item) => {
          setCachedImage(item.id, item.src);
          return { id: item.id, src: item.src };
        });
        cachedImages.sort((a, b) => a.id - b.id);
        setImages(cachedImages);
        setLoadedFromCache(true);
        setCacheCount(cached.length);
      } else {
        // First visit — generate and save to IndexedDB
        const fresh = generateImages();
        setImages(fresh);
        setLoadedFromCache(false);

        // Save to IndexedDB in background
        await saveImageMetadata(fresh);
        setCacheCount(fresh.length);
      }
    } catch (err) {
      // Fallback
      setImages(generateImages());
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleToggleSelect = (index) => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(images.map((_, i) => i));
      setSelectAll(true);
    }
  };

  const downloadWithWatermark = (imageUrl, filename) => {
    return new Promise((resolve) => {
      setDownloading(filename);
      const worker = workerRef.current;

      worker.onmessage = (e) => {
        const { buffer, success } = e.data;
        if (success) {
          const blob = new Blob([buffer], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        }
        setDownloading(null);
        resolve();
      };

      worker.postMessage({ imageUrl, id: filename });
    });
  };

  const handleDownloadSelected = async () => {
    for (const index of selected) {
      await downloadWithWatermark(
        images[index].src,
        `celebrare-${index + 1}.jpg`
      );
    }
  };

  return (
    <div style={s.root}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <span style={s.navLogo} onClick={() => navigate("/dashboard")}>⬡ Celebrare</span>
          <span style={s.navSep}>/</span>
          <span style={s.navCurrent}>Gallery</span>
        </div>
        <div style={s.navRight}>
          <img src={user?.photo} alt="avatar" style={s.avatar} />
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </nav>

      <main style={s.main}>
        {/* Header */}
        <div style={s.headerRow}>
          <div>
            <p style={s.eyebrow}>CELEBRARE</p>
            <h1 style={s.heading}>Wedding Gallery</h1>
            <p style={s.sub}>100 images · Click to preview · Download with watermark</p>
          </div>
          <div style={s.headerActions}>
            {/* Cache indicator */}
            <div style={{
              ...s.cacheBadge,
              background: loadedFromCache ? "#f0fdf4" : "#fff7ed",
              border: `1px solid ${loadedFromCache ? "#86efac" : "#fdba74"}`,
              color: loadedFromCache ? "#166534" : "#9a3412",
            }}>
              {loadedFromCache
                ? `✓ Loaded from IndexedDB cache (${cacheCount} images)`
                : `↓ Fetched from network · Saved to IndexedDB`
              }
            </div>
            <label style={s.selectAllLabel}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                style={{ accentColor: "#c9956c" }}
              />
              <span>Select All</span>
            </label>
          </div>
        </div>

        <div style={s.divider} />

        {/* Virtual Gallery */}
        {images.length > 0 && (
          <VirtualGallery
            images={images}
            onImageClick={setPreview}
            selected={selected}
            onToggleSelect={handleToggleSelect}
          />
        )}
      </main>

      {/* Download tray */}
      {selected.length > 0 && (
        <div style={s.tray}>
          <span style={s.trayText}>{selected.length} image{selected.length > 1 ? "s" : ""} selected</span>
          <button
            style={s.trayBtn}
            onClick={handleDownloadSelected}
            disabled={!!downloading}
          >
            {downloading ? "Processing..." : `Download Selected (${selected.length})`}
          </button>
          <button style={s.trayClear} onClick={() => { setSelected([]); setSelectAll(false); }}>
            Clear
          </button>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div style={s.previewOverlay} onClick={() => setPreview(null)}>
          <div style={s.previewCard} onClick={e => e.stopPropagation()}>
            <img src={preview.src} alt="preview" style={s.previewImg} />
            <div style={s.previewActions}>
              <button
                style={s.previewDownloadBtn}
                onClick={() => downloadWithWatermark(preview.src, `celebrare-${preview.id + 1}.jpg`)}
                disabled={!!downloading}
              >
                {downloading ? "⏳ Processing..." : "⬇ Download with Watermark"}
              </button>
              <button style={s.previewCloseBtn} onClick={() => setPreview(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#f5f5f7", fontFamily: "-apple-system,'Helvetica Neue',sans-serif" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 48px", height: "52px",
    background: "rgba(245,245,247,0.9)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid #d2d2d7", position: "sticky", top: 0, zIndex: 100,
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  navLogo: { fontSize: "16px", fontWeight: 700, cursor: "pointer", color: "#1d1d1f" },
  navSep: { color: "#d2d2d7" },
  navCurrent: { fontSize: "15px", color: "#6e6e73" },
  navRight: { display: "flex", alignItems: "center", gap: "14px" },
  avatar: { width: "26px", height: "26px", borderRadius: "50%", border: "1.5px solid #d2d2d7" },
  logoutBtn: {
    padding: "6px 16px", fontSize: "12px", fontWeight: 500,
    background: "transparent", border: "1px solid #1d1d1f",
    color: "#1d1d1f", borderRadius: "20px", cursor: "pointer",
  },
  main: { maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" },
  headerRow: {
    display: "flex", alignItems: "flex-start",
    justifyContent: "space-between", marginBottom: "20px",
    flexWrap: "wrap", gap: "16px",
  },
  eyebrow: { fontSize: "11px", letterSpacing: "4px", color: "#c9956c", margin: "0 0 8px", fontWeight: 600 },
  heading: { fontSize: "36px", fontWeight: 700, letterSpacing: "-1px", margin: "0 0 6px", color: "#1d1d1f" },
  sub: { fontSize: "14px", color: "#6e6e73", margin: 0 },
  headerActions: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" },
  cacheBadge: {
    fontSize: "12px", fontWeight: 500,
    padding: "8px 14px", borderRadius: "20px",
  },
  selectAllLabel: {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "14px", color: "#1d1d1f", cursor: "pointer",
  },
  divider: { height: "1px", background: "#d2d2d7", marginBottom: "24px" },
  tray: {
    position: "fixed", bottom: "24px", left: "50%",
    transform: "translateX(-50%)",
    background: "#1d1d1f", borderRadius: "16px",
    padding: "14px 24px",
    display: "flex", alignItems: "center", gap: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)", zIndex: 200,
  },
  trayText: { fontSize: "14px", color: "#fff", fontWeight: 500 },
  trayBtn: {
    padding: "8px 20px", fontSize: "13px", fontWeight: 600,
    background: "linear-gradient(135deg, #c9956c, #d4a574)",
    border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer",
  },
  trayClear: {
    padding: "8px 16px", fontSize: "13px",
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px", color: "#fff", cursor: "pointer",
  },
  previewOverlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300,
  },
  previewCard: {
    background: "#fff", borderRadius: "20px",
    overflow: "hidden", maxWidth: "700px", width: "90%",
    boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
  },
  previewImg: { width: "100%", display: "block", maxHeight: "500px", objectFit: "cover" },
  previewActions: {
    display: "flex", gap: "12px", padding: "20px 24px",
    borderTop: "1px solid #f0f0f0",
  },
  previewDownloadBtn: {
    flex: 1, padding: "12px",
    background: "linear-gradient(135deg, #c9956c, #d4a574)",
    border: "none", borderRadius: "10px",
    color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer",
  },
  previewCloseBtn: {
    padding: "12px 20px",
    background: "#f5f5f7", border: "1px solid #d2d2d7",
    borderRadius: "10px", fontSize: "14px", color: "#1d1d1f", cursor: "pointer",
  },
};