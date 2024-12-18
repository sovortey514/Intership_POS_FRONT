import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  
  {
    title: 'POS',
    path: '/order',
    icon: icon('ic-table'),
    children: [
      {
        title: 'Order',
        path: '/billing',
        icon: icon('ic-payment'),
      },
      {
        title: 'Table',
        path: '/table',
        icon: icon('ic-ordermanagement'),
      },
      {
        title: 'Menu',
        path: '/menu',
        icon: icon('ic-menu'),
      },
    ],
  },
  {
    title: 'Inventory Management',
    path: '/products',
    icon: icon('ic-cart'),
    children: [
      {
        title: 'Food List',
        path: '/menu',
        icon: icon('ic-menu'),
      },
      {
        title: 'Categories',
        path: '/menu',
        icon: icon('ic-category'),
      },
      {
        title: 'Suppliers',
        path: '/menu',
        icon: icon('ic-supplier'),
      },
      {
        title: 'Purchase Orders',
        path: '/menu',
        icon: icon('ic-purchaseorders'),
      },
      {
        title: 'Alerts',
        path: '/menu',
        icon: icon('ic-alert'),
      },
      {
        title: 'History',
        path: '/menu',
        icon: icon('ic-history'),
      },
      {
        title: 'Report',
        path: '/menu',
        icon: icon('ic-report'),
      },
    ],
  },
  {
    title: 'Staff Management',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Setting',
    path: '/order',
    icon: icon('ic-settings'),
    children: [
      {
        title: 'Logout',
        path: '/sign-in',
        icon: icon('ic-lock'),
      },
      {
        title: 'Forget password',
        path: '/sign-up',
        icon: icon('ic-forgetpasswrod'),
      },
    ],
  },
];
