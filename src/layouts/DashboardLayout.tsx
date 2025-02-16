import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Home,LogOut, Menu, X, File, Settings2} from 'lucide-react';
import { Notifications } from './_components/notifications';
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/app.store"

export default function DashboardLayout() {
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
      link:'/admin/leave-setting',
      icon: <Settings2 size={20} />,
      title: "Leave Management",
      roles: ['ADMIN']
    },
    {
      link:'/admin/position',
      icon: <File size={20} />,
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
      {links.filter((link) => link.roles.includes(role ? role : '')).map((link, index) => {
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
        <nav className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center justify-between md:hidden">
            <Link to="/dashboard" className="text-xl font-bold">Dashboard</Link>
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <ul className={`md:flex justify-between w-full md:items-center ${isMenuOpen ? 'block' : 'hidden'} mt-4 md:mt-0 ml-auto`}>
            <div className="md:flex md:items-center">
              <NavItems />
            </div>
            <div className="flex items-center space-x-4">
                {getRole() == 'CONTRIBUTOR' && 
                 <div className="w-4 h-4">
                 <Notifications />
               </div>}
                <Button
                  variant="ghost"
                  className='hover:bg-gray-700'
                  size="icon"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
            </div>
          </ul>
        </nav>
      </header>
      <main className="container flex-grow px-4 py-8 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

