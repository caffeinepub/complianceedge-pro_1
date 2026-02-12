import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCurrentUser } from './hooks/useCurrentUser';
import SignInScreen from './components/auth/SignInScreen';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import DashboardLayout from './layout/DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import TradeImportPage from './pages/data-entry/TradeImportPage';
import ClientManagementPage from './pages/clients/ClientManagementPage';
import MarginCollateralPage from './pages/margin/MarginCollateralPage';
import BankReconciliationPage from './pages/reconciliation/BankReconciliationPage';
import ReportLibraryPage from './pages/reports/ReportLibraryPage';
import ReportWizardPage from './pages/reports/ReportWizardPage';
import ScheduledReportsPage from './pages/reports/ScheduledReportsPage';
import RegulatoryCalendarPage from './pages/compliance/RegulatoryCalendarPage';
import SurveillanceAlertsPage from './pages/surveillance/SurveillanceAlertsPage';
import AuditTrailPage from './pages/audit/AuditTrailPage';
import ConfigurationHomePage from './pages/config/ConfigurationHomePage';
import ExchangeSettingsPage from './pages/config/ExchangeSettingsPage';
import IntegrationsPage from './pages/config/IntegrationsPage';
import UserManagementPage from './components/admin/UserManagementPage';
import HowToUseGuidePage from './pages/HowToUseGuidePage';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { userProfile, isLoading: profileLoading, isFetched } = useCurrentUser();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showProfileSetup && <ProfileSetupDialog />}
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: OverviewPage,
});

const howToUseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-to-use',
  component: HowToUseGuidePage,
});

const tradeImportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/data-entry/trade-import',
  component: TradeImportPage,
});

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: ClientManagementPage,
});

const marginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/margin',
  component: MarginCollateralPage,
});

const reconciliationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reconciliation',
  component: BankReconciliationPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportLibraryPage,
});

const reportWizardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/wizard',
  component: ReportWizardPage,
});

const scheduledReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/scheduled',
  component: ScheduledReportsPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compliance/calendar',
  component: RegulatoryCalendarPage,
});

const surveillanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/surveillance',
  component: SurveillanceAlertsPage,
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audit',
  component: AuditTrailPage,
});

const configRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/config',
  component: ConfigurationHomePage,
});

const exchangeSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/config/exchanges',
  component: ExchangeSettingsPage,
});

const integrationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/config/integrations',
  component: IntegrationsPage,
});

const userManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/config/users',
  component: UserManagementPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  howToUseRoute,
  tradeImportRoute,
  clientsRoute,
  marginRoute,
  reconciliationRoute,
  reportsRoute,
  reportWizardRoute,
  scheduledReportsRoute,
  calendarRoute,
  surveillanceRoute,
  auditRoute,
  configRoute,
  exchangeSettingsRoute,
  integrationsRoute,
  userManagementRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
