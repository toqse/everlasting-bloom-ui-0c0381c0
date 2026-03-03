import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import LoadingAnimation from "@/components/LoadingAnimation";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import SearchProfiles from "./pages/SearchProfiles";
import ProfileDetail from "./pages/ProfileDetail";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import MembershipPage from "./pages/MembershipPage";
import AuthPage from "./pages/AuthPage";
import InterestReceived from "./pages/InterestReceived";
import InterestSent from "./pages/InterestSent";
import Favorites from "./pages/Favorites";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import DashboardInterests from "./pages/DashboardInterests";
import ChatListPage from "./pages/ChatListPage";
import PlanPage from "./pages/PlanPage";
import SettingsPage from "./pages/SettingsPage";
import MatchesPage from "./pages/MatchesPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading } = useLoading();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {isLoading && <LoadingAnimation key="loading" />}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<SearchProfiles />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/interests/received" element={<InterestReceived />} />
        <Route path="/interests/sent" element={<InterestSent />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/chat/:profileId" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/profile" element={<UserProfilePage />} />
        <Route path="/dashboard/interests" element={<DashboardInterests />} />
        <Route path="/dashboard/chat-list" element={<ChatListPage />} />
        <Route path="/dashboard/plan" element={<PlanPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/matches" element={<MatchesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LoadingProvider>
          <AppContent />
        </LoadingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
