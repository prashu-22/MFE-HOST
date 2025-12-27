// import { Suspense, lazy, useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
// import { checkRemote } from "./CheckRemote";
// import { RemoteErrorBoundary } from "./RemoteErrorBoundary";

// const ReactRemoteApp1 = lazy(() => import("reactRemote1/App"));
// const ReactRemoteApp2 = lazy(() => import("reactRemote2/App"));

// const REMOTES = {
//   react1: "http://localhost:3001/remoteEntry.js",
//   react2: "http://localhost:3002/remoteEntry.js"
// };

// function AppContent() {
//   const [remoteStatus, setRemoteStatus] = useState({});
//   const [remoteError, setRemoteError] = useState(null); // store only one error
//   const location = useLocation();

//   // Check remote availability
//   useEffect(() => {
//     Object.entries(REMOTES).forEach(([name, url]) => {
//       checkRemote(url)
//         .then((ok) => setRemoteStatus((s) => ({ ...s, [name]: ok })))
//         .catch(() => setRemoteStatus((s) => ({ ...s, [name]: false })));
//     });
//   }, []);

//   // Clear error when route changes
//   useEffect(() => {
//     setRemoteError(null);
//   }, [location.pathname]);

// const handleRemoteClick = (name) => (e) => {
//   // Check if remote is loaded or failed
//   const status = remoteStatus[name];

//   if (status === false) { // definitely unavailable
//     e.preventDefault(); // block navigation
//     setRemoteError(
//       `❌ Remote "${name}" is currently unavailable. 
// Please check if the server is running and CORS is configured correctly.`
//     );
//   }
//   // If status is true or still undefined (loading), let navigation happen
// };

//   return (
//     <>
//       <h1>Host Shell</h1>

//       <nav style={{ display: "flex", gap: 10 }}>
//         <Link to="/">Home</Link>

//         <Link
//           to="/react1"
//           onClick={handleRemoteClick("react1")}
//           style={{
            
//             cursor: "pointer"
//           }}
//         >
//           React Remote 1
//         </Link>

//         <Link
//           to="/react2"
//           onClick={handleRemoteClick("react2")}
//           style={{
           
//             cursor: "pointer"
//           }}
//         >
//           React Remote 2
//         </Link>
//       </nav>

//       {/* Show only one error at a time */}
//       {remoteError && (
//         <div style={{ color: "red", marginTop: 10, whiteSpace: "pre-line" }}>
//           {remoteError}
//         </div>
//       )}

//       <Routes>
//         <Route path="/" element={<h2>🏠 Host Home</h2>} />

       
//   {remoteStatus.react1 && (
//     <Route
//       path="/react1/*"
//       element={
//         <RemoteErrorBoundary name="React Remote 1">
//           <Suspense fallback={<h2>Loading React Remote 1...</h2>}>
//             <ReactRemoteApp1 />
//           </Suspense>
//         </RemoteErrorBoundary>
//       }
//     />
//   )}

//   {remoteStatus.react2 && (
//     <Route
//       path="/react2/*"
//       element={
//         <RemoteErrorBoundary name="React Remote 2">
//           <Suspense fallback={<h2>Loading React Remote 2...</h2>}>
//             <ReactRemoteApp2 />
//           </Suspense>
//         </RemoteErrorBoundary>
//       }
//     />
//   )}
// </Routes>

     
//     </>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AppContent />
//     </BrowserRouter>
//   );
// }
import { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  NavLink,
} from "react-router-dom";
import { checkRemote } from "./CheckRemote";
import { RemoteErrorBoundary } from "./RemoteErrorBoundary";
import NextAppIframe from "./components/NextAppIframe";


const ReactRemoteApp1 = lazy(() => import("reactRemote1/App"));
const ReactRemoteApp2 = lazy(() => import("reactRemote2/App"));

const REMOTES = {
  react1: "http://localhost:3001/remoteEntry.js",
  react2: "http://localhost:3002/remoteEntry.js",
};

function AppContent() {
  const [remoteStatus, setRemoteStatus] = useState({});
  const [remoteError, setRemoteError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    Object.entries(REMOTES).forEach(([name, url]) => {
      checkRemote(url)
        .then((ok) => setRemoteStatus((s) => ({ ...s, [name]: ok })))
        .catch(() => setRemoteStatus((s) => ({ ...s, [name]: false })));
    });
  }, []);

  useEffect(() => {
    setRemoteError(null);
  }, [location.pathname]);

  const handleRemoteClick = (name) => (e) => {
    if (remoteStatus[name] === false) {
      e.preventDefault();
      setRemoteError(
        `❌ Remote "${name}" is unavailable.\nPlease start the remote server.`
      );
    }
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <h2 style={{ margin: 0 }}>🧩 MFE Host Shell</h2>

        <nav style={styles.nav}>
          <NavLink to="/" style={navStyle}>
            Home
          </NavLink>

          <NavLink
            to="/react1"
            onClick={handleRemoteClick("react1")}
            style={navStyle}
          >
            React Remote 1
          </NavLink>

          <NavLink
            to="/react2"
            onClick={handleRemoteClick("react2")}
            style={navStyle}
          >
            React Remote 2
          </NavLink>
        </nav>
      </header>

      {/* ERROR */}
      {remoteError && (
        <div style={styles.error}>{remoteError}</div>
      )}

      {/* CONTENT */}
      <main style={styles.content}>
        <Routes>
          <Route
            path="/"
            element={
              <div style={styles.card}>
                <h2>Welcome 👋</h2>
                <p>
                  This is the <strong>Host Application</strong>.  
                  It dynamically loads Micro Frontends using
                  <strong> Webpack Module Federation</strong>.
                </p>
              </div>
            }
          />

          {remoteStatus.react1 && (
            <Route
              path="/react1/*"
              element={
                <RemoteErrorBoundary name="React Remote 1">
                  <Suspense fallback={<h3>Loading Remote 1...</h3>}>
                    <div style={styles.remoteCard}>
                      <ReactRemoteApp1 standalone={false} />
                    </div>
                  </Suspense>
                </RemoteErrorBoundary>
              }
            />
          )}

          {remoteStatus.react2 && (
            <Route
              path="/react2/*"
              element={
                <RemoteErrorBoundary name="React Remote 2">
                  <Suspense fallback={<h3>Loading Remote 2...</h3>}>
                    <div style={styles.remoteCard}>
                      <ReactRemoteApp2 standalone={false}/>
                    </div>
                  </Suspense>
                </RemoteErrorBoundary>
              }
            />
          )}
            {/* Next App Router remote via iframe */}
  <Route
    path="/next/*"
    element={
      <div style={styles.remoteCard}>
        <NextAppIframe route="/" />
      </div>
    }
  />

        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

/* ---------------- STYLES ---------------- */

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
    padding: "16px 32px",
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
