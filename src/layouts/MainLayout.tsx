import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "@atom/header/Header";
import { PageWrapper } from "../styles/styles";
import Sidebar from "@atom/sidebar/Sidebar";

export type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
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
  );
};

export default MainLayout;
