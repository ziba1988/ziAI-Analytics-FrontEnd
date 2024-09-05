import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
export const VerifyCodePage = Loadable(lazy(() => import('../pages/auth/VerifyCodePage')));
export const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPasswordPage')));
export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));

// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(lazy(() => import('../pages/dashboard/GeneralAppPage')));

// DASHBOARD: USER
export const UserProfilePage = Loadable(lazy(() => import('../pages/dashboard/UserProfilePage')));
export const UserAccountPage = Loadable(lazy(() => import('../pages/dashboard/UserAccountPage')));
export const UserCreatePage = Loadable(lazy(() => import('../pages/dashboard/UserCreatePage')));
export const OrderReviewPage = Loadable(lazy(() => import('../pages/dashboard/OrderReviewPage')));

// DASHBOARD: ADMIN
export const AdminListPage = Loadable(lazy(() => import('../pages/dashboard/UserListPage')));
export const AdminBearReview = Loadable(lazy(() => import('../pages/dashboard/AdminBearReview')));
// MAIN
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const PaymentSuccess = Loadable(lazy(() => import('../pages/PaymentSuccess')));
export const PaymentCancel = Loadable(lazy(() => import('../pages/PaymentCancel')));
export const HomePage = Loadable(lazy(() => import('../pages/HomePage')));
