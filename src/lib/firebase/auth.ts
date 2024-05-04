import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app } from "./init";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

function signup({
  email,
  password,
  info: { name },
}: {
  email: string;
  password: string;
  info: {
    name: string;
  };
}) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(
        "🚀 ~ file: auth.ts:26 ~ user:",
        "✅ Successfully updated user",
      );
      updateProfile(user, {
        displayName: name,
      })
        .then(() => {
          console.log(
            "🚀 ~ file: auth.ts:29 ~ msg:",
            "✅ Successfully updated profile picture",
          );
        })
        .catch((error) => {
          console.error(
            "🚀 ~ file: auth.ts:34 ~ error:",
            error.code,
            error.message,
          );
        });
    })
    .catch((error) => {
      console.log("🚀 ~ file: auth.ts:48 ~ error:", error);
      throw new Error("❌ Signup failed");
    });
}

function login({ email, password }: { email: string; password: string }) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("🚀 ~ file: auth.ts:54 ~ .then ~ user:", user);
    })
    .catch((error) => {
      console.error(
        "🚀 ~ file: auth.ts:55 ~ signInWithEmailAndPassword ~ error:",
        error,
      );
    });
}

export { signup, login };
