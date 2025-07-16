// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtqCfby2M31RN3m_B_dwIUyBs2c90b2cI",
  authDomain: "smarthome-img-storage.firebaseapp.com",
  projectId: "smarthome-img-storage",
  storageBucket: "smarthome-img-storage.firebasestorage.app",
  messagingSenderId: "731354616386",
  appId: "1:731354616386:web:130f45bd1c28a8ec1593db",
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Lấy các dịch vụ Firebase mà bạn sẽ dùng ở Frontend
const storage = getStorage(app);
const db = getFirestore(app);

// Export các dịch vụ để các component khác có thể sử dụng
export { app, storage, db };
