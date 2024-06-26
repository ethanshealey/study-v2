import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const appAdmin = initializeApp(firebaseConfig, 'admin-' + Math.random() * 100);

const verifyAccessToken = async (token: string) => {
    const decodedToken = await getAuth(appAdmin).verifyIdToken(token)
    return decodedToken
}

export { verifyAccessToken }