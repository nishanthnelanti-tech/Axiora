import { useEffect } from "react"
import Home from "./pages/Home"
import getCurrentUser from "./features/getCurrentuser.js"

const App = () => {

  useEffect(()=>{
    const getUser=async()=>{
      await getCurrentUser()
    }
    getUser()
  },[])

  return (
    <>
    <Home></Home>
    </>
  )
}

export default App