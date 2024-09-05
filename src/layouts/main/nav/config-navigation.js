// routes
import { PATH_AUTH } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="eva:home-fill" />,
    path: '/',
  },
  {
    title: 'Login',
    icon: <Iconify icon="eva:file-fill" />,
    path: PATH_AUTH.login,
  },
  {
    title: 'Register',
    icon: <Iconify icon="eva:file-fill" />,
    path: PATH_AUTH.register,
  },
];

export default navConfig;
