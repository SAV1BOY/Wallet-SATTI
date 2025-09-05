import React from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Sheet: React.FC<SheetProps> = ({ open, onClose, children, title }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl p-4">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Sheet;