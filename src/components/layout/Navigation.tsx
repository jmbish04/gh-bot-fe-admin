import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Command, 
  BookOpen, 
  Activity, 
  Settings,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {
  // Use local state temporarily to avoid Zustand issues
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const unreadCount = 0; // Hardcoded for now

  const toggle = () => setIsOpen(!isOpen);

  const navigationItems = [
    {
      name: 'Research',
      href: '/admin/research',
      icon: Search,
      current: currentPage === 'research',
    },
    {
      name: 'Commands',
      href: '/admin/commands',
      icon: Command,
      current: currentPage === 'commands',
    },
    {
      name: 'Best Practices',
      href: '/admin/practices',
      icon: BookOpen,
      current: currentPage === 'practices',
    },
    {
      name: 'Operations',
      href: '/admin/operations',
      icon: Activity,
      current: currentPage === 'operations',
    },
  ];

  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggle}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Command className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">GH BOT Admin</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Close sidebar on navigation
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t space-y-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <Bell className="h-4 w-4 mr-3" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleThemeToggle}
            >
              {getThemeIcon()}
              <span className="ml-3 capitalize">{theme}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggle}
        />
      )}
    </>
  );
};

export default Navigation;
