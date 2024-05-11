import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./database";
import { app } from "./init";

const auth = getAuth(app);

async function signup({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${name}`;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;
    await setDoc(doc(db, "accounts", user.uid), {
      uid: user.uid,
      email: user.email,
      name,
      avatar: avatarUrl,
    });
    await updateProfile(user, {
      displayName: name,
      photoURL: avatarUrl,
    });
  } catch (error) {
    console.error("📑 ~ file: auth.ts:26 ~ error:", error);
  }
}

function login({ email, password }: { email: string; password: string }) {
  signInWithEmailAndPassword(auth, email, password).catch((error) => {
    console.error(
      "🚀 ~ file: auth.ts:55 ~ signInWithEmailAndPassword ~ error:",
      error,
    );
  });
}

export { auth, login, signup };
