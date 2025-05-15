import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthRedirect from "./AuthRedirect";
import React, { Suspense } from "react";
import withAuth from "./hoc/withAuth";
import NavBar from "./components/NavBar/NavBar";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const savedAuth = localStorage.getItem("auth");
if (savedAuth) {
  queryClient.setQueryData(["auth"], JSON.parse(savedAuth));
}

const LazyComponents = {
  LoginPage: React.lazy(() =>
    import("./components").then((module) => ({ default: module.LoginPage }))
  ),
  ProductListPage: React.lazy(() =>
    import("./components").then((module) => ({
      default: withAuth(module.ProductListPage),
    }))
  ),
  ProductDetailPage: React.lazy(() =>
    import("./components").then((module) => ({
      default: withAuth(module.ProductDetailPage),
    }))
  ),
  CartPage: React.lazy(() =>
    import("./components").then((module) => ({
      default: withAuth(module.CartPage),
    }))
  ),
  ProfilePage: React.lazy(() =>
    import("./components").then((module) => ({
      default: withAuth(module.ProfilePage),
    }))
  ),
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading page...</div>}>
        <Router>
          <AuthProvider>
            <NavBar />
            <Routes>
              <Route path="/login" element={<LazyComponents.LoginPage />} />
              <Route
                path="/products"
                element={<LazyComponents.ProductListPage />}
              />
              <Route
                path="/products/:id"
                element={<LazyComponents.ProductDetailPage />}
              />
              <Route path="/cart" element={<LazyComponents.CartPage />} />
              <Route path="/profile" element={<LazyComponents.ProfilePage />} />
              <Route path="/" element={<AuthRedirect />} />
            </Routes>
          </AuthProvider>
        </Router>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
