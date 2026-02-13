import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface Thread {
    id: bigint;
    title: string;
    creator: Principal;
    createdAt: Timestamp;
    authorizedUsers: Array<Principal>;
}
export interface StatementRow {
    balance: number;
    date: Timestamp;
    description: string;
    recordedBy: Principal;
    amount: number;
}
export interface Trade {
    trade_id: string;
    client_code: string;
    side: string;
    trade_date: string;
    security: string;
    segment: string;
    quantity: bigint;
    order_id: string;
    exchange: string;
    price: number;
}
export interface RegulatoryDeadline {
    id: bigint;
    status: string;
    title: string;
    createdAt: Timestamp;
    createdBy: Principal;
    dueDate: Timestamp;
    description: string;
    category: string;
}
export interface KycDocument {
    pan: string;
    documents: Array<DocumentKey>;
    name: string;
    createdAt: Timestamp;
    createdBy: Principal;
    updatedAt: Timestamp;
    address: string;
}
export interface DocumentMeta {
    file: ExternalBlob;
    docType: string;
    uploadTime: Timestamp;
    uploadedBy: Principal;
}
export interface GeneratedReport {
    id: bigint;
    status: string;
    templateId: string;
    generatedAt: Timestamp;
    generatedBy: Principal;
    parameters: string;
}
export type DocumentKey = string;
export interface AuditEntry {
    action: string;
    entryTime: Timestamp;
    user: Principal;
    details: string;
}
export interface MarginSnapshot {
    snapshotTime: Timestamp;
    date: Timestamp;
    marginAvailable: number;
    recordedBy: Principal;
    marginUsed: number;
}
export interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
}
export interface BulkClient {
    pan: string;
    documents: Array<DocumentKey>;
    name: string;
    address: string;
}
export interface BehaviorPattern {
    id: bigint;
    detectedAt: Timestamp;
    user: Principal;
    analyzedBy: Principal;
    patternDescription: string;
}
export interface CollateralRecord {
    clientId: ClientId;
    marketValue: number;
    recordedAt: Timestamp;
    recordedBy: Principal;
    pledgeDate: Timestamp;
    quantity: bigint;
    securityName: string;
}
export interface ReconciliationRun {
    status: string;
    uploadDate: Timestamp;
    runId: bigint;
    rowCount: bigint;
    uploadedBy: Principal;
}
export type ClientId = bigint;
export interface UserProfile {
    name: string;
    email: string;
    extendedRole: string;
    department: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addActiveClient(clientId: ClientId): Promise<void>;
    addDocument(clientId: ClientId, docType: string, blob: ExternalBlob): Promise<void>;
    addMarginSnapshot(available: number, used: number, timestamp: Timestamp): Promise<void>;
    addRegulatoryDeadline(title: string, description: string, dueDate: Timestamp, category: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUploadClients(clientsInput: Array<BulkClient>): Promise<Array<ClientId>>;
    bulkUploadCollateral(collateralInput: Array<CollateralRecord>): Promise<void>;
    bulkUploadMarginSnapshots(snapshots: Array<MarginSnapshot>): Promise<void>;
    bulkUploadStatementRows(rowsInput: Array<StatementRow>): Promise<bigint>;
    createBehaviorPattern(user: Principal, description: string): Promise<bigint>;
    createClient(name: string, pan: string, address: string): Promise<ClientId>;
    createThread(title: string, authorizedUsers: Array<Principal>): Promise<bigint>;
    generateReport(templateId: string, parameters: string): Promise<bigint>;
    getActiveClients(): Promise<Array<ClientId>>;
    getAllClients(): Promise<Array<KycDocument>>;
    getAllTrades(): Promise<Array<Trade>>;
    getAuditEntries(): Promise<Array<AuditEntry>>;
    getBehaviorPattern(patternId: bigint): Promise<BehaviorPattern | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(clientId: ClientId): Promise<KycDocument | null>;
    getCollateralRecords(): Promise<Array<CollateralRecord>>;
    getDashboardMetrics(): Promise<{
        reconciliationRunCount: bigint;
        totalTrades: bigint;
        latestMarginAvailable: number;
        pendingDeadlines: bigint;
        totalClients: bigint;
        latestMarginUsed: number;
    }>;
    getDocument(key: DocumentKey): Promise<DocumentMeta | null>;
    getGeneratedReports(): Promise<Array<GeneratedReport>>;
    getMarginSnapshots(): Promise<Array<MarginSnapshot>>;
    getReconciliationRun(runId: bigint): Promise<ReconciliationRun | null>;
    getReconciliationRuns(): Promise<Array<ReconciliationRun>>;
    getRegulatoryDeadlines(): Promise<Array<RegulatoryDeadline>>;
    getReportTemplates(): Promise<Array<ReportTemplate>>;
    getStatementRows(): Promise<Array<StatementRow>>;
    getThread(threadId: bigint): Promise<Thread | null>;
    getTradesByClientCode(client_code: string): Promise<Array<Trade>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    importTrades(trades: Array<Trade>): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    removeActiveClient(clientId: ClientId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateClient(clientId: ClientId, name: string, pan: string, address: string): Promise<void>;
    updateRegulatoryDeadlineStatus(deadlineId: bigint, status: string): Promise<void>;
}
