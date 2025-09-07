
import React from 'react';
import Modal from '../ui/Modal';
import { AppData, Occurrence, Action, Settings, Category } from '../../types';
import { fmtMoney, parseDate, overdueStatus, LOCALE_MAP } from '../../utils/helpers';
import { IconRepeat, IconEdit } from '../icons/Icon';
import { useLanguage } from '../LanguageProvider';

interface EntryDetailSheetProps {
  detail: Occurrence | null;
  data: AppData;
  onClose: () => void;
  onTogglePaid: (occ: Occurrence) => void;
  onEditRequest: (occ: Occurrence) => void;
  onConfirmAction: (action: Action) => void;
  settings: Settings;
  categories: { receita: Category[], despesa: Category[] };
}

const EntryDetailSheet: React.FC<EntryDetailSheetProps> = ({ detail, data, onClose, onTogglePaid, onEditRequest, onConfirmAction, settings, categories }) => {
  const { t, locale } = useLanguage();

  if (!detail) return null;

  const category = categories[detail.kind].find(cat => cat.id === detail.category);
  const isPaid = !!data.payments[`paid:${detail.id}`];
  const status = overdueStatus(detail.dueDate);

  const getRecurrenceText = () => {
    if (detail.type === 'parcelado') return t('entryDetail.recurrence.parcelado', { index: detail.occIndex, total: detail.occTotal });
    if (detail.type === 'always') return t('entryDetail.recurrence.always');
    return t('entryDetail.recurrence.none');
  }

  return (
    <Modal open={!!detail} onClose={onClose} title={t('modals.entryDetailsTitle', { type: detail.kind === 'receita' ? t('modals.income') : t('modals.expense') })}>
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          {category?.icon}
          {detail.description}
        </h3>
        <div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">{t('entryDetail.value')}</div>
          <div className="text-2xl font-semibold">{fmtMoney(detail.value, settings.currency, locale)}</div>
        </div>
        <div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">{t('entryDetail.dueDate')}</div>
          <div className="font-medium">{parseDate(detail.dueDate).toLocaleDateString(LOCALE_MAP[locale])}</div>
        </div>
        
        <div className={`text-sm p-2 rounded-lg ${
            isPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
            status === 'overdue' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
            {isPaid ? t('entryDetail.status.paid') : status === 'overdue' ? t('entryDetail.status.overdue') : t('entryDetail.status.pending')}
        </div>

        <button onClick={() => onTogglePaid(detail)} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
          {isPaid ? t('transactions.markUnpaid') : (detail.kind === 'receita' ? t('transactions.markReceived') : t('transactions.markPaid'))}
        </button>

        <div className="border-t border-zinc-200 dark:border-zinc-800 my-4" />
        
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <IconRepeat size={16} />
            <span>{getRecurrenceText()}</span>
          </div>
          <button onClick={() => onEditRequest(detail)} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label={t('common.edit')}>
            <IconEdit size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button onClick={() => onConfirmAction({ 
            type: 'deleteOccurrence', 
            payload: detail, 
            title: t('entryDetail.deleteOccurrenceTitle'),
            message: t('entryDetail.deleteOccurrenceMessage') 
          })} className="w-full text-center px-3 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            {t('entryDetail.deleteOccurrence')}
          </button>
          
          {(detail.type === 'always' || detail.type === 'parcelado') && (
            <button onClick={() => onConfirmAction({ 
              type: 'endSeries', 
              payload: detail, 
              title: t('entryDetail.endRecurrenceTitle'),
              message: t('entryDetail.endRecurrenceMessage')
            })} className="w-full px-3 py-2 rounded-xl bg-amber-500/80 hover:bg-amber-600/80 dark:bg-amber-800/80 dark:hover:bg-amber-700/80">
              {t('entryDetail.endRecurrence')}
            </button>
          )}
          
          <button onClick={() => onConfirmAction({ 
            type: 'deleteEntry', 
            payload: detail.entryId, 
            title: t('entryDetail.deleteSeriesTitle'),
            message: t('entryDetail.deleteSeriesMessage')
          })} className="w-full px-3 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-700/90 dark:bg-rose-800/80 dark:hover:bg-rose-700/90 text-rose-100 dark:text-rose-200">
            {t('entryDetail.deleteSeries')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EntryDetailSheet;
