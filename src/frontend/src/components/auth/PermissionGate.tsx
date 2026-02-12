import { usePermissions } from '../../hooks/usePermissions';
import type { Capability } from '../../auth/permissions';
import type { ReactNode } from 'react';

interface PermissionGateProps {
  capability: Capability;
  children: ReactNode;
  fallback?: ReactNode;
  disableOnly?: boolean;
}

export default function PermissionGate({ capability, children, fallback = null, disableOnly = false }: PermissionGateProps) {
  const { can } = usePermissions();
  
  if (!can(capability)) {
    if (disableOnly && typeof children === 'object' && children !== null && 'props' in children) {
      return <div className="opacity-50 pointer-events-none">{children}</div>;
    }
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
