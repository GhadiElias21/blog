import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiUser,HiArrowSmRight } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch=useDispatch()
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
    }, [location.search]);
    const handleSignOut=async ()=>{
      try {
        const res=await fetch ("api/user/signout",{
          method:"POST",
        })
        const data=await res.json()
  
        if(!res.ok){
          toast.error(data.message)
        }else{
          dispatch(signoutSuccess())
          toast.success("User signed out")
        }
      } catch(error) {
       toast.error(error)
      }
    }
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Link to='/dashboard?tab=profile'>
          <Sidebar.Item href="#" active={tab==='profile'} icon={HiUser} label={"User"} labelColor='dark' as='div'>
            Profile
          </Sidebar.Item>
          </Link>
          <Sidebar.Item href="#" onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer' as='div'>
           Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
