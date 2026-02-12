import type { BusinessRole } from './roles';

export type Capability =
  | 'view_dashboard'
  | 'view_trades'
  | 'create_trades'
  | 'edit_trades'
  | 'view_clients'
  | 'create_clients'
  | 'edit_clients'
  | 'view_margin'
  | 'manage_margin'
  | 'view_reconciliation'
  | 'manage_reconciliation'
  | 'view_reports'
  | 'generate_reports'
  | 'export_reports'
  | 'schedule_reports'
  | 'view_calendar'
  | 'manage_calendar'
  | 'view_surveillance'
  | 'manage_surveillance'
  | 'view_audit'
  | 'export_audit'
  | 'manage_config'
  | 'manage_users';

const roleCapabilities: Record<BusinessRole, Capability[]> = {
  'Super Admin': [
    'view_dashboard',
    'view_trades',
    'create_trades',
    'edit_trades',
    'view_clients',
    'create_clients',
    'edit_clients',
    'view_margin',
    'manage_margin',
    'view_reconciliation',
    'manage_reconciliation',
    'view_reports',
    'generate_reports',
    'export_reports',
    'schedule_reports',
    'view_calendar',
    'manage_calendar',
    'view_surveillance',
    'manage_surveillance',
    'view_audit',
    'export_audit',
    'manage_config',
    'manage_users',
  ],
  'Compliance Head': [
    'view_dashboard',
    'view_trades',
    'create_trades',
    'edit_trades',
    'view_clients',
    'create_clients',
    'edit_clients',
    'view_margin',
    'view_reconciliation',
    'view_reports',
    'generate_reports',
    'export_reports',
    'schedule_reports',
    'view_calendar',
    'manage_calendar',
    'view_surveillance',
    'manage_surveillance',
    'view_audit',
    'export_audit',
  ],
  'Compliance Officer': [
    'view_dashboard',
    'view_trades',
    'create_trades',
    'view_clients',
    'create_clients',
    'edit_clients',
    'view_margin',
    'view_reconciliation',
    'view_reports',
    'generate_reports',
    'export_reports',
    'view_calendar',
    'manage_calendar',
    'view_surveillance',
    'manage_surveillance',
  ],
  'Accountant': [
    'view_dashboard',
    'view_trades',
    'view_clients',
    'view_margin',
    'manage_margin',
    'view_reconciliation',
    'manage_reconciliation',
    'view_reports',
    'generate_reports',
    'export_reports',
  ],
  'Operations Manager': [
    'view_dashboard',
    'view_trades',
    'create_trades',
    'edit_trades',
    'view_clients',
    'view_margin',
    'manage_margin',
    'view_reconciliation',
    'manage_reconciliation',
    'view_reports',
    'generate_reports',
    'export_reports',
  ],
  'Dealer': [
    'view_dashboard',
    'view_trades',
    'view_clients',
    'view_margin',
  ],
  'External Auditor': [
    'view_dashboard',
    'view_trades',
    'view_clients',
    'view_margin',
    'view_reconciliation',
    'view_reports',
    'export_reports',
    'view_calendar',
    'view_surveillance',
    'view_audit',
    'export_audit',
  ],
};

export function hasCapability(role: BusinessRole, capability: Capability): boolean {
  return roleCapabilities[role]?.includes(capability) ?? false;
}

export function getVisibleModules(role: BusinessRole): string[] {
  const modules: string[] = [];
  
  if (hasCapability(role, 'view_dashboard')) modules.push('dashboard');
  if (hasCapability(role, 'view_trades')) modules.push('data-entry');
  if (hasCapability(role, 'view_clients')) modules.push('clients');
  if (hasCapability(role, 'view_margin')) modules.push('margin');
  if (hasCapability(role, 'view_reconciliation')) modules.push('reconciliation');
  if (hasCapability(role, 'view_reports')) modules.push('reports');
  if (hasCapability(role, 'view_calendar')) modules.push('calendar');
  if (hasCapability(role, 'view_surveillance')) modules.push('surveillance');
  if (hasCapability(role, 'view_audit')) modules.push('audit');
  if (hasCapability(role, 'manage_config')) modules.push('config');
  
  return modules;
}
