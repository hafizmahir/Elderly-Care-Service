/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { RouterProvider, useRouter } from './router/Router.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { ServiceDetailPage } from './pages/ServiceDetailPage.js';
import { BookingPage } from './pages/BookingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { MyBookingsPage } from './pages/MyBookingsPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

const AppRoutes: React.FC = () => {
  const { path } = useRouter();

  const renderRoute = () => {
    // 1. Home
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    // 2. Services Page
    if (path === '/services') {
      return <ServicesPage />;
    }

    // 3. About Page
    if (path === '/about') {
      return <AboutPage />;
    }

    // 4. Contact Page
    if (path === '/contact') {
      return <ContactPage />;
    }

    // 5. Service Detail Page (/service/:service_id)
    if (path.startsWith('/service/')) {
      return <ServiceDetailPage />;
    }

    // 6. Booking Page (/booking/:service_id) - Private Route
    if (path.startsWith('/booking/')) {
      return <BookingPage />;
    }

    // 7. Authentication
    if (path === '/login') {
      return <LoginPage />;
    }
    if (path === '/register') {
      return <RegisterPage />;
    }

    // 8. My Booking Page (/my-bookings) - Private Route
    if (path === '/my-bookings') {
      return <MyBookingsPage />;
    }

    // 9. Admin Dashboard (/admin)
    if (path === '/admin') {
      return <AdminDashboardPage />;
    }

    // 10. Error Page (404)
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d12] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        {renderRoute()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <AppRoutes />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
