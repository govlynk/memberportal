import React, { useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Layout } from "./components/layout/Layout";
import { useAuthStore } from "./stores/authStore";
import "@aws-amplify/ui-react/styles.css";

function App({ user, signOut }) {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    if (user) {
      initializeAuth(user);
    }
  }, [user, initializeAuth]);

  return <Layout signOut={signOut} />;
}

export default withAuthenticator(App);