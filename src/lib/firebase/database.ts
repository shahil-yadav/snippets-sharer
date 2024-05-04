import { getFirestore } from "firebase/firestore";
import { app } from "./init";

const db = getFirestore(app);

export { db };
