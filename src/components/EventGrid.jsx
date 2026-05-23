import { useState, useEffect } from "react";
import events from "../data/events";
import SkeletonCard from "./SkeletonCard";

const LAST_CARD_KEY = "last_viewed_card";

export default function EventGrid() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastViewed, setLastViewed] = useState(
    localStorage.getItem(LAST_CARD_KEY)
  );

  useEffect(() => {
    setTimeout(() => {
      setAllEvents(events);
      setLoading(false);
    }, 1200);
  }, []);

  const handleCardClick = (id) => {
    localStorage.setItem(LAST_CARD_KEY, id);
    setLastViewed(id);
  };

  const filtered = allEvents.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <div style={s.searchWrap}>
        <svg style={s.searchIcon} width="16" height="16" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="#6e6e73" strokeWidth="1.5"/>
          <path d="M13 13l3.5 3.5" stroke="#6e6e73" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          style={s.search}
          placeholder="Search events"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {loading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((event, index) => (
            <div
              key={event.id}
              style={{
                ...s.card,
                ...(lastViewed === event.id ? s.cardActive : {}),
                animationDelay: `${index * 60}ms`,
              }}
              onClick={() => handleCardClick(event.id)}
              onMouseEnter={e => {
                if (lastViewed !== event.id) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = lastViewed === event.id
                  ? "0 0 0 3px rgba(0,113,227,0.15)"
                  : "0 1px 4px rgba(0,0,0,0.05)";
              }}
            >
              {/* Top row */}
              <div style={s.cardTop}>
                <span style={s.cardBadge}>{event.category}</span>
                {lastViewed === event.id && (
                  <span style={s.lastViewedDot}>●</span>
                )}
              </div>

              {/* Title */}
              <h3 style={s.cardTitle}>{event.name}</h3>

              {/* Divider */}
              <div style={s.cardDivider} />

              {/* Meta */}
              <div style={s.cardMeta}>
                <span style={s.metaItem}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="12" rx="2" stroke="#6e6e73" strokeWidth="1.3"/>
                    <path d="M1 7h14" stroke="#6e6e73" strokeWidth="1.3"/>
                    <path d="M5 1v3M11 1v3" stroke="#6e6e73" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {event.date}
                </span>
                <span style={s.metaItem}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1C5.79 1 4 2.79 4 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.21-1.79-4-4-4z" stroke="#6e6e73" strokeWidth="1.3"/>
                    <circle cx="8" cy="5" r="1.5" stroke="#6e6e73" strokeWidth="1.3"/>
                  </svg>
                  {event.location}
                </span>
              </div>

              {/* Learn more link */}
              <div style={s.cardLink}>
                {lastViewed === event.id ? "Last viewed  ›" : "Learn more  ›"}
              </div>
            </div>
          ))
        }
      </div>

      {!loading && filtered.length === 0 && (
        <div style={s.empty}>
          <p style={s.emptyTitle}>No results for "{search}"</p>
          <p style={s.emptySub}>Try a different search term.</p>
        </div>
      )}
    </div>
  );
}

const s = {
  searchWrap: {
    position: "relative",
    marginBottom: "32px",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  search: {
    width: "100%",
    padding: "11px 16px 11px 40px",
    fontSize: "15px",
    border: "1px solid #d2d2d7",
    borderRadius: "10px",
    outline: "none",
    fontFamily: "-apple-system,sans-serif",
    boxSizing: "border-box",
    background: "#fff",
    color: "#1d1d1f",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "12px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e5ea",
    borderRadius: "18px",
    padding: "24px",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  cardActive: {
    border: "1px solid #0071e3",
    boxShadow: "0 0 0 3px rgba(0,113,227,0.15)",
    background: "#f5f9ff",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  cardBadge: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    color: "#0071e3",
    textTransform: "uppercase",
  },
  lastViewedDot: {
    fontSize: "10px",
    color: "#0071e3",
  },
  cardTitle: {
    fontSize: "19px",
    fontWeight: 700,
    color: "#1d1d1f",
    margin: "0 0 16px",
    letterSpacing: "-0.4px",
    lineHeight: 1.2,
  },
  cardDivider: {
    height: "1px",
    background: "#f0f0f5",
    marginBottom: "14px",
  },
  cardMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "16px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13px",
    color: "#6e6e73",
  },
  cardLink: {
    fontSize: "13px",
    color: "#0071e3",
    fontWeight: 500,
  },
  empty: {
    textAlign: "center",
    padding: "60px 0",
  },
  emptyTitle: {
    fontSize: "19px",
    fontWeight: 600,
    color: "#1d1d1f",
    margin: "0 0 8px",
  },
  emptySub: {
    fontSize: "14px",
    color: "#6e6e73",
    margin: 0,
  },
};