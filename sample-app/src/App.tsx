import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import ServiceList from './components/ServiceList';
import BookingSlots from './components/BookingSlots';
import MyBookings from './components/MyBookings';
import { ToastContainer, useToast } from './components/Toast';
import { User, Service } from './types';

type View = 'landing' | 'services' | 'booking' | 'myBookings';
type AuthModal = 'none' | 'login' | 'register';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [authModal, setAuthModal] = useState<AuthModal>('none');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    // Check authentication state on page load
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setCurrentView('services');
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAuthModal('none');
    setCurrentView('services');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('landing');
    setSelectedService(null);
  };

  const handleGoToTop = () => {
    setCurrentView('landing');
    setSelectedService(null);
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setCurrentView('booking');
  };

  const handleBookingComplete = () => {
    setCurrentView('services');
    setSelectedService(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBackToServices = () => {
    setCurrentView('services');
    setSelectedService(null);
  };

  // ランディングページ表示
  if (currentView === 'landing') {
    return (
      <div className="App">
        <header className="landing-header">
          <div className="header-content">
            <h1 className="header-logo clickable" onClick={handleGoToTop}>🧘‍♀️ ヨガ教室予約</h1>
            <div className="header-actions">
              {user ? (
                <>
                  <button className="btn-header-services" onClick={() => setCurrentView('services')}>
                    レッスン予約
                  </button>
                  <button className="btn-header-logout" onClick={handleLogout}>
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-header-login" onClick={() => setAuthModal('login')}>
                    ログイン
                  </button>
                  <button className="btn-header-register" onClick={() => setAuthModal('register')}>
                    新規登録
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
        <LandingPage 
          onShowLogin={() => setAuthModal('login')}
          onShowRegister={() => setAuthModal('register')}
        />
        
        {/* 認証モーダル */}
        {authModal !== 'none' && (
          <div className="modal-overlay" onClick={() => setAuthModal('none')}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setAuthModal('none')}>
                ✕
              </button>
              <Login 
                onLoginSuccess={handleLoginSuccess}
                initialMode={authModal}
              />
            </div>
          </div>
        )}
        
        {/* トースト通知 */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  // ログイン後のメインアプリ
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title clickable" onClick={handleGoToTop}>🧘‍♀️ ヨガ教室予約</h1>
          <div className="header-actions">
            <span className="user-name">こんにちは、{user?.name}さん</span>
            <button className="btn-logout" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${currentView === 'services' ? 'active' : ''}`}
          onClick={() => setCurrentView('services')}
        >
          レッスン一覧
        </button>
        <button
          className={`nav-tab ${currentView === 'myBookings' ? 'active' : ''}`}
          onClick={() => setCurrentView('myBookings')}
        >
          予約一覧
        </button>
      </nav>

      <main className="main-content">
        {currentView === 'services' && (
          <ServiceList onSelectService={handleSelectService} />
        )}
        {currentView === 'booking' && selectedService && (
          <BookingSlots
            service={selectedService}
            onBookingComplete={handleBookingComplete}
            onBack={handleBackToServices}
            showToast={showToast}
          />
        )}
        {currentView === 'myBookings' && (
          <MyBookings 
            onBack={handleBackToServices} 
            refreshTrigger={refreshTrigger}
            showToast={showToast}
          />
        )}
      </main>
      
      {/* トースト通知 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
