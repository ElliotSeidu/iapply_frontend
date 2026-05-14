import { NavLink } from "react-router-dom";
import { MdDashboard, MdWork, MdAddBox, MdBarChart, MdSettings } from "react-icons/md";

const links = [
  { to: "/", label: "Dashboard", icon: <MdDashboard size={18} />, end: true },
  { to: "/applications", label: "Applications", icon: <MdWork size={18} /> },
  { to: "/add-job", label: "Add Job", icon: <MdAddBox size={18} /> },
  { to: "/analytics", label: "Analytics", icon: <MdBarChart size={18} /> },
  { to: "/settings", label: "Settings", icon: <MdSettings size={18} /> },
];

const NavBar = () => {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-[57px] h-[calc(100vh-57px)] w-56 bg-white border-r border-slate-100 pt-6 pb-10 px-3 gap-1 z-40">
        {links.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#ede9fe] text-[#6d28d9] font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}

        {/* Bottom tag */}
        <div className="mt-auto px-3">
          <p
            className="text-[11px] text-slate-300 tracking-wide"
            style={{ fontFamily: "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif" }}
          >
            iApply © {new Date().getFullYear()}
          </p>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-2 z-50">
        {links.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? "text-[#6d28d9]" : "text-slate-400"
              }`
            }
          >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default NavBar;