import { BsPersonCircle } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className='flex flex-row py-2 px-8 justify-between text-xl top-0 sticky bg-white z-10 shadow-md'>
        <div className='h-full'>
            <Link to="/" className='text-[#6b46c1] font-semibold italic'>iApply</Link>
        </div>

        <div className="flex flex-row gap-5">
            <Link to="notifications" className="w-full h-full py-1.5">
                <FaRegBell size={22} />
            </Link>
            <Link to="profile" className="w-full h-full py-1.5">
                <CgProfile size={22} />
            </Link>
        </div>
    </header>
  )
}

export default Header