
import React from 'react';
import { IconLeft, IconRight } from '../icons/Icon';

interface HeaderProps {
    title: string;
    onPrev: () => void;
    onNext: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onPrev, onNext }) => {
    return (
        <header className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <button onClick={onPrev} className="p-2 rounded hover:bg-zinc-800"><IconLeft /></button>
                <div className="text-cyan-300 font-medium select-none">{title}</div>
                <button onClick={onNext} className="p-2 rounded hover:bg-zinc-800"><IconRight /></button>
            </div>
        </header>
    );
};

export default Header;
