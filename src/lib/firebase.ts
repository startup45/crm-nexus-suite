
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const signUp = async (email: string, password: string, fullName: string, role: string = 'employee') => {
  // Create the user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Add additional user data to Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid,
    email,
    fullName,
    role,
    createdAt: serverTimestamp(),
  });

  return userCredential;
};

const signOut = () => {
  return firebaseSignOut(auth);
};

// User data functions
const getUserRole = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Function to create default admin user if it doesn't exist
const createDefaultAdminIfNotExists = async () => {
  const adminEmail = "admin@crmnexus.com";
  const adminPassword = "Admin123!";
  
  try {
    // Check if admin user already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", adminEmail), where("role", "==", "admin"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      try {
        // Try to create the user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        
        // Add admin user data to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: adminEmail,
          fullName: "System Administrator",
          role: "admin",
          createdAt: serverTimestamp(),
        });
        
        console.log("Default admin account created successfully");
        return true;
      } catch (authError: any) {
        // If the user already exists in Auth but not in Firestore
        if (authError.code === 'auth/email-already-in-use') {
          try {
            // Sign in with the default credentials
            const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
            
            // Add admin user data to Firestore if it doesn't exist
            await setDoc(doc(db, 'users', userCredential.user.uid), {
              uid: userCredential.user.uid,
              email: adminEmail,
              fullName: "System Administrator",
              role: "admin",
              createdAt: serverTimestamp(),
            }, { merge: true });
            
            console.log("Default admin account updated in Firestore");
            return true;
          } catch (error) {
            console.error("Error creating default admin in Firestore:", error);
            return false;
          }
        }
        console.error("Error creating default admin:", authError);
        return false;
      }
    } else {
      console.log("Default admin account already exists");
      return true;
    }
  } catch (error) {
    console.error("Error checking for default admin:", error);
    return false;
  }
};

// Data functions for various collections
const addDocument = (collectionName: string, data: any) => {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

const updateDocument = (collectionName: string, id: string, data: any) => {
  return updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

const deleteDocument = (collectionName: string, id: string) => {
  return deleteDoc(doc(db, collectionName, id));
};

const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const getDocumentById = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};

export {
  auth,
  db,
  storage,
  signIn,
  signUp,
  signOut,
  getUserRole,
  getCurrentUser,
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  getDocumentById,
  subscribeToCollection,
  createDefaultAdminIfNotExists
};
