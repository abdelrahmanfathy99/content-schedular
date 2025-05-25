import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, LayoutDashboard, LogOut, X, FileText, PlusCircle } from 'lucide-react';
import { MdApps } from 'react-icons/md';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-blue-600">ContentScheduler</span>
          </div>
          <button 
            className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              end
            >
              <LayoutDashboard size={18} className="mr-3" />
              Dashboard
            </NavLink>

            <NavLink 
              to="/platform" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              end
            >
              <MdApps size={18} className="mr-3 text-gray-600" />
              Platform
            </NavLink>

            <NavLink 
              to="/posts" 
              end
              className={({ isActive }) => 
                `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <FileText size={18} className="mr-3" />
              Posts
            </NavLink>

            <NavLink 
              to="/posts/create" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <PlusCircle size={18} className="mr-3" />
              Create Post
            </NavLink>

            <NavLink 
              to="/calendar" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Calendar size={18} className="mr-3" />
              Calendar
            </NavLink>

            <button 
              onClick={() => logout()}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;