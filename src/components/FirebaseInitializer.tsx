"use client";

import React, { useEffect } from "react";
import {
  initializeFirebase,
  requestNotificationPermission,
} from "@/lib/firebase";

export default function FirebaseInitializer() {
  useEffect(() => {
    // Initialize Firebase
    initializeFirebase();

    // Request notification permission
    requestNotificationPermission();

    // Register service worker for push notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}
