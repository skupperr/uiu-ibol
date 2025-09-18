import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { makeRequest } from "@/utils/api"; 

export const signUp = async (email: string, password: string) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCred.user.getIdToken();

  // Call backend only once
  await makeRequest("insert-profile", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  return userCred;
};

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};
