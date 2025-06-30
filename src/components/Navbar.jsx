import { useAuth } from "../contexts/AuthContext"
import { Button } from "../ui/Button"
import { FolderKanban, LogOut, User } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback } from "../ui/Avatar"
import { DropdownMenu, DropdownMenuItem } from "../ui/Dropdown-menu"

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-14 items-center px-4 justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <FolderKanban className="h-6 w-6" />
          <span className="font-bold text-gray-800">ProjectHub</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link to="/projects">
            <Button variant="ghost">Projects</Button>
          </Link>

          <DropdownMenu
            trigger={
              <Avatar>
                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            }
          >
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                {user?.username || "User"}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <div className="flex items-center gap-2 text-red-600">
                <LogOut className="h-4 w-4" />
                Logout
              </div>
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
