import React, { useRef, useState, useEffect } from 'react';
import { Bell, Search, LogIn, LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';
import type { ActiveTab } from '../types';
import type { User as ApiUser } from '../types/api';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: ApiUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

function initials(user: ApiUser | null): string {
  if (!user) return '?';
  const a = user.first_name?.[0] ?? '';
  const b = user.last_name?.[0] ?? '';
  return (a + b).toUpperCase() || user.email[0]?.toUpperCase() || '?';
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  onOpenNotifications,
  unreadCount,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'board', label: 'Board' },
    { id: 'applications', label: 'Applications' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  const goSearch = (value: string) => {
    setSearchQuery(value);
    if (value && (activeTab === 'settings' || activeTab === 'analytics')) {
      setActiveTab('applications');
    }
  };

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-40 shadow-xs">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="flex items-center justify-between h-[64px] gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="font-display text-2xl md:text-3xl font-bold text-primary italic tracking-tight hover:opacity-90 transition-opacity"
            >
              iApply
            </button>

            {user && (
              <div className="hidden sm:flex items-center relative w-64 md:w-80">
                <Search className="w-4 h-4 absolute left-2.5 text-outline pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => goSearch(e.target.value)}
                  placeholder="Search applications, companies…"
                  className="w-full pl-9 pr-8 py-1.5 text-sm bg-surface-container-low border border-outline-variant/40 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-on-surface"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-xs text-outline hover:text-on-surface p-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {user && (
              <div className="sm:hidden relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => goSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-28 pl-7 pr-6 py-1 text-xs bg-surface-container-low border border-outline-variant/40 rounded-full text-on-surface"
                />
                <Search className="w-3.5 h-3.5 absolute left-2 top-1.5 text-outline" />
              </div>
            )}

            <button
              onClick={onToggleDarkMode}
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-all"
              aria-label="Toggle Dark Mode"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-primary" />}
            </button>

            {user && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest" />
                )}
              </button>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => (user ? setProfileDropdownOpen((v) => !v) : onOpenAuth())}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm border-2 border-primary-fixed shadow-xs">
                  {initials(user)}
                </div>
                {user && <ChevronDown className="w-4 h-4 text-on-surface-variant hidden md:block" />}
              </button>

              {profileDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-50">
                  <div className="px-4 py-3 border-b border-outline-variant/20">
                    <p className="font-semibold text-sm text-on-surface">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-outline" /> Edit Profile & Security
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error-container/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-error" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!user && (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary-container/50 rounded-full transition-colors"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        </div>

        {user && (
          <nav className="hidden md:flex items-center justify-center gap-10 h-[48px] border-t border-outline-variant/20 mx-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`h-full text-sm font-semibold transition-all flex items-center relative ${
                    isActive
                      ? 'text-primary border-b-2 border-primary font-bold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
