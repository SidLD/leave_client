import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Home, Users, FileInput, LogOut, Menu, X, Settings2 } from "lucide-react";
import { useStore } from "@/store/app.store"

export default function PrintLayout() {
  const {clear, getRole} = useStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate()
  const links = [
    {
      link:'/admin/',
      icon: <Home size={20} />,
      title: "Dashboard",
      roles: ['ADMIN']
    },
    {
      link:'/admin/user-management',
      icon: <Users size={20} />,
      title: "User Management",
      roles: ['ADMIN']
    },
    {
      link:'/admin/data-entry',
      icon: <FileInput size={20} />,
      title: "Data Entry",
      roles: ['ADMIN']
    },
    {
      link:'/admin/setting',
      icon: <Settings2 size={20} />,
      title: "Settings",
      roles: ['ADMIN']
    },
    {
      link:'/contributor/',
      icon: <Home size={20} />,
      title: "Dashboard",
      roles: ['CONTRIBUTOR']
    },
    {
      link:'/contributor/data-entry',
      icon: <FileInput size={20} />,
      title: "Data Entry",
      roles: ['CONTRIBUTOR']
    },
    {
      link:'/contributor/setting',
      icon: <Settings2 size={20} />,
      title: "Settings",
      roles: ['CONTRIBUTOR']
    },
    {
      link:'/admin/report',
      icon: <FileInput size={20} />,
      title: "Report",
      roles: ['ADMIN']
    },
  ]
  const handleLogout = () => {
    clear()
    navigate('/login')
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const role = getRole() ;

  const NavItems = () => (
    <>
      {links.filter((link) => link.roles.includes(role || '')).map((link, index) => {
        return <li key={index} className="mb-4 md:mb-0 md:mr-6">
        <Link to={link.link} className="flex items-center space-x-2 transition-colors hover:text-gray-300">
          {link.icon}
          <span>{link.title}</span>
        </Link>
      </li>
      })}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="text-white bg-gray-800">
        <nav className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between md:hidden">
            <Link to="/dashboard" className="text-xl font-bold">Dashboard</Link>
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <ul className={`md:flex md:items-center ${isMenuOpen ? 'block' : 'hidden'} mt-4 md:mt-0`}>
            <div className="md:flex md:items-center">
              <NavItems />
            </div>
            <li className="mt-4 md:mt-0 md:ml-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 space-x-2 font-bold text-white transition-colors bg-red-600 rounded hover:bg-red-700 md:w-auto"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow px-4 py-8 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}