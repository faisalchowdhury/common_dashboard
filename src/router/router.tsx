import { createBrowserRouter, Navigate } from "react-router";

import ProtectedRoute from "../auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/login/Login";
import Overview from "../pages/overview/Overview";
import Users from "../pages/users/Users";
import Settings from "../pages/settings/Settings";
import Account from "../pages/account/Account";

/**
 * Everything inside <ProtectedRoute> requires a signed-in admin; everything
 * inside <DashboardLayout> renders in the sidebar + topbar shell.
 *
 * To add a section: create the page under `src/pages/`, add a child route
 * here, and add a matching entry to NAV_ITEMS in `src/layouts/Sidebar.tsx`.
 */
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/", element: <Overview /> },
          { path: "/users", element: <Users /> },
          { path: "/settings", element: <Settings /> },
          { path: "/account", element: <Account /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
