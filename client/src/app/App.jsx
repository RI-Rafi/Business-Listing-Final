import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '../state/authStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Listings from '../pages/Listings';
import ListingDetail from '../pages/ListingDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Bookmarks from '../pages/Bookmarks';
import NewListing from '../pages/NewListing';
import EditListing from '../pages/EditListing';
import Cart from '../pages/Cart';
import MarketplaceCategory from '../pages/MarketplaceCategory';
import MapPage from '../pages/MapPage';
import AIChat from '../components/AIChat';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthRedirect from '../components/AuthRedirect';
import NotFound from '../pages/NotFound';

function AppContent() {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className={isMapPage ? 'h-screen flex flex-col' : 'min-h-screen flex flex-col'}>
        {!isMapPage && <Header />}
        <main className={isMapPage ? 'flex-1' : 'flex-grow'}>
          <Routes>
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/home" element={<Home />} />
            <Route path="/marketplace/:category" element={<MarketplaceCategory />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <MapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/new"
              element={
                <ProtectedRoute>
                  <NewListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/:id/edit"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isMapPage && <Footer />}
        {!isMapPage && <AIChat />}
      </div>
    </>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

