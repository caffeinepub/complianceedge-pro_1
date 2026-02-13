/**
 * Report template rules and data mapping
 */

import type { 
  KycDocument, 
  Trade, 
  MarginSnapshot, 
  ReconciliationRun, 
  RegulatoryDeadline 
} from '../../backend';

export interface ReportDataRequirements {
  clients?: boolean;
  trades?: boolean;
  marginSnapshots?: boolean;
  reconciliationRuns?: boolean;
  deadlines?: boolean;
}

export interface ReportDataSources {
  clients: KycDocument[];
  trades: Trade[];
  marginSnapshots: MarginSnapshot[];
  reconciliationRuns: ReconciliationRun[];
  deadlines: RegulatoryDeadline[];
}

export function getReportDataRequirements(templateId: string): ReportDataRequirements {
  switch (templateId) {
    case 'client-summary':
      return { clients: true };
    case 'trade-activity':
      return { trades: true, clients: true };
    case 'margin-analysis':
      return { marginSnapshots: true };
    case 'compliance-audit':
      return { deadlines: true };
    case 'reconciliation-summary':
      return { reconciliationRuns: true };
    default:
      return {};
  }
}

export function generateReportData(templateId: string, sources: ReportDataSources): any[] {
  switch (templateId) {
    case 'client-summary':
      return sources.clients.map(client => ({
        Name: client.name,
        PAN: client.pan,
        Address: client.address,
        'Document Count': client.documents.length,
        'Created Date': new Date(Number(client.createdAt) / 1000000).toLocaleDateString(),
      }));

    case 'trade-activity':
      return sources.trades.map(trade => ({
        'Client Code': trade.client_code,
        'Trade Date': trade.trade_date,
        Exchange: trade.exchange,
        Segment: trade.segment,
        Security: trade.security,
        Side: trade.side,
        Quantity: trade.quantity.toString(),
        Price: trade.price,
        'Order ID': trade.order_id,
        'Trade ID': trade.trade_id,
      }));

    case 'margin-analysis':
      return sources.marginSnapshots.map(snapshot => ({
        Date: new Date(Number(snapshot.date) / 1000000).toLocaleDateString(),
        'Margin Available': snapshot.marginAvailable,
        'Margin Used': snapshot.marginUsed,
        'Utilization %': ((snapshot.marginUsed / snapshot.marginAvailable) * 100).toFixed(2),
        'Snapshot Time': new Date(Number(snapshot.snapshotTime) / 1000000).toLocaleString(),
      }));

    case 'compliance-audit':
      return sources.deadlines.map(deadline => ({
        Title: deadline.title,
        Description: deadline.description,
        'Due Date': new Date(Number(deadline.dueDate) / 1000000).toLocaleDateString(),
        Category: deadline.category,
        Status: deadline.status,
        'Created Date': new Date(Number(deadline.createdAt) / 1000000).toLocaleDateString(),
      }));

    case 'reconciliation-summary':
      return sources.reconciliationRuns.map(run => ({
        'Run ID': run.runId.toString(),
        'Upload Date': new Date(Number(run.uploadDate) / 1000000).toLocaleString(),
        'Row Count': run.rowCount.toString(),
        Status: run.status,
      }));

    default:
      return [];
  }
}
