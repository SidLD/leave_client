"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { Home, LogOut, Menu, X, Settings, User2, File, FileArchive, Bell, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Notifications } from "./_components/notifications"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/app.store"

export default function DashboardLayout() {
  const { clear, getRole, getUserInfo } = useStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false)
    }

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showDropdown])

  // Close mobile menu on location change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const links = [
    {
      link: "/admin/",
      icon: <Home size={20} />,
      title: "Dashboard",
      roles: ["ADMIN"],
    },
    {
      link: `/admin/user`,
      icon: <User2 size={20} />,
      title: "User Management",
      roles: ["ADMIN"],
    },
    {
      link: "/admin/form-seven",
      icon: <File size={20} />,
      title: "Form 7",
      roles: ["ADMIN"],
    },
    {
      link: "/user/",
      icon: <Home size={20} />,
      title: "Dashboard",
      roles: ["USER"],
    },
    {
      link: `/user/report/new/${getUserInfo().id}/`,
      icon: <File size={20} />,
      title: "Form 6",
      roles: ["USER"],
    },
    {
      link: `/admin/report`,
      icon: <FileArchive size={20} />,
      title: "Form 6",
      roles: ["ADMIN"],
    },
  ]

  const handleLogout = () => {
    clear()
    setTimeout(() => {
      navigate("/login")
    }, 200)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(!showDropdown)
  }

  const role = getRole()

  // Improved function to check if a link is active
  const isLinkActive = (path: string) => {
    if (path === "/admin/" && location.pathname === "/admin/") {
      return true
    }
    if (path === "/user/" && location.pathname === "/user/") {
      return true
    }
    if (path !== "/admin/" && path !== "/user/") {
      if (location.pathname === path) {
        return true
      }
      if (location.pathname.startsWith(path + "/")) {
        return true
      }
    }

    return false
  }

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        opacity: { duration: 0.2 },
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        opacity: { delay: 0.1, duration: 0.2 },
      },
    },
  }

  const notificationDotVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  const NavItems = () => (
    <>
      {links
        .filter((link) => link.roles.includes(role ? role : ""))
        .map((link, index) => {
          const isActive = isLinkActive(link.link)
          return (
            <li key={index} className="relative mb-2 md:mb-0">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={link.link}
                  className={`flex items-center space-x-3 transition-all duration-200 rounded-lg px-4 py-2.5 ${
                    isActive ? "bg-green-600 text-white font-medium shadow-sm" : "hover:bg-gray-700/50 text-gray-200"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "text-gray-400"}`}>{link.icon}</span>
                  <span>{link.title}</span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-green-600 rounded-lg -z-10"
                      layoutId="activeNavHighlight"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            </li>
          )
        })}
    </>
  )

  // Get user info for avatar
  const userInfo = getUserInfo()
  const userInitials =
    userInfo?.firstName && userInfo?.lastName ? `${userInfo.firstName[0]}${userInfo.lastName[0]}` : "U"

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header
        className={`text-white bg-gray-800 sticky top-0 z-10 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto">
          <nav className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="items-center hidden md:flex">
                <motion.div
                  className="p-2 mr-2 text-white bg-green-600 rounded-lg"
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Shield size={22} />
                </motion.div>
                <Link to={role === "ADMIN" ? "/admin/" : "/user/"} className="text-xl font-bold">
                  Admin<span className="text-green-400">Portal</span>
                </Link>
              </div>

              <div className="flex items-center justify-between w-full md:hidden">
                <Link to={role === "ADMIN" ? "/admin/" : "/user/"} className="flex items-center text-lg font-bold">
                  <motion.div
                    className="bg-green-600 text-white p-1.5 rounded-lg mr-2"
                    whileHover={{ rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Shield size={18} />
                  </motion.div>
                  Admin<span className="text-green-400">Portal</span>
                </Link>
                <motion.button
                  onClick={toggleMenu}
                  className="p-2 transition-colors rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X size={24} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="items-center justify-between flex-1 hidden ml-8 md:flex">
              <ul className="flex items-center space-x-1">
                <NavItems />
              </ul>

              <div className="flex items-center space-x-3">
                {getRole() === "CONTRIBUTOR" && (
                  <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-700">
                      <Bell size={18} />
                      <motion.span
                        className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                        variants={notificationDotVariants as any}
                        animate="pulse"
                      ></motion.span>
                    </Button>
                    <div className="sr-only">
                      <Notifications />
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center pl-3 space-x-3 border-l border-gray-700">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">
                      {userInfo?.firstName} {userInfo?.lastName}
                    </span>
                    <span className="text-xs text-gray-400">{role}</span>
                  </div>

                  <div className="relative">
                    <motion.button
                      className="flex items-center justify-center text-sm font-medium text-white transition-colors bg-green-600 rounded-full w-9 h-9 hover:bg-green-700"
                      onClick={toggleDropdown}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {userInitials}
                    </motion.button>

                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          className="absolute right-0 z-50 w-48 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-2">
                            <motion.div whileHover={{ backgroundColor: "rgba(55, 65, 81, 1)" }}>
                              <Link
                                to="/user/setting"
                                className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                              </Link>
                            </motion.div>
                            <div className="my-1 border-t border-gray-700"></div>
                            <motion.div whileHover={{ backgroundColor: "rgba(55, 65, 81, 1)" }}>
                              <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-700"
                              >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                              </button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="overflow-hidden md:hidden"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <ul className="flex flex-col px-2 pt-2 pb-3 space-y-1">
                  <NavItems />
                </ul>

                <div className="px-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="flex items-center justify-center w-10 h-10 font-medium text-white bg-green-600 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {userInitials}
                      </motion.div>
                      <div>
                        <div className="text-sm font-medium">
                          {userInfo?.firstName} {userInfo?.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{role}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link to="/user/setting">
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                            <Settings className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      </Link>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:bg-gray-700"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container px-4 py-6 mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-4 text-sm text-center text-gray-400 bg-gray-800">
        <div className="container px-4 mx-auto">© {new Date().getFullYear()} AdminPortal. All rights reserved.</div>
      </footer>
    </div>
  )
}

