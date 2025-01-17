import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoute, RouteType } from '@routes/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { GlobalStyles } from '@styles/global/GlobalStyles';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
    return (
        <div className="App">
            <Router>
                <GlobalStyles />
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
            </Router>
            <ToastContainer />
        </div>
    );
}

export default App;
