// All components mapping with path for internal routes

import { User } from '@nextui-org/react'
import { lazy } from 'react'
const Order = lazy(() => import ('../pages/protected/Order'))
const Table = lazy(() => import ('../pages/protected/Table'))
const Menu = lazy(() => import ('../pages/protected/Menu'))
const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Team = lazy(() => import('../pages/protected/Team'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const TotalAsset = lazy(() => import('../pages/protected/TotalAsset'))
const AssetCount = lazy(() => import('../pages/protected/AssetCount'))
const HistoryCount = lazy(() => import('../pages/protected/HistoryCount'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const FoodList = lazy(() => import('../pages/protected/FoodList'))
const Category = lazy(() => import('../pages/protected/Category'))
const Suppliers = lazy(() => import('../pages/protected/Suppliers'))
const PurchaseOrder = lazy(() => import('../pages/protected/PurchaseOrder'))
const Alert = lazy(() => import('../pages/protected/Alert'))
const History = lazy(() => import('../pages/protected/History'))
const Report = lazy(() => import('../pages/protected/Report'))


const ManageUser = lazy(() => import('../pages/protected/ManageUser'))

const routes = [
  {
    path: '/dashboard', 
    component: Dashboard, 
  },
  {
    path: '/usermanagement', 
    component: ManageUser, 
  },
  {
    path: '/welcome', 
    component: Welcome, 
  },
  {
    path: '/leads',
    component: Leads,
  },
  {
    path: '/settings-team',
    component: Team,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/assetmanagement-assetcount',
    component:AssetCount,
  },
  {
    path: '/assetmanagement-totalasset',
    component: TotalAsset,
  },
  {
    path: '/assetmanagement-historyasset',
    component: HistoryCount,
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/integration',
    component: Integration,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },

  {
    path: '/pos-order',
    component: Order,
  },

  {
    path: '/pos-table',
    component: Table,
  },

  {
    path: '/pos-menu',
    component: Menu,
  },

  {
    path: '/pos-menu',
    component: Menu,
  },

  {
    path: '/inventory-foodlist',
    component: FoodList,
  },

  {
    path: '/inventory-category',
    component: Category,
  },
  {
    path: '/inventory-suppliers',
    component: Suppliers,
  },
  {
    path: '/inventory-purchase-order',
    component: PurchaseOrder,
  },
  {
    path: '/inventory-alert',
    component: Alert,
  },

  {
    path: '/inventory-history',
    component: History,
  },

  {
    path: '/inventory-report',
    component: Report,
  },
]

export default routes
