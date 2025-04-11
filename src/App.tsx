import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./interface/Interface";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useToast } from "./contexts/AppContext";
import AddHotel from "./pages/AddHotel";
import MyHotel from "./pages/MyHotel";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import DetailSec from "./pages/DetailSec";
import Booking from "./pages/Booking";
import MyBooking from "./pages/MyBooking";
import Home from "./pages/Home";

// New authentication pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Footer pages for "Explore" and "Company" sections
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import AllHotels from "./pages/AllHotels";
import FeaturedStays from "./pages/FeaturedStays";
import TrendingDestinations from "./pages/TrendingDestinations";

const App = () => {
  const { isLoggedIn } = useToast();

  // Create a wrapper component that can access location for redirects
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    if (!isLoggedIn) {
      return <Navigate to="/sign-in" state={{ from: location }} />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
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
        
        {/* New authentication routes */}
        
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

        {/* Note: Privacy Policy, Terms of Service, and Cookie Policy are now handled by modals instead of routes */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;