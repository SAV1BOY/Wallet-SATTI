
import React from 'react';

// FIX: Exported IconProps to be used for typing.
export interface IconProps {
  size?: number;
  className?: string;
}

const Icon: React.FC<{ path: React.ReactNode } & IconProps> = ({ path, size = 20, className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>{path}</svg>
);

export const IconPlus: React.FC<IconProps> = (p) => <Icon {...p} path={<><path d="M11 5h2v14h-2z" /><path d="M5 11h14v2H5z" /></>} />;
export const IconLeft: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />} />;
export const IconRight: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />} />;
export const IconMenu: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />} />;
export const IconCheck: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />} />;
export const IconClock: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 11h5v-2h-4V7h-2v6z" />} />;
export const IconChart: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M3.5 18.5l6-6 4 4 7.09-7.09L22 11l-8.5 8.5-4-4-5 5L3.5 18.5z" />} />;
export const IconPie: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.52-4.24 8.97-8.99h-8.97z" />} />;
export const IconList: React.FC<IconProps> = (p) => <Icon {...p} path={<><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></>} />;
export const IconSearch: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />} />;
export const IconEdit: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />} />;
export const IconRepeat: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M7 7h11v3l4-4-4-4v3H6a5 5 0 0 0-5 5v3h2V10a3 3 0 0 1 3-3zm10 10H6v-3l-4 4 4 4v-3h12a5 5 0 0 0 5-5v-3h-2v3a3 3 0 0 1-3 3z" />} />;
export const IconDollar: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.93.8 1.65 2.58 1.65 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.71c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.4z" />} />;
export const IconWallet: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />} />;
export const IconSettings: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>} />;
export const IconTrophy: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>} />;
export const IconDownload: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />} />;
export const IconFilter: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />} />;
export const IconMoreHoriz: React.FC<IconProps> = (p) => <Icon {...p} path={<path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />} />;
