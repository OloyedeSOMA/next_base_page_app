"use client"

import { useRouter } from "next/navigation";
import { auth } from "../utils/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import CustomContainer from "../components/CustomContainer";
import CustomForm from "../components/CustomForm";

const Login = () => {
  const router = useRouter();
  
  const handleLogin= async ({email, password})=>{

    try{
      const {user} = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await user.getIdToken();
      // console.log("ID Token before sending:", idToken);

      const res = await fetch("/api/session", {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Failed to create session");

      // window.location.href ="/todoPage";
      router.push("/todoPage");
    }catch (err){
      console.log(err);
      throw new Error(
         err.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : err.message || 'Failed to log in'
      );
    }
    

  }
  return (
    <>
      <CustomContainer className="flex flex-col md:w-[50%] mx-auto h-auto p-5">
          <CustomForm onSubmit={handleLogin} signup="false"/>
      </CustomContainer>
    </>
  )
}

export default Login

