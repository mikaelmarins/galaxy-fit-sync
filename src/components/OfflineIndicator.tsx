import { WifiOff, Wifi, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getQueueCount } from '@/lib/offlineQueue';

interface OfflineIndicatorProps {
  online: boolean;
}

export function OfflineIndicator({ online }: OfflineIndicatorProps) {
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const updateCount = async () => {
      const count = await getQueueCount();
      setQueueCount(count);
    };
    updateCount();
    const interval = setInterval(updateCount, 5000);
    return () => clearInterval(interval);
  }, [online]);

  if (online && queueCount === 0) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 animate-in slide-in-from-top duration-300">
      <div className={`${online ? 'bg-amber-500' : 'bg-slate-900'} text-white text-sm py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg`}>
        {online ? (
          <>
            <Clock size={16} className="animate-pulse" />
            <span className="font-medium">Sincronizando {queueCount} treino(s)...</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span className="font-medium">Modo Offline</span>
            {queueCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {queueCount} pendente(s)
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
