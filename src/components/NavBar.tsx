import { Home, History, TrendingUp } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';

export function NavBar() {
  const location = useLocation();
  
  // Hide navbar during active workout
  if (location.pathname.startsWith('/workout/')) return null;

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/history', icon: History, label: 'Histórico' },
    { path: '/progress', icon: TrendingUp, label: 'Progresso' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-card/80 backdrop-blur-md border-t border-border z-30">
      <div className="flex justify-around items-center h-20 px-6 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 transition-colors text-muted-foreground"
              activeClassName="text-primary"
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} fill={isActive ? 'currentColor' : 'none'} />
                  <span className="text-xs font-bold">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
