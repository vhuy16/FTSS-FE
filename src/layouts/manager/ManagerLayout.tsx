import React, { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '@context/SidebarContext';
import AppHeader from '@layouts/admin/AppHeader';
import Backdrop from '@layouts/admin/Backdrop';
import ManagerSidebar from './ManagerSidebar';
import '../../admin.css';

export type AdminLayoutProps = {
    children: ReactNode;
};
const LayoutContent: React.FC<AdminLayoutProps> = ({ children }) => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex">
            <div>
                <ManagerSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out dark:bg-gray-900 ${
                    isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
                } ${isMobileOpen ? 'ml-0' : ''}`}
            >
                <AppHeader />
                <div className="p-4 mx-auto max-w-screen-2xl md:p-6">{children}</div>
            </div>
        </div>
    );
};

const ManagerLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
    );
};

export default ManagerLayout;
