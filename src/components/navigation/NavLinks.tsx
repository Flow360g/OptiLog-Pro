import { Link, useLocation } from "react-router-dom";

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
        to="/" 
        className="border-2 border-primary rounded-full px-4 py-1 text-gray-600 hover:text-primary"
        onClick={onLinkClick}
      >
        Create Opti
      </Link>
    </>
  );
}