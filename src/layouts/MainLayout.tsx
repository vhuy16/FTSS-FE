import { ReactNode, useState } from 'react';
import Footer from './Footer';
import Header from '@atom/header/Header';
import { PageWrapper } from '../styles/styles';
import Sidebar from '@atom/sidebar/Sidebar';
import ChatboxWidget from '@components/atom/ChatWidget/ChatWidget';

export type MainLayoutProps = {
    children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const openModal = () => {
        setShowChatModal(true);
    };
    const closeModal = () => setShowChatModal(false);
    const [showChatModal, setShowChatModal] = useState(false);
    return (
        <>
            <PageWrapper>
                <Header />
                <Sidebar />
                <div
                    style={{
                        minHeight: 'calc(100vh - 200px)',
                    }}
                >
                    {children}
                </div>
                <Footer />
            </PageWrapper>
            <ChatboxWidget isOpen={showChatModal} onClose={closeModal} setIsOpen={setShowChatModal} />
        </>
    );
};

export default MainLayout;
