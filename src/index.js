import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GlobalCss from "./Component/GlobalCss";

import App from "./App";
import { SocketProvider } from "./context/SocketContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <SocketProvider>
        <GlobalCss>
          <App />
        </GlobalCss>
      </SocketProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
  // </React.StrictMode>
);
