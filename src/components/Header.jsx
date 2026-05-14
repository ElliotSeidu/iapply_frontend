import { FaRegBell } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo — SF Pro / Apple system font */}
        <Link
          to="/"
          style={{ fontFamily: "'SF Pro Display', 'Inter', 'Segoe UI', sans-serif"}}
          className="text-xl font-semibold tracking-tight text-[#5a32a3] select-none"
        >
          iApply
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          <Link
            to="notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-purple-50 transition-colors"
          >
            <FaRegBell size={18} className="text-slate-600" />
            {/* notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7c3aed] rounded-full ring-2 ring-white" />
          </Link>

          <Link to="settings" className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-purple-200 hover:ring-purple-400 transition-all">
            <img src="pic.jpg" alt="Profile" className="w-full h-full object-cover" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;