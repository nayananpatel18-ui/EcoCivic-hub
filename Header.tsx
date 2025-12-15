import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Leaf, LogOut, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => {
    logout();
    toast.success(t('auth.logoutSuccess'));
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/trees', label: t('nav.trees') },
    { path: '/issues', label: t('nav.issues') },
    { path: '/awareness', label: t('nav.awareness') },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary hidden sm:block">
                {t('app.name')}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary bg-muted'
                    : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                  location.pathname === '/admin'
                    ? 'text-primary bg-muted'
                    : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{t('nav.admin')}</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="hi">हिं</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
              </SelectContent>
            </Select>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">{t('nav.login')}</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
