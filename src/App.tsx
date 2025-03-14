import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./interface/Interface";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useToast } from "./contexts/AppContext";
import AddHotel from "./pages/AddHotel";

const App = () => {
  const {isLoggedIn} = useToast();
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
              <p>Home Page</p>
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

        {isLoggedIn &&(<>
        <Route path="/add-hotel" element={
          <Layout>
            <AddHotel />
          </Layout>
        }/>
        </>)}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
