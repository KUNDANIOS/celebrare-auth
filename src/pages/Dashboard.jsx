import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EventGrid from "../components/EventGrid";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.navLogo}>⬡ AuthApp</span>
        <div style={s.navRight}>
          <img src={user?.photo} alt="avatar" style={s.avatar} />
          <span style={s.navName}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}
            onMouseEnter={e => { e.currentTarget.style.background="#000"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#1d1d1f"; }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <main style={s.main}>
        <p style={s.eyebrow}>CELEBRARE DASHBOARD</p>
        <div style={s.heroRow}>
          <div>
            <h1 style={s.heading}>
              Hello, <span style={s.nameBlue}>{user?.name?.split(" ")[0]}</span>
            </h1>
            <p style={s.sub}>{user?.email}</p>
          </div>
          <button
            onClick={() => navigate("/gallery")}
            style={s.galleryBtn}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
             Open Wedding Gallery →
          </button>
        </div>

        <div style={s.divider} />
        <h2 style={s.sectionTitle}>Wedding Events & Launches</h2>
        <EventGrid />
      </main>
    </div>
  );
}

const s = {
  root: { minHeight:"100vh", background:"#f5f5f7", fontFamily:"-apple-system,'Helvetica Neue',sans-serif", color:"#1d1d1f" },
  nav: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px", height:"52px", background:"rgba(245,245,247,0.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid #d2d2d7", position:"sticky", top:0, zIndex:100 },
  navLogo: { fontSize:"16px", fontWeight:700, letterSpacing:"-0.3px" },
  navRight: { display:"flex", alignItems:"center", gap:"14px" },
  avatar: { width:"26px", height:"26px", borderRadius:"50%", border:"1.5px solid #d2d2d7" },
  navName: { fontSize:"13px", color:"#6e6e73" },
  logoutBtn: { padding:"6px 16px", fontSize:"12px", fontWeight:500, background:"transparent", border:"1px solid #1d1d1f", color:"#1d1d1f", borderRadius:"20px", cursor:"pointer", transition:"all 0.2s ease" },
  main: { maxWidth:"980px", margin:"0 auto", padding:"60px 24px" },
  eyebrow: { fontSize:"11px", letterSpacing:"4px", color:"#c9956c", margin:"0 0 12px", fontWeight:600 },
  heroRow: { display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"20px", marginBottom:"8px" },
  heading: { fontSize:"48px", fontWeight:700, letterSpacing:"-1.5px", margin:"0 0 8px", lineHeight:1 },
  nameBlue: { color:"#0071e3" },
  sub: { fontSize:"15px", color:"#6e6e73", margin:0 },
  galleryBtn: {
    padding:"12px 28px", fontSize:"14px", fontWeight:600,
    background:"linear-gradient(135deg, #c9956c, #d4a574)",
    border:"none", borderRadius:"12px",
    color:"#fff", cursor:"pointer",
    boxShadow:"0 4px 16px rgba(201,149,108,0.3)",
    transition:"opacity 0.2s ease",
    whiteSpace:"nowrap",
  },
  divider: { height:"1px", background:"#d2d2d7", margin:"40px 0" },
  sectionTitle: { fontSize:"22px", fontWeight:700, margin:"0 0 20px", letterSpacing:"-0.5px" },
};