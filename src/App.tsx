// Update to App.tsx - Add admin routes

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./interface/Interface";
import Register from "./pages/auth/Register";
import SignIn from "./pages/auth/SignIn";
import { useToast } from "./contexts/AppContext";
import AddHotel from "./pages/hotel/AddHotel";
import MyHotel from "./pages/hotel/MyHotel";
import EditHotel from "./pages/hotel/EditHotel";
import Search from "./pages/search/Search";
import DetailSec from "./pages/hotel/DetailSec";
import Booking from "./pages/booking/Booking";
import MyBooking from "./pages/booking/MyBooking";
import Home from "./pages/Home";

// New authentication pages
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Footer pages for "Explore" and "Company" sections
import AboutUs from "./pages/info/AboutUs";
import Contact from "./pages/info/Contact";
import Careers from "./pages/info/Careers";
import AllHotels from "./pages/hotel/AllHotels";
import FeaturedStays from "./pages/hotel/FeaturedStays";
import TrendingDestinations from "./pages/hotel/TrendingDestinations";
import HotelBookings from "./pages/booking/HotelBookings ";

// Admin components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard"
import AdminUsers from "./pages/admin/Users";
import AdminHotels from "./pages/admin/Hotels";
import AdminHotelDetail from "./pages/admin/HotelDetail";
import AdminBookings from "./pages/admin/Bookings";
import AdminMessages from "./pages/admin/Messages";

const App = () => {
  const { isLoggedIn, isAdmin } = useToast();

  // Create a wrapper component that can access location for redirects
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    if (!isLoggedIn) {
      return <Navigate to="/sign-in" state={{ from: location }} />;
    }
    return <>{children}</>;
  };

  // Create an admin-only route wrapper
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    if (!isLoggedIn || !isAdmin) {
      return <Navigate to="/" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        {/* Main Site Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />

        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <DetailSec />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        {/* Authentication routes */}
        <Route
          path="/forgot-password"
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Layout>
              <ResetPassword />
            </Layout>
          }
        />

        {/* Hotel booking route - protected with location handling */}
        <Route
          path="/hotel/:hotelId/booking"
          element={
            <Layout>
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Other protected routes */}
        {isLoggedIn && (
          <>
            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />

            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />

            <Route
              path="/my-hotel"
              element={
                <Layout>
                  <MyHotel />
                </Layout>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBooking />
                </Layout>
              }
            />

            <Route
              path="/hotel-bookings/:hotelId"
              element={
                <Layout>
                  <HotelBookings />
                </Layout>
              }
            />
          </>
        )}

        {/* Footer Pages - Explore Section */}
        <Route
          path="/hotels"
          element={
            <Layout>
              <AllHotels />
            </Layout>
          }
        />
        <Route
          path="/featured"
          element={
            <Layout>
              <FeaturedStays />
            </Layout>
          }
        />

        <Route
          path="/trending"
          element={
            <Layout>
              <TrendingDestinations />
            </Layout>
          }
        />

        {/* Footer Pages - Company Section */}
        <Route
          path="/about"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/careers"
          element={
            <Layout>
              <Careers />
            </Layout>
          }
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="hotels" element={<AdminHotels />} />
          <Route path="hotels/:hotelId" element={<AdminHotelDetail />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;