export default function SkeletonCard() {
  return (
    <div style={s.card}>
      <div style={{...s.shimmer, height:"12px", width:"60%", marginBottom:"12px"}} />
      <div style={{...s.shimmer, height:"10px", width:"80%", marginBottom:"8px"}} />
      <div style={{...s.shimmer, height:"10px", width:"50%", marginBottom:"8px"}} />
      <div style={{...s.shimmer, height:"10px", width:"40%"}} />
    </div>
  );
}

const s = {
  card: {
    background:"#fff", border:"1px solid #e5e5ea",
    borderRadius:"14px", padding:"24px",
    animation:"pulse 1.5s ease-in-out infinite",
  },
  shimmer: {
    background:"linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
    backgroundSize:"200% 100%",
    borderRadius:"6px",
    animation:"shimmer 1.5s infinite",
  },
};