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

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };
