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
    title: 'Order',
    path: '/order',
    icon: icon('ic-ordermanagement'),
  },
  {
    title: 'Table',
    path: '/table',
    icon: icon('ic-table'),
  },
  {
    title: 'Billing and Payments',
    path: '/billing',
    icon: icon('ic-payment'),
  },
  {
    title: 'Menu',
    path: '/menu',
    icon: icon('ic-menu'),
  },
  {
    title: 'Inventory Management',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Staff Management',
    path: '/user',
    icon: icon('ic-user'),
  },
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
