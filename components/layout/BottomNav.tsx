
import React, { useMemo } from 'react';
import { Tab } from '../../types';
import { IconChart, IconList, IconPie, IconSettings, IconWallet, IconTrophy, IconPlus, IconProps } from '../icons/Icon';
import { useLanguage } from '../LanguageProvider';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onAdd: () => void;
}

interface TabButtonProps {
    icon: React.ReactElement<IconProps>;
    label: string;
    active: boolean;
    onClick: () => void;
    "data-tour-id"?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, active, onClick, "data-tour-id": dataTourId }) => (
    <button
      onClick={onClick}
      className={`relative z-10 flex flex-col items-center justify-center p-2 w-[72px] h-14 transition-colors duration-300 ${
        active
          ? "text-cyan-600 dark:text-cyan-300"
          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      }`}
      data-tour-id={dataTourId}
    >
      {React.cloneElement(icon, { size: 22 })}
      <span className={`text-xs mt-1 transition-all ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
    </button>
  );

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAdd }) => {
    const { t } = useLanguage();

    const navItems = useMemo(() => [
      { tab: 'dashboard' as Tab, label: t('nav.dashboard'), icon: <IconChart />, tourId: 'dashboard-tab' },
      { tab: 'transactions' as Tab, label: t('nav.transactions'), icon: <IconList />, tourId: 'transactions-tab' },
      { tab: 'savings' as Tab, label: t('nav.savings'), icon: <IconTrophy />, tourId: 'savings-tab' },
      { tab: 'budgets' as Tab, label: t('nav.budgets'), icon: <IconWallet />, tourId: 'budgets-tab' },
      { tab: 'reports' as Tab, label: t('nav.reports'), icon: <IconPie />, tourId: 'reports-tab' },
      { tab: 'settings' as Tab, label: t('nav.settings'), icon: <IconSettings />, tourId: 'settings-tab' },
    ], [t]);

    const leftItems = navItems.slice(0, 3);
    const rightItems = navItems.slice(3);

    const activeIndex = navItems.findIndex(item => item.tab === activeTab);
    const addButtonWidth = 72;
    const tabWidth = 72;

    const indicatorPosition = activeIndex < 3 
      ? activeIndex * tabWidth
      : (3 * tabWidth) + addButtonWidth + ((activeIndex - 3) * tabWidth);

  return (
    <nav className="fixed bottom-4 inset-x-0 z-50 flex justify-center">
        <div className="relative flex items-center p-2 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg border border-zinc-300/80 dark:border-zinc-700/60 shadow-2xl">
            <div 
              className="absolute top-2 left-2 w-[72px] h-14 bg-cyan-100 dark:bg-zinc-800 rounded-full transition-transform duration-300 ease-in-out shadow-inner" 
              style={{ transform: `translateX(${indicatorPosition}px)` }}
            />

            {leftItems.map(item => (
                <TabButton 
                    key={item.tab}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.tab}
                    onClick={() => onTabChange(item.tab)}
                    data-tour-id={item.tourId}
                />
            ))}
            
            <div style={{ width: `${addButtonWidth}px` }} className="flex justify-center items-center flex-shrink-0">
              <button 
                onClick={onAdd} 
                className="relative z-10 w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white grid place-items-center shadow-lg transition-colors"
                aria-label={t('nav.add')}
                data-tour-id="add-button"
              >
                  <IconPlus size={28} />
              </button>
            </div>

            {rightItems.map(item => (
                <TabButton 
                    key={item.tab}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.tab}
                    onClick={() => onTabChange(item.tab)}
                    data-tour-id={item.tourId}
                />
            ))}
        </div>
    </nav>
  );
};

export default BottomNav;
