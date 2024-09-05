import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import MainLayout from '../layouts/main';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
//
import {
  // Auth
  LoginPage,
  RegisterPage,
  VerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  // Dashboard: General
  // GeneralAppPage,
  UserCreatePage,
  OrderReviewPage,
  UserAccountPage,
  AdminListPage,
  AdminBearReview,
  //
  Page404,
  PaymentSuccess,
  PaymentCancel,
  HomePage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/user/new" replace />, index: true },
        // { path: 'app', element: <GeneralAppPage /> },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/new" replace />, index: true },
            { path: 'new', element: <UserCreatePage /> },
            { path: 'review', element: <OrderReviewPage /> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        },
        {
          path: 'admin',
          children: [
            { element: <Navigate to="/dashboard/admin/list" replace />, index: true },
            { path: 'list', element: <AdminListPage /> },
            { path: 'detail', element: <AdminBearReview /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [{ element: <HomePage />, index: true }],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: 'payment/success', element: <PaymentSuccess /> },
        { path: 'payment/fail', element: <PaymentCancel /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
