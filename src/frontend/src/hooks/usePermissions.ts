import { useCurrentUser } from './useCurrentUser';
import { getBusinessRole } from '../auth/roles';
import { hasCapability, getVisibleModules, type Capability } from '../auth/permissions';

export function usePermissions() {
  const { userProfile } = useCurrentUser();
  
  const role = userProfile ? getBusinessRole(userProfile.extendedRole) : 'Dealer';
  
  const can = (capability: Capability): boolean => {
    return hasCapability(role, capability);
  };
  
  const visibleModules = getVisibleModules(role);
  
  return {
    can,
    visibleModules,
    role,
  };
}
