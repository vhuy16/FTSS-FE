import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { publicRoute, RouteType } from '@routes/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { GlobalStyles } from '@styles/global/GlobalStyles';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
function AppContent() {
    const location = useLocation();
    const isAdminRoute =
        location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/listUser') ||
        location.pathname.startsWith('/listOrder') ||
        location.pathname.startsWith('/listProduct') ||
        location.pathname.startsWith('/listSetup') ||
        location.pathname.startsWith('/listCategory') ||
        location.pathname.startsWith('/listSubCategory') ||
        location.pathname.startsWith('/manager/profile') ||
        location.pathname.startsWith('/calendar') ||
        location.pathname.startsWith('/listBooking') ||
        location.pathname.startsWith('/addMission') ||
        location.pathname.startsWith('/listService');
    return (
        <div className="App">
            {!isAdminRoute && <GlobalStyles />}
            <Routes>
                {publicRoute.map((route: RouteType, index: number) => {
                    const Page = route.component;
                    let Layout = null;
                    if (route.layout === null) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <>
                                        <Page />
                                    </>
                                }
                            />
                        );
                    } else {
                        Layout = route.layout ?? React.Fragment;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    }
                })}
            </Routes>
            <ToastContainer />
        </div>
    );
}

export default App;
