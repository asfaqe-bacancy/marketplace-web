import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// // Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STOR  AGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };
const firebaseConfig = {
  apiKey: "AIzaSyCH53_qtcXuER_KhFLMKeE9-cJpfmYTLDQ",
  authDomain: "market-app-8b717.firebaseapp.com",
  projectId: "market-app-8b717",
  storageBucket: "market-app-8b717.firebasestorage.app",
  messagingSenderId: "1037030180763",
  appId: "1:1037030180763:web:6491ac0c5bdd5e7712833e",
};

let messaging: any;

export const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig);

  try {
    if (typeof window !== "undefined") {
      messaging = getMessaging(app);
    }
  } catch (error) {
    console.error("Firebase messaging error:", error);
  }
};

export const requestNotificationPermission = async () => {
  try {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BGQ_GrGzpK-zcBI43tM7Y_djO0ff1cpzMFQzfPnHMTmRXxKx7BnCgULjZgaDSSlghIrkaklkl7K5oXv7KXph_cs",
        });

        console.log("FCM Token:", token);
        localStorage.setItem("fcm_token", token);

        onMessage(messaging, (payload) => {
          console.log("Message received in foreground:", payload);

          // Display notification manually for foreground messages
          if (payload.notification) {
            const { title, body } = payload.notification;
            new Notification(title || "New Notification", {
              body: body || "",
              icon: "/icon.png", // Path to your notification icon
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

// Function to handle incoming notifications
export const handleIncomingNotification = (notification: any) => {
  console.log("Received notification:", notification);
  // Add your custom notification handling logic here
};
