export type BusinessRole = 
  | 'Super Admin'
  | 'Compliance Head'
  | 'Compliance Officer'
  | 'Accountant'
  | 'Operations Manager'
  | 'Dealer'
  | 'External Auditor';

export function getBusinessRole(extendedRole: string): BusinessRole {
  const normalized = extendedRole.trim();
  const validRoles: BusinessRole[] = [
    'Super Admin',
    'Compliance Head',
    'Compliance Officer',
    'Accountant',
    'Operations Manager',
    'Dealer',
    'External Auditor',
  ];
  
  if (validRoles.includes(normalized as BusinessRole)) {
    return normalized as BusinessRole;
  }
  
  return 'Dealer';
}
