import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const features = ["Digital Invites", "Video Invites", "Printed Cards", "Photo Sharing", "Wedding Cards"];

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [featureIndex, setFeatureIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    if (user) navigate("/dashboard");
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setFeatureIndex(i => (i + 1) % features.length);
        setFade(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      login(result.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <div style={s.root}>
      {/* Overlay */}
      <div style={s.overlay} />

      {/* Decorative blobs */}
      <div style={s.blobTL} />
      <div style={s.blobBR} />

      {/* Floating ring watermark */}
      <svg style={s.ringWatermark} viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
        <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <circle cx="100" cy="100" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      </svg>

      {/* Card */}
      <div style={{
        ...s.card,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>

        {/* Left panel */}
        <div style={s.left}>
          {/* Floral watermark */}
          <svg style={s.floral} viewBox="0 0 300 300" fill="none">
            <circle cx="150" cy="150" r="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <circle cx="150" cy="150" r="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4"/>
            <circle cx="150" cy="150" r="40" fill="rgba(255,255,255,0.03)"/>
          </svg>

          <div style={s.leftContent}>
            <div style={s.leftBadge}>✦ Est. 2020</div>
            <h1 style={s.leftHeading}>
              Your Dream<br />
              <span style={s.leftAccent}>Wedding</span><br />
              Begins Here
            </h1>
            <p style={s.leftSub}>
              Make your wedding experience exceptional with our{" "}
              <span style={{
                ...s.featureWord,
                opacity: fade ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}>
                {features[featureIndex]}
              </span>
            </p>

            <div style={s.leftStats}>
              <div style={s.stat}>
                <span style={s.statNum}>50K+</span>
                <span style={s.statLabel}>Weddings</span>
              </div>
              <div style={s.statDivider} />
              <div style={s.stat}>
                <span style={s.statNum}>4.9★</span>
                <span style={s.statLabel}>Rating</span>
              </div>
              <div style={s.statDivider} />
              <div style={s.stat}>
                <span style={s.statNum}>200+</span>
                <span style={s.statLabel}>Designs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={s.right}>
          {/* Top logo */}
          <div style={s.logoRow}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z" fill="#c9956c"/>
              <circle cx="12" cy="9" r="2.5" fill="#fff"/>
            </svg>
            <span style={s.logoText}>celebrare</span>
          </div>

          <div style={s.rightBody}>
            <h2 style={s.heading}>Welcome Back</h2>
            <p style={s.subHeading}>
              Sign in to continue creating magical<br />wedding experiences
            </p>

            {/* Divider */}
            <div style={s.divRow}>
              <div style={s.divLine} />
              <span style={s.divLabel}>sign in with</span>
              <div style={s.divLine} />
            </div>

            {/* Social buttons */}
            <div style={s.socialButtons}>
              <button
                style={s.googleBtn}
                onClick={handleGoogleLogin}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,149,108,0.35)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(201,149,108,0.2)";
                }}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="G"/>
                <span>Continue with Google</span>
              </button>

            
            </div>

            {/* Footer links */}
            <p style={s.signupText}>
              New here?{" "}
              <span style={s.signupLink}>
                Start creating your magical wedding invites →
              </span>
            </p>

            <p style={s.terms}>
              By signing in, you agree to our{" "}
              <span style={s.termsLink}>Terms</span> &{" "}
              <span style={s.termsLink}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <p style={s.bottomTag}>✦ Trusted by 50,000+ couples across India ✦</p>
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', -apple-system, sans-serif",
    backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    overflow: "hidden",
    padding: "24px",
  },
  overlay: {
    position: "fixed", inset: 0,
    background: "linear-gradient(135deg, rgba(30,15,10,0.72) 0%, rgba(60,20,30,0.65) 100%)",
    zIndex: 0,
  },
  blobTL: {
    position: "fixed", top: "-100px", left: "-100px",
    width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,149,108,0.15) 0%, transparent 70%)",
    zIndex: 0,
  },
  blobBR: {
    position: "fixed", bottom: "-120px", right: "-80px",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(180,100,120,0.12) 0%, transparent 70%)",
    zIndex: 0,
  },
  ringWatermark: {
    position: "fixed", top: "10%", right: "8%",
    width: "200px", height: "200px", zIndex: 0,
    pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1,
    display: "flex",
    width: "820px",
    maxWidth: "100%",
    minHeight: "480px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
  },
  left: {
    flex: "1.1",
    background: "linear-gradient(145deg, rgba(140,70,50,0.85) 0%, rgba(90,30,40,0.9) 100%)",
    backdropFilter: "blur(20px)",
    padding: "52px 44px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
  },
  floral: {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px", height: "300px",
    pointerEvents: "none",
  },
  leftContent: { position: "relative", zIndex: 1 },
  leftBadge: {
    fontSize: "10px", letterSpacing: "3px",
    color: "rgba(255,220,180,0.7)",
    textTransform: "uppercase", marginBottom: "20px",
    fontWeight: 500,
  },
  leftHeading: {
    fontSize: "38px", fontWeight: 700,
    color: "#fff", lineHeight: 1.2,
    margin: "0 0 16px", letterSpacing: "-0.5px",
  },
  leftAccent: {
    color: "#f0c090",
    fontStyle: "italic",
  },
  leftSub: {
    fontSize: "14px", color: "rgba(255,255,255,0.65)",
    margin: "0 0 36px", lineHeight: 1.6,
  },
  featureWord: {
    color: "#f0c090", fontWeight: 600,
    borderBottom: "1px solid rgba(240,192,144,0.4)",
  },
  leftStats: {
    display: "flex", alignItems: "center", gap: "20px",
  },
  stat: { display: "flex", flexDirection: "column", gap: "2px" },
  statNum: { fontSize: "16px", fontWeight: 700, color: "#fff" },
  statLabel: { fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" },
  statDivider: { width: "1px", height: "28px", background: "rgba(255,255,255,0.15)" },
  right: {
    flex: 1,
    background: "rgba(255,252,248,0.97)",
    backdropFilter: "blur(30px)",
    padding: "44px 44px",
    display: "flex",
    flexDirection: "column",
  },
  logoRow: {
    display: "flex", alignItems: "center", gap: "8px",
    marginBottom: "32px",
  },
  logoText: {
    fontSize: "15px", fontWeight: 700,
    color: "#c9956c", letterSpacing: "2px",
    textTransform: "lowercase",
  },
  rightBody: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
  heading: {
    fontSize: "26px", fontWeight: 700,
    color: "#1a1a1a", margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  subHeading: {
    fontSize: "13px", color: "#999",
    margin: "0 0 28px", lineHeight: 1.6,
  },
  divRow: {
    display: "flex", alignItems: "center",
    gap: "12px", marginBottom: "20px",
  },
  divLine: { flex: 1, height: "1px", background: "#ede8e3" },
  divLabel: { fontSize: "10px", color: "#bbb", letterSpacing: "1.5px", whiteSpace: "nowrap" },
  socialButtons: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" },
  googleBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "10px", padding: "13px 20px",
    background: "linear-gradient(135deg, #c9956c, #d4a574)",
    border: "none", borderRadius: "12px",
    color: "#fff", fontSize: "14px", fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(201,149,108,0.2)",
    letterSpacing: "0.2px",
  },
  altBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "10px", padding: "13px 20px",
    background: "#fff", border: "1.5px solid #ede8e3",
    borderRadius: "12px", color: "#555",
    fontSize: "14px", fontWeight: 500,
    cursor: "pointer", transition: "background 0.2s ease",
  },
  signupText: {
    fontSize: "12px", color: "#999",
    margin: "0 0 16px", lineHeight: 1.5,
  },
  signupLink: {
    color: "#c9956c", fontWeight: 600,
    cursor: "pointer",
  },
  terms: {
    fontSize: "11px", color: "#ccc", margin: 0, lineHeight: 1.6,
  },
  termsLink: {
    color: "#c9956c", cursor: "pointer", textDecoration: "underline",
  },
  bottomTag: {
    position: "relative", zIndex: 1,
    marginTop: "24px", fontSize: "11px",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: "2px",
  },
};