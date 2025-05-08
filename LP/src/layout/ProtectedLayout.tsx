import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProtectedLayout() {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-dvh flex flex-col">
      <Navbar />

      <main className="flex-1 mt-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
