import { Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './css/app.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Every route is its own chunk. The initial download is just React + the router
// + the loading screen; heavy pages (and three.js, which only the Velvet
// invitation pulls in) stream in on demand behind the brand loader.
const LandingPage = lazy(() => import('./components/LandingPage.jsx'));
const InvitationPage = lazy(() => import('./pages/InvitationPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminCustomerDetail = lazy(() => import('./pages/AdminCustomerDetail.jsx'));
const CreateCustomerPage = lazy(() => import('./pages/CreateCustomerPage.jsx'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard.jsx'));

// Fade out the pre-React boot screen once the app has mounted, but only after it
// has been visible long enough for the crest to finish drawing — so a fast load
// still gets the full moment instead of a jarring flash. The React LoadingScreen
// (Suspense fallback) is pixel-matched, so if a chunk is still in flight the
// hand-off is seamless.
function useDismissBootScreen() {
    useEffect(() => {
        const boot = document.getElementById('cv-boot');
        if (!boot) return undefined;

        const MIN_VISIBLE = 1100;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const wait = reduce ? 0 : Math.max(0, MIN_VISIBLE - performance.now());

        let removeTimer;
        const hideTimer = setTimeout(() => {
            boot.classList.add('cv-boot--hide');
            removeTimer = setTimeout(() => boot.remove(), 650);
        }, wait);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(removeTimer);
        };
    }, []);
}

function App() {
    useDismissBootScreen();

    return (
        <AuthProvider>
            <BrowserRouter>
                <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/invite/:token" element={<InvitationPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/customers/new"
                            element={
                                <ProtectedRoute role="admin">
                                    <CreateCustomerPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/customers/:id"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminCustomerDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute role="customer">
                                    <CustomerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </AuthProvider>
    );
}

createRoot(document.getElementById('app')).render(<App />);
