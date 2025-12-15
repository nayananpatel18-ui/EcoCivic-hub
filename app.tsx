import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import routes from './routes';
import NotFound from './pages/NotFound';
import { storageService } from './services/storage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    storageService.initializeDefaultData();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;
