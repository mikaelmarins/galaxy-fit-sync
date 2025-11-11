import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDApl55HzQwwZIpTadqiY5QF3HaocjFnU",
  authDomain: "app-de-treino-5089f.firebaseapp.com",
  projectId: "app-de-treino-5089f",
  storageBucket: "app-de-treino-5089f.firebasestorage.app",
  messagingSenderId: "957956937303",
  appId: "1:957956937303:web:357fb52c66dc7d4daab512",
  measurementId: "G-H402BJHLFY"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistência falhou: múltiplas abas abertas.');
  } else if (err.code === 'unimplemented') {
    console.warn('Navegador não suporta persistência.');
  }
});

export const appId = 'workout-app';
