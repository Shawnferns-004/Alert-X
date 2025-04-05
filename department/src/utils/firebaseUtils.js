import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { User } from 'lucide-react';
import { useApi } from '../context/ApiContext';



const firebaseConfig = {
    apiKey: "AIzaSyBwBHVTQy7hm9lrDDTpumlTxgT-fpsr-wU",
    authDomain: "alertx-2024.firebaseapp.com",
    projectId: "alertx-2024",
    storageBucket: "alertx-2024.firebasestorage.app",
    messagingSenderId: "178773306223",
    appId: "1:178773306223:web:bf6e81592f2fe22ac9569a",
    measurementId: "G-6QD8CZK84G"
  };

const vapidKey = "BFR5krkujzEd42B95s-NLvXqX65D7bIM0vYUJBQUKRB4FpHtVm8-67acmJnJNuKLbSRPUyDGKJT-pRED4vke53I"

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app)


export const requestFCMToken = async (userId) => {
  try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
          const token = await getToken(messaging,{ vapidKey: vapidKey });
          if (token) {
            console.log("FCM Token:", token);
      
            // Send the token to the backend
            await axios.post(`${useApi().API_URL}/admin/user/update-fcm-token`, { userId, token });
          }
      } else {
          throw new Error("Notification permission denied.");
      }
  } catch (error) {
      console.error("Error getting FCM token:", error);
      throw error
  }
};


export const onMessageListener = ()=>{
    return new Promise((resolve)=>{
        onMessage(messaging,(payload)=>{
            resolve(payload)
        })
    })
}