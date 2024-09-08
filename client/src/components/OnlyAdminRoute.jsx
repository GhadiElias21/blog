import { useSelector } from "react-redux"
import { Outlet,Navigate } from "react-router-dom"
function OnlyAdminRoute() {
   const {currentUser} =useSelector((state)=>state.user)
  return currentUser?.isAdmin?<Outlet/>:<Navigate to='/sign-in'/>
}


export default OnlyAdminRoute