import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Landing from "./pages/Landing";
import ReportHistory from "./pages/ReportHistory";
import Insights from "./pages/Insights";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Workflow from "./pages/Workflow";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Landing />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Layout>
            <ForgotPassword />
          </Layout>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <Layout>
            <ResetPassword />
          </Layout>
        }
      />

      <Route
        path="/reports"
        element={
          <Layout>
            <ReportHistory />
          </Layout>
        }
      />
      <Route
        path="/insights"
        element={
          <Layout>
            <Insights />
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
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/workflow"
        element={
          <Layout>
            <Workflow />
          </Layout>
        }
      />
    </Routes>
  );
}
