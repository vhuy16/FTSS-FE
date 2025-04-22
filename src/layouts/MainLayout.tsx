import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "@atom/header/Header";
import { PageWrapper } from "../styles/styles";
import Sidebar from "@atom/sidebar/Sidebar";
import ChatboxWidget from "@components/atom/ChatWidget/ChatWidget";

export type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <PageWrapper>
        <Header />
        <Sidebar />
        <div
          style={{
            minHeight: "calc(100vh - 545px)",
          }}
        >
          {children}
        </div>
        <Footer />
      </PageWrapper>
      <ChatboxWidget />
    </>
  );
};

export default MainLayout;
