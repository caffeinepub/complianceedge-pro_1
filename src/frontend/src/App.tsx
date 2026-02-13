import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, NotFoundRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useBackendHealthCheck } from './hooks/useBackendHealthCheck';
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
import NotFoundPage from './pages/NotFoundPage';
import AppErrorBoundary from './components/common/AppErrorBoundary';
import BackendHealthBanner from './components/common/BackendHealthBanner';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { userProfile, isLoading: profileLoading, isFetched } = useCurrentUser();
  const { isHealthy, isChecking, isError, refetch } = useBackendHealthCheck();
  
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
        {isError && !isChecking && (
          <BackendHealthBanner onRetry={() => refetch()} isRetrying={isChecking} />
        )}
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

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
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

const router = createRouter({ 
  routeTree,
  notFoundRoute,
  defaultErrorComponent: ({ error }) => (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
