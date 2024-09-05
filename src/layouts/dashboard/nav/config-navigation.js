// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = {
  user: [
    // GENERAL
    // ----------------------------------------------------------------------
    // {
    //   subheader: 'general',
    //   items: [{ title: 'home', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard }],
    // },

    // USER
    // ----------------------------------------------------------------------
    {
      subheader: 'main',
      items: [
        // USER
        {
          title: 'User',
          path: PATH_DASHBOARD.user.root,
          icon: ICONS.user,
          children: [
            { title: 'generate Music', path: PATH_DASHBOARD.user.new },
            { title: 'your Account', path: PATH_DASHBOARD.user.account },
          ],
        },
      ],
    },
  ],
  admin: [
    // GENERAL
    // ----------------------------------------------------------------------
    // {
    //   subheader: 'general',
    //   items: [{ title: 'home', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard }],
    // },

    // USER
    // ----------------------------------------------------------------------
    {
      subheader: 'main',
      items: [
        // USER
        {
          title: 'Admin',
          path: PATH_DASHBOARD.admin.root,
          icon: ICONS.folder,
          children: [{ title: 'user List', path: PATH_DASHBOARD.admin.list }],
        },
      ],
    },
  ],
};

export default navConfig;
