import { BsBarChart, BsPlusCircle } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import { TbBriefcase2 } from 'react-icons/tb'
import { use, useEffect, useState } from 'react'
import { GoGear } from 'react-icons/go'
import { IoPersonOutline } from 'react-icons/io5'
import { LuLayoutDashboard } from 'react-icons/lu'

const NavBar = () => {

    function useMediaQuery(query){
        const [matches, setMatches] = useState(window.matchMedia(query).matches);

        useEffect(() => {
            const media = window.matchMedia(query);
            const listener = () => setMatches(media.matches);

            media.addEventListener("change", listener);
            return () => media.removeEventListener("change", listener)
        }, [query])

        return matches;
    }

    const isMdUp = useMediaQuery("(min-width:768px)");

  return (
    <>
        { isMdUp ? 
            <nav className='hidden md:flex gap-5 flex-row fixed py-2 px-1 w-full h-auto justify-center items-center bg-white z-10 shadow-xl'>
                <NavLink to="/" className={({ isActive }) => `flex flex-row items-center gap-2 rounded-md py-1 px-2 ${isActive ? "underline decoration-[#6b46c1] text-[#6b46c1]" : ""}`}>
                    <h3>Dashboard</h3>
                </NavLink>

                <NavLink to="applications" className={({ isActive }) => `flex flex-row items-center gap-2 rounded-md py-1 px-2 ${isActive ? "underline decoration-[#6b46c1] text-[#6b46c1]" : ""}`}>
                    <h3>Applications</h3>
                </NavLink>

                <NavLink to="add-job" className={({ isActive }) => `flex flex-row items-center gap-2 rounded-md py-1 px-2 ${isActive ? "underline decoration-[#6b46c1] text-[#6b46c1]" : ""}`}>
                    <h3>Add Job</h3>
                </NavLink>

                <NavLink to="analytics" className={({ isActive }) => `flex flex-row items-center gap-2 rounded-md py-1 px-2 ${isActive ? "underline decoration-[#6b46c1] text-[#6b46c1]" : ""}`}>
                    <h3>Analytics</h3>
                </NavLink>

                <NavLink to="settings" className={({ isActive }) => `flex flex-row items-center gap-2 rounded-md py-1 px-2 ${isActive ? "underline decoration-[#6b46c1] text-[#6b46c1]" : ""}`}>
                    <h3>Settings</h3>
                </NavLink>
            </nav> 
        : 
         <nav className='flex flex-row gap-3 justify-center items-center bg-white fixed bottom-0 left-0 w-full text-[#6b46c1] py-2 z-10 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]'>
            <NavLink to="/" className={({ isActive }) => `flex flex-col items-center rounded-md py-1 px-1 ${isActive ? "bg-[#6b46c1] text-white" : ""}`}>
                <LuLayoutDashboard className='text-2xl' />
                <p className='text-[10px]'>Dashboard</p>
            </NavLink>

            <NavLink to="applications" className={({ isActive }) => `flex flex-col items-center rounded-md py-1 px-2 ${isActive ? "bg-[#6b46c1] text-white" : ""}`}>
                <TbBriefcase2 className='text-2xl' />
                <p className='text-[10px]'>Applications</p>
            </NavLink>

            <NavLink to="add-job" className={({ isActive }) => `flex flex-col items-center rounded-md py-1 px-2 ${isActive ? "bg-[#6b46c1] text-white" : ""}`}>
                <BsPlusCircle className='text-2xl' />
                <p className='text-[10px]'>Add Job</p>
            </NavLink>

            <NavLink to="analytics" className={({ isActive }) => `flex flex-col items-center rounded-md py-1 px-2 ${isActive ? "bg-[#6b46c1] text-white" : ""}`}>
                <BsBarChart  className='text-2xl' />
                <p className='text-[10px]'>Analytics</p>
            </NavLink>

            <NavLink to="settings" className={({ isActive }) => `flex flex-col items-center rounded-md py-1 px-2 ${isActive ? "bg-[#6b46c1] text-white" : ""}`}>
                <GoGear className='text-2xl' />
                <p className='text-[10px]'>Settings</p>
            </NavLink>
         </nav>   
        }
    </>
  )
}

export default NavBar