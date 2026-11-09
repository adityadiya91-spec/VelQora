// Firebase SDK initialization and helpers
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Firebase Configuration safely read from environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "velqora-2dce7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "velqora-2dce7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "velqora-2dce7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "641577101394",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:641577101394:web:7cb231547c3d86fabd978b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NCJS0W8HJ5",
};

// Initialize Firebase (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Safe Analytics initialization (only in browser environments and if not blocked by client ad-blocker)
export let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics")
    .then(({ getAnalytics, isSupported }) => {
      return isSupported().then((yes) => {
        if (yes) {
          analytics = getAnalytics(app);
        }
      });
    })
    .catch(() => {
      // Safely ignore if blocked by an ad-blocker or privacy extension (ERR_BLOCKED_BY_CLIENT)
    });
}

// ==========================================
// Authentication Helpers
// ==========================================

export async function registerWithEmail(email, password, displayName = "") {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (displayName) {
    try {
      await updateProfile(user, { displayName });
    } catch (err) {
      console.warn("Failed to update displayName:", err);
    }
  }

  // Save initial user profile in Firestore
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      full_name: displayName || user.displayName || "",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("Failed to create user doc in Firestore:", err);
  }

  return user;
}

export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ==========================================
// Firestore User Profile Helpers
// ==========================================

export async function saveUserDoc(uid, data) {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      ...data,
      updated_at: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserDoc(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn("Error fetching user profile from Firestore:", err);
    return null;
  }
}

// ==========================================
// Firestore Bookings Helpers
// ==========================================

export async function saveBookingToFirestore(booking) {
  try {
    const docId = booking.id || booking.parcel_id;
    if (docId) {
      await setDoc(
        doc(db, "bookings", docId),
        {
          ...booking,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );
      return docId;
    } else {
      const docRef = await addDoc(collection(db, "bookings"), {
        ...booking,
        created_at: serverTimestamp(),
      });
      return docRef.id;
    }
  } catch (err) {
    console.warn("Failed to save booking to Firestore:", err);
    return null;
  }
}

export async function fetchUserBookingsFromFirestore(userId) {
  try {
    const q = query(
      collection(db, "bookings"),
      where("user_id", "==", userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (err) {
    console.warn("Failed to fetch bookings from Firestore:", err);
    return [];
  }
}

export default app;
