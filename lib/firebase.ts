import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyALrleCY6KAHjtgIXff-kDFI011ftCRyfM",
  authDomain: "ehabonlineservicecampaigns.firebaseapp.com",
  projectId: "ehabonlineservicecampaigns",
  storageBucket: "ehabonlineservicecampaigns.firebasestorage.app",
  messagingSenderId: "971584507002",
  appId: "1:971584507002:web:ee8ed1ef929c4298c13fc3",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
