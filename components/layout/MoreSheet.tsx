
import React from 'react';
import { Tab } from '../../types';
import { useLanguage } from '../LanguageProvider';
import Sheet from '../ui/Sheet';
import { IconTrophy, IconPie, IconSettings } from '../icons/Icon';

interface MoreSheetProps {
  open: boolean;
  onClose: () => void;
  onSelectTab: (tab: Tab) => void;
  activeTab: Tab;
}

const MoreSheet: React.FC<MoreSheetProps> = ({ open, onClose, onSelectTab, activeTab }) => {
    const { t } = useLanguage();

    const moreTabs = [
        { tab: 'savings' as Tab, label: t('nav.savings'), icon: <IconTrophy /> },
        { tab: 'reports' as Tab, label: t('nav.reports'), icon: <IconPie /> },
        { tab: 'settings' as Tab, label: t('nav.settings'), icon: <IconSettings /> },
    ];

    return (
        <Sheet open={open} onClose={onClose}>
            <div className="py-2">
                <h3 className="text-lg font-semibold mb-4 px-2">{t('nav.more')}</h3>
                <div className="space-y-1">
                    {moreTabs.map(item => (
                        <button
                            key={item.tab}
                            onClick={() => onSelectTab(item.tab)}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors ${
                                activeTab === item.tab
                                    ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300'
                                    : 'hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                            }`}
                        >
                            <div className="text-zinc-500 dark:text-zinc-400">{React.cloneElement(item.icon, { size: 24 })}</div>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </Sheet>
    );
};

export default MoreSheet;
