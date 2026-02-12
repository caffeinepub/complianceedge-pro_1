import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { 
  Shield, 
  Users, 
  Upload, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Eye, 
  History, 
  Settings,
  HelpCircle,
  CheckCircle
} from 'lucide-react';

export default function HowToUseGuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">How to Use This Platform</h2>
        <p className="text-muted-foreground">Complete guide to ComplianceEdge Pro</p>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-6 pr-4">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">First Time Login</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click "Login" and authenticate using Internet Identity</li>
                  <li>On first login, you'll be prompted to set up your profile</li>
                  <li>Enter your name, email, department, and select your role</li>
                  <li>Your role determines which modules and features you can access</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Dashboard Overview</h4>
                <p className="text-sm text-muted-foreground">
                  The dashboard displays key compliance metrics, pending actions, alerts, and quick access to common tasks. 
                  Use the sidebar navigation to access different modules based on your role permissions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Roles & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Super Admin</h4>
                  <p className="text-sm text-muted-foreground">Full system access including user management, configuration, and all compliance modules.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Compliance Officer / Compliance Head</h4>
                  <p className="text-sm text-muted-foreground">Access to surveillance, audit trails, regulatory calendar, and compliance reporting.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Accountant</h4>
                  <p className="text-sm text-muted-foreground">Manage financial data, bank reconciliation, margin snapshots, and financial reports.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Operations Manager</h4>
                  <p className="text-sm text-muted-foreground">Trade import, client management, margin monitoring, and operational reports.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Dealer</h4>
                  <p className="text-sm text-muted-foreground">Read-only access to view trades, clients, and reports. Cannot create or modify data.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">External Auditor</h4>
                  <p className="text-sm text-muted-foreground">View-only access to audit trails, reports, and compliance documentation.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trade Import */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Trade Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Uploading Trade Files</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to Data Entry → Trade Import</li>
                  <li>Download the sample CSV file to see the required format</li>
                  <li>Prepare your trade file with columns: client_code, trade_date, exchange, segment, security, side, quantity, price, order_id, trade_id</li>
                  <li>Click "Browse Files" or drag and drop your CSV/Excel file</li>
                  <li>Review the import preview and confirm</li>
                  <li>Check Import History tab to verify successful imports</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Manual Entry</h4>
                <p className="text-sm text-muted-foreground">
                  Use the Manual Entry tab to add individual trades when bulk import is not needed. 
                  This is useful for corrections or small volumes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Client Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Client Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Adding Clients</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to Clients module</li>
                  <li>Click "Add Client" button</li>
                  <li>Fill in required KYC details: UCC, Name, PAN, Mobile, Email, Address</li>
                  <li>PAN format must be valid (e.g., ABCDE1234F)</li>
                  <li>Save the client record</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Bulk Upload</h4>
                <p className="text-sm text-muted-foreground">
                  Download the client bulk upload sample CSV to import multiple clients at once. 
                  Ensure all PAN numbers are valid and mobile numbers are 10 digits.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Searching Clients</h4>
                <p className="text-sm text-muted-foreground">
                  Use the search bar to find clients by UCC, Name, PAN, Mobile, or Email. 
                  Search is instant and case-insensitive.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Margin & Collateral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Margin & Collateral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Recording Margin Snapshots</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to Margin & Collateral module</li>
                  <li>Download the margin snapshot sample CSV for the required format</li>
                  <li>Record snapshots at required intervals (typically 3 times daily for peak margin)</li>
                  <li>Include: client_code, snapshot_id, required_margin, available_margin, shortfall, exchange</li>
                  <li>System automatically flags shortfalls and margin calls</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Monitoring Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  The dashboard shows peak margin compliance percentage. Any shortfalls trigger alerts. 
                  Review the Margin Snapshots tab to see detailed client-wise margin positions.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Pledged Securities</h4>
                <p className="text-sm text-muted-foreground">
                  Track collateral securities pledged by clients. View haircut values and effective margin contribution.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Reconciliation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Bank Reconciliation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Uploading Bank Statements</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to Reconciliation → Bank Reconciliation</li>
                  <li>Download the sample CSV to see the required format</li>
                  <li>Prepare statement with columns: date, description, amount, type (credit/debit), reference</li>
                  <li>Click "Upload Statement" and select your file</li>
                  <li>System automatically matches transactions with internal records</li>
                  <li>Review unmatched items and resolve discrepancies</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Reconciliation Process</h4>
                <p className="text-sm text-muted-foreground">
                  The system uses intelligent matching to reconcile bank transactions with internal ledger entries. 
                  Unmatched items are flagged for manual review. Export reconciliation reports for audit purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Generating Reports</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to Reports → Report Library</li>
                  <li>Browse available report templates (regulatory, operational, financial)</li>
                  <li>Click "Generate Report" or use the Report Wizard for custom reports</li>
                  <li>Select date range, filters, and output format (PDF, Excel, CSV)</li>
                  <li>Download or email the generated report</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Scheduled Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Set up automated report generation on daily, weekly, or monthly schedules. 
                  Configure email distribution lists for automatic delivery to stakeholders.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Regulatory Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Managing Deadlines</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to Compliance → Regulatory Calendar</li>
                  <li>View upcoming regulatory deadlines in calendar or list view</li>
                  <li>Add custom deadlines for internal compliance requirements</li>
                  <li>Set reminders and assign responsibilities</li>
                  <li>Mark deadlines as completed with supporting documentation</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Compliance Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  The calendar automatically includes SEBI, exchange, and statutory deadlines. 
                  Dashboard alerts notify you of approaching deadlines. Export calendar for planning purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Surveillance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Surveillance & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Monitoring Trading Activity</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  The surveillance module automatically detects suspicious patterns:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Wash trades and circular trading</li>
                  <li>Price manipulation attempts</li>
                  <li>Unusual trading volumes or patterns</li>
                  <li>High-value cash transactions</li>
                  <li>Client concentration risks</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Alert Management</h4>
                <p className="text-sm text-muted-foreground">
                  Review alerts by category (High, Medium, Low priority). Investigate flagged activities, 
                  add notes, and mark as resolved or escalate to compliance team. All actions are logged in audit trail.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Viewing Audit Logs</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to Audit Trail (Compliance Officer and Admin access only)</li>
                  <li>View chronological log of all system activities</li>
                  <li>Search by user, action type, date range, or keywords</li>
                  <li>Export audit logs for regulatory submissions or internal review</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">What Gets Logged</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Every significant action is automatically recorded:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>User logins and profile changes</li>
                  <li>Client creation and modifications</li>
                  <li>Trade imports and manual entries</li>
                  <li>Document uploads and access</li>
                  <li>Margin snapshot recordings</li>
                  <li>Configuration changes</li>
                  <li>Report generation and exports</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">System Settings (Super Admin Only)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Access Configuration module to manage:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>Exchange Settings:</strong> Configure NSE, BSE, MCX, NCDEX connections and parameters</li>
                  <li><strong>User Management:</strong> Create users, assign roles, manage permissions</li>
                  <li><strong>Integrations:</strong> Set up KRA, depository, and accounting system integrations</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">User Management</h4>
                <p className="text-sm text-muted-foreground">
                  Super Admins can create new users, assign business roles, and manage access permissions. 
                  Each user authenticates via Internet Identity for secure, decentralized access.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Troubleshooting & FAQ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Common Issues</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Q: I can't see certain modules in the sidebar</p>
                    <p className="text-sm text-muted-foreground">A: Module visibility depends on your assigned role. Contact your Super Admin if you need access to additional modules.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Q: File upload fails or shows an error</p>
                    <p className="text-sm text-muted-foreground">A: Ensure your file matches the sample format exactly. Check for missing columns, invalid data types, or special characters. File size limit is 10MB.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Q: PAN validation error when adding client</p>
                    <p className="text-sm text-muted-foreground">A: PAN must be in format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F). All letters must be uppercase.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Q: How do I export data?</p>
                    <p className="text-sm text-muted-foreground">A: Most modules have an "Export" button. Select your preferred format (CSV, Excel, PDF) and date range. Exports respect your role permissions.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Q: Can I delete or edit imported trades?</p>
                    <p className="text-sm text-muted-foreground">A: Trade modifications depend on your role. Operations Managers and Admins can edit trades. All changes are logged in the audit trail.</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Best Practices</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Import trades daily to maintain up-to-date records</li>
                  <li>Record margin snapshots at required intervals (typically 3 times daily)</li>
                  <li>Review surveillance alerts promptly and document investigations</li>
                  <li>Schedule automated reports to reduce manual work</li>
                  <li>Regularly check the regulatory calendar for upcoming deadlines</li>
                  <li>Use bulk upload features for efficiency when adding multiple records</li>
                  <li>Always download sample files before preparing your data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Support & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Security</h4>
                <p className="text-sm text-muted-foreground">
                  ComplianceEdge Pro runs on the Internet Computer blockchain, providing enterprise-grade security 
                  with decentralized authentication via Internet Identity. All data is encrypted and access is 
                  role-based. Every action is logged in an immutable audit trail.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Getting Help</h4>
                <p className="text-sm text-muted-foreground">
                  For technical support or questions about using the platform, contact your system administrator 
                  or Super Admin. For feature requests or bug reports, reach out to the ComplianceEdge Pro support team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
