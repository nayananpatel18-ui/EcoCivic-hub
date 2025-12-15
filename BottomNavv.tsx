import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, TreePine, AlertCircle, BookOpen } from 'lucide-react';

const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/trees', label: t('nav.trees'), icon: TreePine },
    { path: '/issues', label: t('nav.issues'), icon: AlertCircle },
    { path: '/awareness', label: t('nav.awareness'), icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-soft-xl backdrop-blur-sm bg-card/95">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all relative ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                isActive ? 'bg-primary/10' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
