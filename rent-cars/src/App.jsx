import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import SharedLayout from "./components/SharedLayout/SharedLayout";

import { UserProvider } from './context/UserContext';

const HomePage = lazy(() => import("./pages/HomePage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const FavoritePage = lazy(() => import("./pages/FavoritePage"));

const RegisterPage = lazy(() => import("./pages/RegisterOwner"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const RegisterCar = lazy(() => import("./pages/RegisterCar"));
const Notifications = lazy(() => import("./pages/NotificationPage"));

function App() {
  return (
    <UserProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<HomePage />}></Route>
            <Route path="catalog" element={<CatalogPage />}></Route>

            <Route path="owner/create" element={<RegisterPage />}></Route>
            <Route path="owner/login" element={<LoginPage />}></Route>
            <Route path="owner/profile" element={<ProfilePage />}></Route>
            <Route path="car/newcar" element={<RegisterCar />}></Route>
            <Route path="owner/notifications" element={<Notifications />}></Route>

            <Route path="favorites" element={<FavoritePage />}></Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Route>
        </Routes>
      </Suspense>
    </UserProvider>
  );
}

export default App;
