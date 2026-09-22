import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Kanban,
    FileText,
    BarChart3,
    Settings as SettingsIcon,
    Plus,
    Loader2,
} from "lucide-react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider, useData } from "./context/DataContext";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { BoardView } from "./components/BoardView";
import { ApplicationsView } from "./components/ApplicationsView";
import { AnalyticsView } from "./components/AnalyticsView";
import { SettingsView } from "./components/SettingsView";
import { AuthModal } from "./components/AuthModal";
import { ApplicationModal } from "./components/ApplicationModal";
import { NotificationDrawer } from "./components/NotificationDrawer";
import { LandingPage } from "./components/LandingPage";
import { Footer } from "./components/Footer";
import { LegalModal } from "./components/LegalModal";
import { LogoutConfirmModal } from "./components/LogoutConfirmModal";
import ScrollToTop from "./components/ScrollToTop";

const VALID_TABS = [
    "dashboard",
    "board",
    "applications",
    "analytics",
    "settings",
];

// Page transition variants
const pageVariants = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:    { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } },
};

function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("iapply_theme");
        if (saved) return saved === "dark";
        return (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        );
    });
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("iapply_theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("iapply_theme", "light");
        }
    }, [isDarkMode]);
    return [isDarkMode, () => setIsDarkMode((v) => !v)];
}

function AppShell() {
    const { user, isAuthenticated, isInitializing, logout } = useAuth();
    const { applications, reminders, error } = useData();
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab = location.pathname.split("/")[1] || "dashboard";

    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [applicationModalOpen, setApplicationModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [modalInitialStatus, setModalInitialStatus] = useState("applied");
    const [legalModalOpen, setLegalModalOpen] = useState(false);
    const [legalModalTab, setLegalModalTab] = useState("privacy");

    const handleOpenLegal = (tab = "privacy") => {
        setLegalModalTab(tab);
        setLegalModalOpen(true);
    };
    const handleOpenAddModal = (initialStatus = "applied") => {
        setEditingApplication(null);
        setModalInitialStatus(initialStatus);
        setApplicationModalOpen(true);
    };
    const handleSelectApplicationToView = (app) => {
        setEditingApplication(app);
        setApplicationModalOpen(true);
    };
    const unreadCount =
        applications.filter((a) => a.is_stale).length +
        reminders.filter(
            (r) =>
                !r.is_done &&
                new Date(r.remind_at).getTime() <=
                    Date.now() + 1000 * 60 * 60 * 24 * 7
        ).length;

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
            <Header
                activeTab={activeTab}
                setActiveTab={(tab) => navigate(`/${tab}`)}
                user={user}
                onOpenAuth={() => setAuthModalOpen(true)}
                onLogout={() => setLogoutConfirmOpen(true)}
                onOpenNotifications={() => setNotificationDrawerOpen(true)}
                unreadCount={unreadCount}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
            />

            <main
                className={`flex-1 w-full ${isAuthenticated ? "max-w-[1440px] mx-auto px-4 md:px-10 py-6" : ""}`}
            >
                {!isAuthenticated ? (
                    <>
                        <LandingPage
                            onOpenAuth={() => setAuthModalOpen(true)}
                            onOpenLegal={handleOpenLegal}
                        />
                        <Footer onOpenLegal={handleOpenLegal} />
                    </>
                ) : (
                    <>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route
                                    path="/"
                                    element={<Navigate to="/dashboard" replace />}
                                />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <motion.div
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                        >
                                            <DashboardView
                                                onSelectApplication={handleSelectApplicationToView}
                                                onOpenAddModal={() => handleOpenAddModal("applied")}
                                                onNavigateTab={(tab) => navigate(`/${tab}`)}
                                                searchQuery={searchQuery}
                                            />
                                        </motion.div>
                                    }
                                />
                                <Route
                                    path="/board"
                                    element={
                                        <motion.div
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                        >
                                            <BoardView
                                                onSelectApplication={handleSelectApplicationToView}
                                                onOpenAddModal={handleOpenAddModal}
                                                searchQuery={searchQuery}
                                            />
                                        </motion.div>
                                    }
                                />
                                <Route
                                    path="/applications"
                                    element={
                                        <motion.div
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                        >
                                            <ApplicationsView
                                                onSelectApplication={handleSelectApplicationToView}
                                                onOpenAddModal={() => handleOpenAddModal("applied")}
                                                searchQuery={searchQuery}
                                                setSearchQuery={setSearchQuery}
                                            />
                                        </motion.div>
                                    }
                                />
                                <Route
                                    path="/analytics"
                                    element={
                                        <motion.div
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                        >
                                            <AnalyticsView />
                                        </motion.div>
                                    }
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <motion.div
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                        >
                                            <SettingsView
                                                isDarkMode={isDarkMode}
                                                onToggleDarkMode={toggleDarkMode}
                                                onLogout={() => setLogoutConfirmOpen(true)}
                                                onOpenLegal={handleOpenLegal}
                                            />
                                        </motion.div>
                                    }
                                />
                            </Routes>
                        </AnimatePresence>
                    </>
                )}
            </main>

            {/* Mobile bottom nav + FAB */}
            {isAuthenticated && (
                <>
                    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-2 bg-surface-container-lowest/90 backdrop-blur-md shadow-lg rounded-t-2xl border-t border-outline-variant/30">
                        {[
                            ["dashboard", LayoutDashboard, "Dashboard"],
                            ["board", Kanban, "Board"],
                            ["applications", FileText, "Apps"],
                            ["analytics", BarChart3, "Stats"],
                            ["settings", SettingsIcon, "Settings"],
                        ].map(([id, Icon, label]) => (
                            <button
                                key={id}
                                onClick={() => navigate(`/${id}`)}
                                className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all cursor-pointer ${activeTab === id ? "bg-primary-container text-on-primary-container font-bold" : "text-on-surface-variant"}`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{label}</span>
                            </button>
                        ))}
                    </nav>

                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => handleOpenAddModal("applied")}
                        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-30 cursor-pointer"
                        title="Add New Job Application"
                    >
                        <Plus className="w-8 h-8" />
                    </motion.button>
                </>
            )}

            {/* Overlays */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
            />
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
                    handleSelectApplicationToView(app);
                }}
            />
            <LegalModal
                isOpen={legalModalOpen}
                onClose={() => setLegalModalOpen(false)}
                initialTab={legalModalTab}
            />
            <LogoutConfirmModal
                isOpen={logoutConfirmOpen}
                onClose={() => setLogoutConfirmOpen(false)}
                onConfirm={logout}
            />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <AuthProvider>
                <DataProvider>
                    <AppShell />
                </DataProvider>
            </AuthProvider>
        </Router>
    );
}
