import { useCurrentUser } from './useCurrentUser';
import { getBusinessRole } from '../auth/roles';
import { hasCapability, getVisibleModules, type Capability } from '../auth/permissions';
import { useMemo } from 'react';

export function usePermissions() {
  const { userProfile } = useCurrentUser();
  
  const role = useMemo(() => {
    return userProfile ? getBusinessRole(userProfile.extendedRole) : 'Dealer';
  }, [userProfile?.extendedRole]);
  
  const can = (capability: Capability): boolean => {
    return hasCapability(role, capability);
  };
  
  const visibleModules = useMemo(() => {
    return getVisibleModules(role);
  }, [role]);
  
  return {
    can,
    visibleModules,
    role,
  };
}
