import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  openSidebar: () => void;
}

const Header = ({ openSidebar }: HeaderProps) => {
  const location = useLocation();
  
  // Get the title based on the current route
  const getTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/posts') return 'Posts';
    if (path === '/posts/create') return 'Create Post';
    if (path.startsWith('/posts/edit/')) return 'Edit Post';
    if (path === '/calendar') return 'Calendar';
    if (path === '/platform') return 'Platform';
    
    return 'Content Scheduler';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button 
            className="p-1 mr-3 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none md:hidden"
            onClick={openSidebar}
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800">{getTitle()}</h1>
        </div>
        
        <div className="flex items-center">
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;