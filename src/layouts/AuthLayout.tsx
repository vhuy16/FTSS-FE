import { ReactNode } from 'react';
import Footer from './Footer';
import AuthHeader from './AuthHeader';
import { PageWrapper } from 'styles/styles';

export type AuthLayoutProps = {
    children: ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <PageWrapper>
            <AuthHeader />
            <main
                style={{
                    minHeight: 'calc(100vh - 280px)',
                }}
            >
                {children}
            </main>
            <Footer />
        </PageWrapper>
    );
};

export default AuthLayout;
