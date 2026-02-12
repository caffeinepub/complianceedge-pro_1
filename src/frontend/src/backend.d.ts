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
export type DocumentKey = string;
export type ClientID = bigint;
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
export interface BehaviorPattern {
    id: bigint;
    detectedAt: Timestamp;
    user: Principal;
    analyzedBy: Principal;
    patternDescription: string;
}
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
    addDocument(clientId: ClientID, docType: string, blob: ExternalBlob): Promise<void>;
    addMarginSnapshot(available: number, used: number, timestamp: Timestamp): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBehaviorPattern(user: Principal, description: string): Promise<bigint>;
    createClient(name: string, pan: string, address: string): Promise<ClientID>;
    createThread(title: string, authorizedUsers: Array<Principal>): Promise<bigint>;
    getAuditEntries(): Promise<Array<AuditEntry>>;
    getBehaviorPattern(patternId: bigint): Promise<BehaviorPattern | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(clientId: ClientID): Promise<KycDocument | null>;
    getDocument(key: DocumentKey): Promise<DocumentMeta | null>;
    getMarginSnapshots(): Promise<Array<MarginSnapshot>>;
    getThread(threadId: bigint): Promise<Thread | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateClient(clientId: ClientID, name: string, pan: string, address: string): Promise<void>;
}
