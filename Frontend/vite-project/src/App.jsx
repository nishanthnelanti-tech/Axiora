import { signInWithPopup } from "firebase/auth";
import api from "../utils/axios";
import { auth, googleProvider } from "../utils/firebase";

const App = () => {

  const handlelogin=async(token)=>{
    try{
      const {data}=await api.post("/auth/login",{token})
      console.log("login successful",data)
    }
    catch(error){
      console.log("error in handlelogin",error)
    }
  }

  const googleLogin=async()=>{
      const data=await signInWithPopup(auth,googleProvider)
      const token=await data.user.getIdToken()
      console.log("token",token)
      await handlelogin(token)
      console.log(data)
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <button className="w-48 h-24 bg-white" onClick={googleLogin}>
        Continue with Google
      </button>
    </div>
  )
}

export default App