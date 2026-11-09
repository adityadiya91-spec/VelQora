import { createContext, useContext, useState, useEffect } from "react";
import { getStorage, setStorage } from "@/lib/storage";
import {
  auth,
  subscribeToAuth,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  saveUserDoc,
  getUserDoc,
} from "@/lib/firebase";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("karwan_auth") === "true";
  });

  const [profile, setProfile] = useState(() => {
    return getStorage("karwan_profile", null) || getStorage("velqora_profile", null);
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem("karwan_auth", "true");

        // Load Firestore profile if available
        try {
          const remoteDoc = await getUserDoc(user.uid);
          if (remoteDoc) {
            const merged = {
              ...remoteDoc,
              email: user.email,
              full_name: remoteDoc.full_name || user.displayName || "",
            };
            setProfile(merged);
            setStorage("velqora_profile", merged);
          } else if (!profile) {
            const initial = {
              uid: user.uid,
              email: user.email,
              full_name: user.displayName || "",
            };
            setProfile(initial);
            setStorage("velqora_profile", initial);
          }
        } catch (err) {
          console.warn("Could not fetch remote profile:", err);
        }
      } else {
        // Only mark logged out if not explicitly in local demo session
        const isLocalDemo = localStorage.getItem("karwan_demo_session") === "true";
        if (!isLocalDemo) {
          setIsAuthenticated(false);
          localStorage.removeItem("karwan_auth");
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase Email/Password Login
  const login = async (email, password) => {
    if (email && password) {
      const user = await loginWithEmail(email, password);
      setIsAuthenticated(true);
      localStorage.setItem("karwan_auth", "true");
      localStorage.removeItem("karwan_demo_session");
      return user;
    } else {
      // Offline / Quick login fallback
      localStorage.setItem("karwan_auth", "true");
      localStorage.setItem("karwan_demo_session", "true");
      setIsAuthenticated(true);
      return null;
    }
  };

  // Firebase Email/Password Registration
  const register = async (email, password, displayName = "") => {
    const user = await registerWithEmail(email, password, displayName);
    setIsAuthenticated(true);
    localStorage.setItem("karwan_auth", "true");
    localStorage.removeItem("karwan_demo_session");
    return user;
  };

  // Logout (both Firebase and local storage)
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Error signing out from Firebase:", err);
    }
    localStorage.removeItem("karwan_auth");
    localStorage.removeItem("velqora_auth");
    localStorage.removeItem("karwan_demo_session");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Save profile to local state + Firestore
  const saveProfile = async (data) => {
    const nextProfile = {
      ...profile,
      ...data,
    };

    setProfile(nextProfile);
    setStorage("velqora_profile", nextProfile);

    // If authenticated with Firebase, save to Firestore
    if (currentUser?.uid) {
      try {
        await saveUserDoc(currentUser.uid, nextProfile);
      } catch (err) {
        console.warn("Could not sync profile to Firestore:", err);
      }
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loadingAuth,
        profile,
        login,
        register,
        logout,
        saveProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}