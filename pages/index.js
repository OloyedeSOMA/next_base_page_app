"use client";
import { auth } from "../utils/firebase/firebase";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import CustomContainer from "./components/CustomContainer";
import CustomForm from "./components/CustomForm";

export default function Home() {
  const router = useRouter();

  const handleSignUp = async ({ name, email, password }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });

      const idToken = await user.getIdToken();

      await fetch(`/api/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      router.push("/todos");
    } catch (err) {
      console.error(err);
      throw new Error(
        err.code === "auth/email-already-in-use"
          ? "Email already in use"
          : err.code === "auth/weak-password"
          ? "Password is too weak"
          : err.message || "Failed to sign up"
      );
    }
  };

  return (
    <CustomContainer className="flex flex-col md:w-[50%] mx-auto h-auto p-5">
      <CustomForm signup="true" includeName="true" onSubmit={handleSignUp} />
    </CustomContainer>
  );
}