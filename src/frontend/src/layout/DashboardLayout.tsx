import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { usePermissions } from '../hooks/usePermissions';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { LayoutDashboard, FileText, Users, TrendingUp, DollarSign, FileCheck, Calendar, Shield, FileSearch, Settings, LogOut, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AdminEmailMismatchBanner from '../components/common/AdminEmailMismatchBanner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showAdminMismatchBanner?: boolean;
}

export default function DashboardLayout({ children, showAdminMismatchBanner = false }: DashboardLayoutProps) {
  const { clear } = useInternetIdentity();
  const { userProfile, refetch } = useCurrentUser();
  const { visibleModules, role } = usePermissions();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [appIdentifier, setAppIdentifier] = useState('unknown-app');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Safely compute app identifier when window is available
    if (typeof window !== 'undefined') {
      setAppIdentifier(window.location.hostname || 'unknown-app');
    }
  }, []);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('Profile refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh profile');
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', module: 'dashboard' },
    { icon: FileText, label: 'Trade Import', path: '/data-entry/trade-import', module: 'data-entry' },
    { icon: Users, label: 'Clients', path: '/clients', module: 'clients' },
    { icon: TrendingUp, label: 'Margin & Collateral', path: '/margin', module: 'margin' },
    { icon: DollarSign, label: 'Reconciliation', path: '/reconciliation', module: 'reconciliation' },
    { icon: FileCheck, label: 'Reports', path: '/reports', module: 'reports' },
    { icon: Calendar, label: 'Calendar', path: '/compliance/calendar', module: 'calendar' },
    { icon: Shield, label: 'Surveillance', path: '/surveillance', module: 'surveillance' },
    { icon: FileSearch, label: 'Audit Trail', path: '/audit', module: 'audit' },
    { icon: Settings, label: 'Configuration', path: '/config', module: 'config' },
  ];

  const visibleNavItems = navItems.filter(item => visibleModules.includes(item.module));

  const initials = userProfile?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/assets/generated/complianceedge-pro-icon.dim_256x256.png" 
              alt="ComplianceEdge Pro" 
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-semibold text-sm">ComplianceEdge Pro</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">{role}</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Built with <span className="text-red-500">♥</span> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">
              {visibleNavItems.find(item => item.path === currentPath)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userProfile?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRefreshProfile} disabled={isRefreshing}>
                  <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
                  Refresh Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {showAdminMismatchBanner && userProfile && (
              <AdminEmailMismatchBanner 
                savedEmail={userProfile.email}
                onRefresh={handleRefreshProfile}
                isRefreshing={isRefreshing}
              />
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
