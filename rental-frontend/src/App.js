import './App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import { HomePage } from './pages/HomePage';
import { MyListingsPage } from './pages/MyListingsPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AppProvider, useAppContext } from './components/context/AppContext';
import { LoginModal } from './modals/LoginModal';
import { PrivateRoute, ResetPasswordRoute } from './components/RouteGuards';

function RouterOutlet() {
  const { authModalOpen, authModalFlow, closeAuthModal } = useAppContext();
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/my-listings"
          element={
            <PrivateRoute>
              <MyListingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ResetPasswordRoute>
              <ResetPasswordPage />
            </ResetPasswordRoute>
          }
        />
      </Routes>
      {authModalOpen && (
        <LoginModal onClose={closeAuthModal} initialFlow={authModalFlow} />
      )}
    </>
  );
}

export default function App() {
  const basename =
    process.env.NODE_ENV === 'production'
      ? (process.env.PUBLIC_URL || '').replace(/\/$/, '') || undefined
      : undefined;

  return (
    <HashRouter basename={basename}>
      <AppProvider>
        <RouterOutlet />
      </AppProvider>
    </HashRouter>
  );
}
