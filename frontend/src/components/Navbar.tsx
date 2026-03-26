import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Home, LogIn, Menu, X, Pencil } from "lucide-react";

const navLinks = [
  { href: "/lobby",     label: "Home",      icon: <Home className="w-4 h-4" />            },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/login",     label: "Login",     icon: <LogIn className="w-4 h-4" />           },
];

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-50 w-full bg-card/80 backdrop-blur-md border-b border-border shrink-0">
      <div className="flex items-center justify-between h-14 px-5 max-w-screen-2xl mx-auto">

        {/* Logo */}
        <button
          onClick={() => navigate("/lobby")}
          className="flex items-end gap-1 select-none group"
        >
          <span className="text-2xl font-black tracking-tighter text-white leading-none group-hover:text-white/90 transition-colors">
            Ink
          </span>
          <span className="text-2xl font-black tracking-tighter leading-none text-primary group-hover:text-primary/85 transition-colors">
            Arena
          </span>
          <Pencil className="w-3.5 h-3.5 text-primary/70 mb-0.5 ml-0.5" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/25"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{link.icon}</span>
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden border-t border-border bg-card/95 backdrop-blur-md"
          >
            <nav className="flex flex-col gap-1 p-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                      ${isActive
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
