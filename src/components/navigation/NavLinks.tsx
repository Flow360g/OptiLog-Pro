import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown } from "lucide-react";

export function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const location = useLocation();

  return (
    <>
      <Link 
        to="/dashboard" 
        className={`text-gray-600 hover:text-primary ${location.pathname === '/dashboard' ? 'font-bold' : ''}`}
        onClick={onLinkClick}
      >
        Dashboard
      </Link>
      <Link 
        to="/insights" 
        className={`text-gray-600 hover:text-primary ${location.pathname === '/insights' ? 'font-bold' : ''}`}
        onClick={onLinkClick}
      >
        Insights
      </Link>
      <Link 
        to="/testing-schedule" 
        className={`text-gray-600 hover:text-primary ${location.pathname === '/testing-schedule' ? 'font-bold' : ''}`}
        onClick={onLinkClick}
      >
        Testing Schedule
      </Link>
      
      {/* More Tools Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="text-gray-600 hover:text-primary flex items-center gap-1">
          More Tools
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onLinkClick}>
            <Link to="/tools/rsa-optimiser" className="flex w-full">
              Google RSA Optimiser
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="border-2 border-primary rounded-full px-4 py-1 text-gray-600 hover:text-primary flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Create New
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onLinkClick}>
            <Link to="/" className="flex w-full">
              Create Opti
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLinkClick}>
            <Link to="/testing-schedule/new" className="flex w-full">
              Create Test
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}