import React from 'react';
import { Tab } from '../../types';
// FIX: Import IconProps to strongly type the icon elements.
import { IconChart, IconList, IconPie, IconSettings, IconWallet, IconTrophy, IconPlus, IconProps } from '../icons/Icon';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onAdd: () => void;
}

interface TabButtonProps {
    // FIX: Changed icon type from React.ReactNode to React.ReactElement to allow for prop cloning.
    // FIX: Specify the props type for the icon element to allow passing the `size` prop.
    icon: React.ReactElement<IconProps>;
    label: string;
    active: boolean;
    onClick: () => void;
}

const navItems = [
  { tab: 'dashboard' as Tab, label: 'Dashboard', icon: <IconChart /> },
  { tab: 'transactions' as Tab, label: 'Lançamentos', icon: <IconList /> },
  { tab: 'savings' as Tab, label: 'Metas', icon: <IconTrophy /> },
  { tab: 'budgets' as Tab, label: 'Orçamentos', icon: <IconWallet /> },
  { tab: 'reports' as Tab, label: 'Relatórios', icon: <IconPie /> },
  { tab: 'settings' as Tab, label: 'Config.', icon: <IconSettings /> },
];

const TabButton: React.FC<TabButtonProps> = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 transition-colors w-[72px] h-14 ${
        active
          ? "text-cyan-600 dark:text-cyan-400"
          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      }`}
    >
      {React.cloneElement(icon, { size: 22 })}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAdd }) => {
    const leftItems = navItems.slice(0, 3);
    const rightItems = navItems.slice(3);

  return (
    <nav className="fixed bottom-4 inset-x-0 z-50 flex justify-center">
        <div className="flex items-center p-2 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg border border-zinc-300/80 dark:border-zinc-700/60 shadow-2xl">
            {leftItems.map(item => (
                <TabButton 
                    key={item.tab}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.tab}
                    onClick={() => onTabChange(item.tab)}
                />
            ))}
            
            <button 
              onClick={onAdd} 
              className="w-14 h-14 mx-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white grid place-items-center shadow-lg transition-colors flex-shrink-0"
              aria-label="Adicionar novo lançamento"
            >
                <IconPlus size={28} />
            </button>

            {rightItems.map(item => (
                <TabButton 
                    key={item.tab}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.tab}
                    onClick={() => onTabChange(item.tab)}
                />
            ))}
        </div>
    </nav>
  );
};

export default BottomNav;