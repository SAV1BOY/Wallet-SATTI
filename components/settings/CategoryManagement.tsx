import React from 'react';
import { Category, Kind } from '../../types';
import { IconEdit, IconPlus } from '../icons/Icon';

interface CategoryManagementProps {
    categories: { receita: Category[], despesa: Category[] };
    onAdd: (kind: Kind) => void;
    onEdit: (category: Category, kind: Kind) => void;
    onDelete: (category: Category, kind: Kind) => void;
}

const CategoryList: React.FC<{
    title: string;
    kind: Kind;
    items: Category[];
    onAdd: (kind: Kind) => void;
    onEdit: (category: Category, kind: Kind) => void;
    onDelete: (category: Category, kind: Kind) => void;
}> = ({ title, kind, items, onAdd, onEdit, onDelete }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-zinc-700 dark:text-zinc-300">{title}</h4>
                <button onClick={() => onAdd(kind)} className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                    <IconPlus size={16} />
                    Adicionar
                </button>
            </div>
            <div className="space-y-2">
                {items.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-2 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg grid place-items-center text-xl" style={{ backgroundColor: `${cat.color}40`}}>
                                <span>{cat.icon}</span>
                            </div>
                            <span className="font-medium">{cat.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => onEdit(cat, kind)} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100">
                                <IconEdit size={18} />
                            </button>
                            <button onClick={() => onDelete(cat, kind)} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, onAdd, onEdit, onDelete }) => {
    return (
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-medium mb-4">Gerenciar Categorias</h3>
            <div className="space-y-6">
                <CategoryList
                    title="Categorias de Receita"
                    kind="receita"
                    items={categories.receita}
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
                <CategoryList
                    title="Categorias de Despesa"
                    kind="despesa"
                    items={categories.despesa}
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
};

export default CategoryManagement;