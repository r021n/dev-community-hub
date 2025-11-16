import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Home,
  LogIn,
  UserPlus,
  User,
  PlusCircle,
  LogOut,
  Shield,
} from "lucide-react";

const Header = () => {
  const { auth, logout, socket } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentSocket = socket.current;
    if (currentSocket) {
      currentSocket.on("newNotification", (data) => {
        // setNotification(data);
        // setTimeout(() => {
        //   setNotification(null);
        // }, 5000);
        toast({
          title: "Notifikasi baru",
          description: (
            <Link
              to={`/post/${data.postId}/${data.slug}`}
              className="hover:underline"
            >
              {data.message}
            </Link>
          ),
        });
      });
    }

    return () => {
      if (currentSocket) {
        currentSocket.off("newNotification");
      }
    };
  }, [socket.current, toast]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      {!auth.token ? (
        <>
          <Link to="/login" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="justify-start w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </Link>
          <Link to="/register" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="justify-start w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link
            to={`/profile/${auth.user.username}`}
            onClick={() => setIsOpen(false)}
          >
            <Button variant="ghost" className="justify-start w-full">
              <User className="w-4 h-4 mr-2" />
              Profil
            </Button>
          </Link>
          <Link to="/create-post" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="justify-start w-full">
              <PlusCircle className="w-4 h-4 mr-2" />
              Buat Post
            </Button>
          </Link>
          {auth.user && auth.user.role === "admin" && (
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="justify-start w-full">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="justify-start w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center px-4 mx-auto md:justify-between h-14">
        {/* LEFT: logo (desktop) */}
        <div className="items-center hidden space-x-6 md:flex">
          <Link to="/" className="flex items-center mr-6 space-x-2">
            <Home className="w-6 h-6" />
            <span className="hidden font-bold sm:inline-block">
              Dev Community Hub
            </span>
          </Link>
        </div>

        {/* RIGHT: desktop actions (search + quick buttons) */}
        <div className="items-center hidden ml-4 space-x-3 md:flex">
          {/* <input
            type="search"
            placeholder="Cari..."
            className="hidden w-56 px-3 py-1 text-sm border rounded-md sm:block bg-input text-input-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          /> */}
          {!auth.token ? (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/create-post">
                <Button
                  size="sm"
                  className="text-white bg-blue-600 hover:bg-blue-700"
                >
                  Buat Post
                </Button>
              </Link>

              {/* Dropdown: username trigger -> show Profil / Admin / Logout on hover (desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">{auth.user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {/* Optional: Label, jika perlu */}
                  {/* <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator /> */}

                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${auth.user.username}`}>
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </Link>
                  </DropdownMenuItem>

                  {auth.user && auth.user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer hover:text-red-700 focus:text-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="px-2">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col mt-6 space-y-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center mb-6 space-x-2"
              >
                <Home className="w-6 h-6" />
                <span className="text-lg font-bold">Dev Community Hub</span>
              </Link>
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
        <Link
          to="/"
          className="flex items-center flex-1 ml-2 space-x-2 md:hidden"
        >
          <Home className="w-5 h-5" />
          <span className="font-bold">Dev Community</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
