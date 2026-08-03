import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Kanban,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import type { ActiveTab } from './types';
import type { Application, ApplicationStatus } from './types/api';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { BoardView } from './components/BoardView';
import { ApplicationsView } from './components/ApplicationsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { ApplicationModal } from './components/ApplicationModal';
import { NotificationDrawer } from './components/NotificationDrawer';

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('iapply_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('iapply_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('iapply_theme', 'light');
    }
  }, [isDarkMode]);

  return [isDarkMode, () => setIsDarkMode((v) => !v)] as const;
}

function LoggedOutLanding({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-on-surface font-display italic">iApply</h1>
        <p className="text-sm text-on-surface-variant">
          Track every job application, interview, and offer in one secure pipeline. Sign in or create an
          account to get started — your data stays private to you.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover transition-all"
        >
          Sign In / Create Account
        </button>
      </div>
    </div>
  );
}

function AppShell() {
  const { user, isAuthenticated, isInitializing, logout } = useAuth();
  const { applications, reminders, error } = useData();

  const VALID_TABS: ActiveTab[] = ['dashboard', 'board', 'applications', 'analytics', 'settings'];

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const saved = sessionStorage.getItem('iapply_active_tab');
    return saved && VALID_TABS.includes(saved as ActiveTab) ? (saved as ActiveTab) : 'dashboard';
  });

  useEffect(() => {
    sessionStorage.setItem('iapply_active_tab', activeTab);
  }, [activeTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [modalInitialStatus, setModalInitialStatus] = useState<ApplicationStatus>('applied');

  const handleOpenAddModal = (initialStatus: ApplicationStatus = 'applied') => {
    setEditingApplication(null);
    setModalInitialStatus(initialStatus);
    setApplicationModalOpen(true);
  };

  const handleSelectApplicationToEdit = (app: Application) => {
    setEditingApplication(app);
    setApplicationModalOpen(true);
  };

  const unreadCount =
    applications.filter((a) => a.is_stale).length +
    reminders.filter((r) => !r.is_done && new Date(r.remind_at).getTime() <= Date.now() + 1000 * 60 * 60 * 24 * 3)
      .length;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={logout}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        unreadCount={unreadCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
        {!isAuthenticated ? (
          <LoggedOutLanding onOpenAuth={() => setAuthModalOpen(true)} />
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                onSelectApplication={handleSelectApplicationToEdit}
                onOpenAddModal={() => handleOpenAddModal('applied')}
                onNavigateTab={setActiveTab}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'board' && (
              <BoardView
                onSelectApplication={handleSelectApplicationToEdit}
                onOpenAddModal={handleOpenAddModal}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationsView
                onSelectApplication={handleSelectApplicationToEdit}
                onOpenAddModal={() => handleOpenAddModal('applied')}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsView />}

            {activeTab === 'settings' && (
              <SettingsView isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} onLogout={logout} />
            )}
          </>
        )}
      </main>

      {isAuthenticated && (
        <>
          <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-2 bg-surface-container-lowest/90 backdrop-blur-md shadow-lg rounded-t-2xl border-t border-outline-variant/30">
            {([
              ['dashboard', LayoutDashboard, 'Dashboard'],
              ['board', Kanban, 'Board'],
              ['applications', FileText, 'Apps'],
              ['analytics', BarChart3, 'Stats'],
              ['settings', SettingsIcon, 'Settings'],
            ] as const).map(([id, Icon, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all ${
                  activeTab === id ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => handleOpenAddModal('applied')}
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-hover active:scale-95 transition-all z-30"
            title="Add New Job Application"
          >
            <Plus className="w-8 h-8" />
          </button>
        </>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <ApplicationModal
        isOpen={applicationModalOpen}
        onClose={() => setApplicationModalOpen(false)}
        applicationToEdit={editingApplication}
        initialStatus={modalInitialStatus}
      />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onSelectApplication={(app) => {
          setNotificationDrawerOpen(false);
          handleSelectApplicationToEdit(app);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppShell />
      </DataProvider>
    </AuthProvider>
  );
}
