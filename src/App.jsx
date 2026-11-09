import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { DataProvider } from "@/contexts/DataContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SplashOverlay } from "@/components/design/SplashOverlay";

// Routes & Guards
import ProtectedRoute from "@/routes/ProtectedRoute";
import RequireProfile from "@/routes/RequireProfile";
import DriverRoute from "@/routes/DriverRoute";
import AdminRoute from "@/routes/AdminRoute";
import TabLayout from "@/components/design/TabLayout";

// Public / Auth Pages
import Welcome from "@/pages/onboarding/Welcome";
import Language from "@/pages/onboarding/Language";
import ProfileSetup from "@/pages/onboarding/ProfileSetup";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import LandingPage from "@/pages/LandingPage";

// Entrepreneur App Pages
import Home from "@/pages/app/Home";
import BookingMode from "@/pages/app/BookingMode";
import BookingSummary from "@/pages/app/BookingSummary";
import Payment from "@/pages/app/Payment";
import Tracking from "@/pages/app/Tracking";
import Bookings from "@/pages/app/Bookings";
import Profile from "@/pages/app/Profile";

// Driver App Pages
import DriverHome from "@/pages/driver/DriverHome";
import DriverTripDetails from "@/pages/driver/DriverTripDetails";
import DriverEarnings from "@/pages/driver/DriverEarnings";
import DriverProfile from "@/pages/driver/DriverProfile";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEntrepreneurs from "@/pages/admin/AdminEntrepreneurs";
import AdminDrivers from "@/pages/admin/AdminDrivers";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminSharedTrips from "@/pages/admin/AdminSharedTrips";
import AdminParcels from "@/pages/admin/AdminParcels";
import AdminIVR from "@/pages/admin/AdminIVR";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <ProfileProvider>
            <DataProvider>
              <BrowserRouter>
                <SplashOverlay />
              <Routes>
                {/* Public Onboarding & Auth Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/language" element={<Language />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Entrepreneur Profile Setup (Protected) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile-setup" element={<ProfileSetup />} />
                </Route>

                {/* Entrepreneur Main App (Protected + RequireProfile) */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<RequireProfile />}>
                    {/* Tab Navigation Pages */}
                    <Route element={<TabLayout />}>
                      <Route path="/app" element={<Home />} />
                      <Route path="/book" element={<Home />} />
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Booking & Tracking Flows */}
                    <Route path="/booking/new" element={<BookingMode />} />
                    <Route path="/booking/:id" element={<BookingSummary />} />
                    <Route path="/booking/:id/pay" element={<Payment />} />
                    <Route path="/track/:id" element={<Tracking />} />
                  </Route>
                </Route>

                {/* Driver Partner App */}
                <Route path="/driver" element={<DriverRoute />}>
                  <Route index element={<DriverHome />} />
                  <Route path="trips/:id" element={<DriverTripDetails />} />
                  <Route path="earnings" element={<DriverEarnings />} />
                  <Route path="profile" element={<DriverProfile />} />
                </Route>

                {/* Admin Operations Dashboard */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="shared-trips" element={<AdminSharedTrips />} />
                  <Route path="parcels" element={<AdminParcels />} />
                  <Route path="entrepreneurs" element={<AdminEntrepreneurs />} />
                  <Route path="drivers" element={<AdminDrivers />} />
                  <Route path="ivr" element={<AdminIVR />} />
                  <Route path="payments" element={<AdminPayments />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </ProfileProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
}
