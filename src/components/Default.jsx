import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";

const Default = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <NavBar />
      {/* offset for sidebar on desktop, bottom bar on mobile */}
      <main className="md:ml-56 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Default;