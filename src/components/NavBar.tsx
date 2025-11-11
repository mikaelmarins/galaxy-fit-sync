import { Home, History, TrendingUp, Dumbbell } from 'lucide-react';

interface NavBarProps {
  view: string;
  setView: (view: string) => void;
  activeId: string | null;
}

export function NavBar({ view, setView, activeId }: NavBarProps) {
  if (view === 'workout' && activeId) return null;

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'history', icon: History, label: 'Histórico' },
    { id: 'progress', icon: TrendingUp, label: 'Progresso' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-card/80 backdrop-blur-md border-t border-border z-30">
      <div className="flex justify-around items-center h-20 px-6 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={24} fill={isActive ? 'currentColor' : 'none'} />
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
