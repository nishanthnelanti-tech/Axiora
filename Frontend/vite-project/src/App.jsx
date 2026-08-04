import { useEffect } from "react"
import Home from "./pages/Home"
import getCurrentUser from "./features/getCurrentuser.js"
import { useDispatch } from "react-redux"
import { setUserdata } from "./redux/userslice.js"

const App = () => {

  const dispatch=useDispatch()

  useEffect(()=>{
    const getUser=async()=>{
      const data=await getCurrentUser()
      dispatch(setUserdata(data))
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