
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
    <div className="flex-1 flex justify-center items-center">
        <button
            onClick={onClick}
            data-tour-id={dataTourId}
            className={`
                relative flex flex-col items-center justify-center 
                w-full h-14 md:w-20 md:h-16 
                transition-all duration-300 group rounded-2xl md:rounded-full
                ${active 
                  ? 'bg-cyan-100 dark:bg-zinc-800' 
                  : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }
            `}
        >
            <div className={`
                transition-colors duration-300
                ${active 
                    ? "text-cyan-600 dark:text-cyan-300" 
                    : "text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100"
                }`
            }>
                {React.cloneElement(icon, { size: 24, className: `transition-transform group-hover:scale-110 ${active ? 'scale-105' : ''}` })}
            </div>
            <span className={`
                text-[10px] md:text-[11px] text-center leading-tight mt-1 transition-all
                ${active 
                    ? 'font-semibold text-cyan-600 dark:text-cyan-300' 
                    : 'font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200'
                }`
            }>
                {label}
            </span>
        </button>
    </div>
);

const AddButton: React.FC<{onClick: () => void, label: string}> = ({ onClick, label }) => (
    <div className="flex-1 flex justify-center items-center h-14 md:h-16">
        <button 
        onClick={onClick} 
        className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white grid place-items-center shadow-lg dark:shadow-cyan-500/30 transition-transform hover:scale-105 active:scale-95 -mt-6 md:mt-0"
        aria-label={label}
        data-tour-id="add-button"
        >
            <IconPlus size={28} />
        </button>
    </div>
);


const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAdd }) => {
    const { t } = useLanguage();

    const navItems = useMemo(() => [
      { tab: 'dashboard' as Tab, label: t('nav.dashboard'), icon: <IconChart />, tourId: 'dashboard-tab' },
      { tab: 'transactions' as Tab, label: t('nav.transactions'), icon: <IconList />, tourId: 'transactions-tab' },
      { tab: 'savings' as Tab, label: t('nav.savings'), icon: <IconTrophy />, tourId: 'savings-tab' },
      { isAddButton: true },
      { tab: 'budgets' as Tab, label: t('nav.budgets'), icon: <IconWallet />, tourId: 'budgets-tab' },
      { tab: 'reports' as Tab, label: t('nav.reports'), icon: <IconPie />, tourId: 'reports-tab' },
      { tab: 'settings' as Tab, label: t('nav.settings'), icon: <IconSettings />, tourId: 'settings-tab' },
    ], [t]);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:bottom-4 flex justify-center">
        <div className="w-full md:w-auto md:min-w-[640px] md:max-w-3xl flex items-center p-1 md:p-2 md:rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg border-t md:border border-zinc-300/80 dark:border-zinc-700/60 md:shadow-2xl">
            {navItems.map((item, index) => {
                if ('isAddButton' in item) {
                    return <AddButton key={index} onClick={onAdd} label={t('nav.add')} />;
                }
                return (
                    <TabButton 
                        key={item.tab}
                        icon={item.icon}
                        label={item.label}
                        active={activeTab === item.tab}
                        onClick={() => onTabChange(item.tab)}
                        data-tour-id={item.tourId}
                    />
                );
            })}
        </div>
    </nav>
  );
};

export default BottomNav;
