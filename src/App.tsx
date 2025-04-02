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
              <p>Home Page</p>
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

        {/* Hotel booking route - protected but with cleaner way to pass location */}
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
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;