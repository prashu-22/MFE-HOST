import { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";

import { checkRemote } from "./CheckRemote";
import { RemoteErrorBoundary } from "./RemoteErrorBoundary";

/* ---------------- REMOTE IMPORTS ---------------- */

// Webpack Module Federation dynamic imports
const ReactRemoteApp1 = lazy(() => import("reactRemote1/App"));
const ReactRemoteApp2 = lazy(() => import("reactRemote2/App"));

/* ---------------- REMOTE ENTRY URLS ---------------- */

const REMOTES = {
  react1: "https://remote-1-prashu.vercel.app/remoteEntry.js",
  react2: "https://remote-2-prashu.vercel.app/remoteEntry.js",
};

/* ================================================== */
/* ================= APP CONTENT ==================== */
/* ================================================== */

function AppContent() {
  const location = useLocation();

  /* ---------- REMOTE AVAILABILITY ---------- */
  const [remoteStatus, setRemoteStatus] = useState({});
  const [remoteError, setRemoteError] = useState(null);

  /* ---------- LAST ROUTE STATE (IMPORTANT) ---------- */
  const [lastRoutes, setLastRoutes] = useState(() => {
    const saved = sessionStorage.getItem("mfe:lastRoutes");

    return saved
      ? JSON.parse(saved)
      : {
          react1: "/react1",
          react2: "/react2",
        };
  });

  /* ---------- TRACK ROUTE CHANGES ---------- */
  useEffect(() => {
    const path = location.pathname;
console.log("Pathname:", path);
    setLastRoutes((prev) => {
      let updated = prev;

      if (path.startsWith("/react1")) {
        updated = { ...prev, react1: path };
      }

      if (path.startsWith("/react2")) {
        updated = { ...prev, react2: path };
      }

      sessionStorage.setItem("mfe:lastRoutes", JSON.stringify(updated));
      return updated;
    });
  }, [location.pathname]);
  useEffect(() => {
  const handler = (e) => {
    const { app, path } = e.detail;

    setLastRoutes((prev) => {
      const updated = { ...prev, [app]: path };
      sessionStorage.setItem("mfe:lastRoutes", JSON.stringify(updated));
      return updated;
    });
  };

  window.addEventListener("mfe:route-change", handler);
  return () => window.removeEventListener("mfe:route-change", handler);
}, []);


  /* ---------- CHECK IF REMOTES ARE ONLINE ---------- */
  useEffect(() => {
    Object.entries(REMOTES).forEach(([name, url]) => {
      checkRemote(url)
        .then((ok) =>
          setRemoteStatus((s) => ({ ...s, [name]: ok }))
        )
        .catch(() =>
          setRemoteStatus((s) => ({ ...s, [name]: false }))
        );
    });
  }, []);

  /* ---------- CLEAR ERROR ON NAVIGATION ---------- */
  useEffect(() => {
    setRemoteError(null);
  }, [location.pathname]);

  /* ---------- BLOCK NAVIGATION IF REMOTE DOWN ---------- */
  const handleRemoteClick = (name) => (e) => {
    if (remoteStatus[name] === false) {
      e.preventDefault();
      setRemoteError(
        `❌ Remote "${name}" is unavailable.\nPlease start the remote server.`
      );
    }
  };

  /* ================================================== */
  /* ===================== UI ========================= */
  /* ================================================== */

  return (
    <div style={styles.app}>
      {/* ---------------- HEADER ---------------- */}
      <header style={styles.header}>
        <h2>🧩 MFE Host Shell</h2>

        <nav style={styles.nav}>
          <NavLink to="/" style={navStyle}>
            Home
          </NavLink>

          <NavLink
            to={lastRoutes.react1}
            onClick={handleRemoteClick("react1")}
            style={navStyle}
          >
            React Remote 1
          </NavLink>

          <NavLink
            to={lastRoutes.react2}
            onClick={handleRemoteClick("react2")}
            style={navStyle}
          >
            React Remote 2
          </NavLink>
        </nav>
      </header>

      {/* ---------------- ERROR ---------------- */}
      {remoteError && <div style={styles.error}>{remoteError}</div>}

      {/* ---------------- CONTENT ---------------- */}
      <main style={styles.content}>
        <Routes>
          <Route
            path="/"
            element={
              <div style={styles.card}>
                <h2>Welcome 👋</h2>
                <p>
                  This is the <strong>Host Application</strong> using
                  <strong> Webpack Module Federation</strong>.
                </p>
              </div>
            }
          />

          {/* ---------- REACT REMOTE 1 ---------- */}
          {remoteStatus.react1 && (
            <Route
              path="/react1/*"
              element={
                <RemoteErrorBoundary name="React Remote 1">
                  <Suspense fallback={<h3>Loading Remote 1...</h3>}>
                    <div style={styles.remoteCard}>
                      <ReactRemoteApp1
                        standalone={false}
                        basename="/react1"
                      />
                    </div>
                  </Suspense>
                </RemoteErrorBoundary>
              }
            />
          )}

          {/* ---------- REACT REMOTE 2 ---------- */}
          {remoteStatus.react2 && (
            <Route
              path="/react2/*"
              element={
                <RemoteErrorBoundary name="React Remote 2">
                  <Suspense fallback={<h3>Loading Remote 2...</h3>}>
                    <div style={styles.remoteCard}>
                      <ReactRemoteApp2
                        standalone={false}
                        basename="/react2"
                      />
                    </div>
                  </Suspense>
                </RemoteErrorBoundary>
              }
            />
          )}
        </Routes>
      </main>
    </div>
  );
}

/* ================================================== */
/* ================= ROOT APP ======================= */
/* ================================================== */

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


const styles = {
  app: {
    minHeight: "100vh",
    background: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 16px",
    background: "#1f2937",
    color: "#fff",
  },
  nav: {
    display: "flex",
    gap: 16,
  },
  content: {
    padding: 32,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    maxWidth: 600,
    width: "100%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  remoteCard: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    width: "100%",
    maxWidth: 800,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 12,
    margin: "16px auto",
    maxWidth: 800,
    borderRadius: 6,
    whiteSpace: "pre-line",
  },
};

const navStyle = ({ isActive }) => ({
  color: "#fff",
  textDecoration: "none",
  padding: "6px 12px",
  borderRadius: 6,
  background: isActive ? "#2563eb" : "transparent",
});