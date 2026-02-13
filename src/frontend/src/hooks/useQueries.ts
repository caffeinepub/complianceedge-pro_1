import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  ClientId, 
  KycDocument, 
  MarginSnapshot, 
  AuditEntry, 
  DocumentKey, 
  DocumentMeta, 
  Trade, 
  StatementRow,
  CollateralRecord,
  ReconciliationRun,
  RegulatoryDeadline,
  ReportTemplate,
  GeneratedReport,
  BulkClient
} from '../backend';
import { ExternalBlob } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, pan, address }: { name: string; pan: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClient(name, pan, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useGetClient(clientId: ClientId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<KycDocument | null>({
    queryKey: ['client', clientId?.toString()],
    queryFn: async () => {
      if (!actor || clientId === null) return null;
      return actor.getClient(clientId);
    },
    enabled: !!actor && !actorFetching && clientId !== null,
  });
}

export function useGetAllClients() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<KycDocument[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, name, pan, address }: { clientId: ClientId; name: string; pan: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClient(clientId, name, pan, address);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['client', variables.clientId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useAddDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, docType, blob }: { clientId: ClientId; docType: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDocument(clientId, docType, blob);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['client', variables.clientId.toString()] });
    },
  });
}

export function useGetDocument(key: DocumentKey | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DocumentMeta | null>({
    queryKey: ['document', key],
    queryFn: async () => {
      if (!actor || !key) return null;
      return actor.getDocument(key);
    },
    enabled: !!actor && !actorFetching && !!key,
  });
}

export function useAddMarginSnapshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ available, used, timestamp }: { available: number; used: number; timestamp: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMarginSnapshot(available, used, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marginSnapshots'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useGetMarginSnapshots() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MarginSnapshot[]>({
    queryKey: ['marginSnapshots'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarginSnapshots();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCollateralRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CollateralRecord[]>({
    queryKey: ['collateralRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCollateralRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAuditEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AuditEntry[]>({
    queryKey: ['auditEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAuditEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Trade Import Hooks
export function useImportTrades() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trades: Trade[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.importTrades(trades);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useGetAllTrades() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Trade[]>({
    queryKey: ['trades'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTrades();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTradesByClientCode(clientCode: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Trade[]>({
    queryKey: ['trades', clientCode],
    queryFn: async () => {
      if (!actor || !clientCode) return [];
      return actor.getTradesByClientCode(clientCode);
    },
    enabled: !!actor && !actorFetching && !!clientCode,
  });
}

// Bulk Upload Hooks
export function useBulkUploadClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clients: BulkClient[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUploadClients(clients);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useBulkUploadStatementRows() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rows: StatementRow[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUploadStatementRows(rows);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statementRows'] });
      queryClient.invalidateQueries({ queryKey: ['reconciliationRuns'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useBulkUploadMarginSnapshots() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshots: MarginSnapshot[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUploadMarginSnapshots(snapshots);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marginSnapshots'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useBulkUploadCollateral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collateral: CollateralRecord[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUploadCollateral(collateral);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collateralRecords'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

// Reconciliation Hooks
export function useGetReconciliationRuns() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReconciliationRun[]>({
    queryKey: ['reconciliationRuns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReconciliationRuns();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetStatementRows() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StatementRow[]>({
    queryKey: ['statementRows'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStatementRows();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Dashboard Metrics Hook
export function useGetDashboardMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    totalClients: bigint;
    totalTrades: bigint;
    latestMarginAvailable: number;
    latestMarginUsed: number;
    reconciliationRunCount: bigint;
    pendingDeadlines: bigint;
  }>({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardMetrics();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Regulatory Calendar Hooks
export function useGetRegulatoryDeadlines() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RegulatoryDeadline[]>({
    queryKey: ['regulatoryDeadlines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRegulatoryDeadlines();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddRegulatoryDeadline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      title, 
      description, 
      dueDate, 
      category 
    }: { 
      title: string; 
      description: string; 
      dueDate: bigint; 
      category: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRegulatoryDeadline(title, description, dueDate, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regulatoryDeadlines'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useUpdateRegulatoryDeadlineStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deadlineId, status }: { deadlineId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRegulatoryDeadlineStatus(deadlineId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regulatoryDeadlines'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

// Report Hooks
export function useGetReportTemplates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReportTemplate[]>({
    queryKey: ['reportTemplates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReportTemplates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGenerateReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateId, parameters }: { templateId: string; parameters: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateReport(templateId, parameters);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generatedReports'] });
    },
  });
}

export function useGetGeneratedReports() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GeneratedReport[]>({
    queryKey: ['generatedReports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGeneratedReports();
    },
    enabled: !!actor && !actorFetching,
  });
}
