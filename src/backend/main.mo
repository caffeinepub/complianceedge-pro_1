import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Timestamp = Int;
  type DocumentKey = Text;
  type ClientId = Nat;

  // User Roles
  module UserRole {
    public type UserRole = AccessControl.UserRole;

    public func compare(role1 : UserRole, role2 : UserRole) : Order.Order {
      switch (role1, role2) {
        case (#admin, #admin) { #equal };
        case (#admin, _) { #less };
        case (_, #admin) { #greater };
        case (#user, #user) { #equal };
        case (#user, _) { #less };
        case (_, #user) { #greater };
        case (#guest, #guest) { #equal };
      };
    };
  };

  // User Profile with extended role information
  type UserProfile = {
    name : Text;
    email : Text;
    department : Text;
    extendedRole : Text; // "Super Admin", "Compliance Officer", "Accountant", "Operations Manager", "Dealer", "External Auditor"
  };

  // Document Metadata
  type DocumentMeta = {
    uploadedBy : Principal;
    uploadTime : Timestamp;
    file : Storage.ExternalBlob;
    docType : Text;
  };

  // KYC Document Structure
  type KycDocument = {
    name : Text;
    pan : Text;
    address : Text;
    documents : [DocumentKey];
    createdAt : Timestamp;
    updatedAt : Timestamp;
    createdBy : Principal;
  };

  // Just the input type for bulk upload. Accepts fewer fields!
  type BulkClient = {
    name : Text;
    pan : Text;
    address : Text;
    documents : [DocumentKey];
  };

  // Margin Snapshot Structure
  type MarginSnapshot = {
    date : Timestamp;
    marginAvailable : Float;
    marginUsed : Float;
    snapshotTime : Timestamp;
    recordedBy : Principal;
  };

  // Collateral Record Structure
  type CollateralRecord = {
    clientId : ClientId;
    securityName : Text;
    quantity : Nat;
    pledgeDate : Timestamp;
    marketValue : Float;
    recordedBy : Principal;
    recordedAt : Timestamp;
  };

  // Statement Row Structure
  type StatementRow = {
    date : Timestamp;
    description : Text;
    amount : Float;
    balance : Float;
    recordedBy : Principal;
  };

  // Reconciliation Run Structure
  type ReconciliationRun = {
    runId : Nat;
    uploadDate : Timestamp;
    uploadedBy : Principal;
    rowCount : Nat;
    status : Text;
  };

  // Interest Calculation Structure
  type InterestRecord = {
    loanID : Text;
    amount : Float;
    interestRate : Float;
    startDate : Timestamp;
    endDate : ?Timestamp;
  };

  // Audit Trail Entry
  type AuditEntry = {
    entryTime : Timestamp;
    user : Principal;
    action : Text;
    details : Text;
  };

  // Thread Management
  type Thread = {
    id : Nat;
    title : Text;
    creator : Principal;
    authorizedUsers : [Principal];
    createdAt : Timestamp;
  };

  // Behavioral Pattern Analysis
  type BehaviorPattern = {
    id : Nat;
    user : Principal;
    patternDescription : Text;
    detectedAt : Timestamp;
    analyzedBy : Principal;
  };

  type Trade = {
    client_code : Text;
    trade_date : Text;
    exchange : Text;
    segment : Text;
    security : Text;
    side : Text;
    quantity : Nat;
    price : Float;
    order_id : Text;
    trade_id : Text;
  };

  // Regulatory Deadline Structure
  type RegulatoryDeadline = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Timestamp;
    category : Text;
    status : Text;
    createdBy : Principal;
    createdAt : Timestamp;
  };

  // Report Template Structure
  type ReportTemplate = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
  };

  // Generated Report Structure
  type GeneratedReport = {
    id : Nat;
    templateId : Text;
    generatedBy : Principal;
    generatedAt : Timestamp;
    parameters : Text;
    status : Text;
  };

  let clients = Map.empty<ClientId, KycDocument>();
  let documents = Map.empty<DocumentKey, DocumentMeta>();
  let threads = Map.empty<Nat, Thread>();
  let patterns = Map.empty<Nat, BehaviorPattern>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let reconciliationRuns = Map.empty<Nat, ReconciliationRun>();
  let regulatoryDeadlines = Map.empty<Nat, RegulatoryDeadline>();
  let generatedReports = Map.empty<Nat, GeneratedReport>();

  let auditEntries = List.empty<AuditEntry>();
  let marginSnapshots = List.empty<MarginSnapshot>();
  let collateralRecords = List.empty<CollateralRecord>();
  let interestRecords = List.empty<InterestRecord>();
  let statementRows = List.empty<StatementRow>();

  // New stateful trade storage!
  let tradeMap = Map.empty<Text, [Trade]>(); // Use client_code as key

  var nextThreadId = 0;
  var nextPatternId = 0;
  var currentClientId = 0;
  var nextReconciliationRunId = 0;
  var nextDeadlineId = 0;
  var nextReportId = 0;

  let activeClientsList = List.empty<ClientId>();

  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Bootstrap admin check: user with email "sanjeev.vohra@gmail.com" is always admin
  func isBootstrapAdmin(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        profile.email == "sanjeev.vohra@gmail.com";
      };
      case (null) { false };
    };
  };

  // Enhanced admin check that includes bootstrap admin
  func isAdminUser(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller) or isBootstrapAdmin(caller);
  };

  // Helper function to check if user has read-only restriction (Dealer role)
  func isReadOnlyUser(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.extendedRole == "Dealer" };
      case (null) { false };
    };
  };

  // Helper function to check if user is compliance/admin
  func isComplianceOrAdmin(caller : Principal) : Bool {
    if (isAdminUser(caller)) {
      return true;
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        profile.extendedRole == "Compliance Officer" or profile.extendedRole == "Compliance Head" or profile.extendedRole == "Super Admin";
      };
      case (null) { false };
    };
  };

  // Helper function to check if user can manage financial data
  func canManageFinancialData(caller : Principal) : Bool {
    if (isAdminUser(caller)) {
      return true;
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        profile.extendedRole == "Accountant" or profile.extendedRole == "Operations Manager" or profile.extendedRole == "Super Admin";
      };
      case (null) { false };
    };
  };

  // Helper function to check if user can view client data
  func canViewClientData(caller : Principal) : Bool {
    if (isAdminUser(caller)) {
      return true;
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        profile.extendedRole != "Dealer";
      };
      case (null) { false };
    };
  };

  // Helper function to add audit entry
  func addAuditEntry(user : Principal, action : Text, details : Text) {
    let entry : AuditEntry = {
      entryTime = Time.now();
      user;
      action;
      details;
    };
    auditEntries.add(entry);
  };

  // Health check endpoint for backend connectivity
  public query ({ caller }) func backendHealthCheck() : async Bool {
    true;
  };

  // User Profile Management

  // Check if caller is admin (includes bootstrap admin)
  public query ({ caller }) func isAdmin() : async Bool {
    isAdminUser(caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not isAdminUser(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Bootstrap admin: automatically set extendedRole to "Super Admin" for bootstrap admin email
    let finalProfile = if (profile.email == "sanjeev.vohra@gmail.com") {
      {
        profile with
        extendedRole = "Super Admin";
      };
    } else {
      profile;
    };

    userProfiles.add(caller, finalProfile);
    addAuditEntry(caller, "UPDATE_PROFILE", "User updated their profile");
  };

  public query ({ caller }) func getActiveClients() : async [ClientId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get active clients");
    };
    activeClientsList.toArray();
  };

  public shared ({ caller }) func addActiveClient(clientId : ClientId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add active clients");
    };
    if (isReadOnlyUser(caller)) {
      Runtime.trap("Unauthorized: Read-only users cannot add active clients");
    };
    activeClientsList.add(clientId);
    addAuditEntry(caller, "ADD_ACTIVE_CLIENT", "Added client " # clientId.toText() # " to active clients");
  };

  public shared ({ caller }) func removeActiveClient(clientId : ClientId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove active clients");
    };
    if (isReadOnlyUser(caller)) {
      Runtime.trap("Unauthorized: Read-only users cannot remove active clients");
    };

    activeClientsList.clear();
    addAuditEntry(caller, "REMOVE_ACTIVE_CLIENT", "Removed client " # clientId.toText() # " from active clients");
  };

  // Trade Management
  public shared ({ caller }) func importTrades(trades : [Trade]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can import trades");
    };
    if (isReadOnlyUser(caller)) {
      Runtime.trap("Unauthorized: Read-only users cannot import trades");
    };

    for (trade in trades.values()) {
      let existingTrades = switch (tradeMap.get(trade.client_code)) {
        case (?t) { t };
        case (null) { [] };
      };

      tradeMap.add(trade.client_code, existingTrades.concat([trade]));
    };

    addAuditEntry(caller, "IMPORT_TRADES", "Imported " # trades.size().toText() # " trades");
  };

  public query ({ caller }) func getTradesByClientCode(client_code : Text) : async [Trade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch trades");
    };

    switch (tradeMap.get(client_code)) {
      case (?trades) { trades };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllTrades() : async [Trade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch trades");
    };

    var allTrades : [Trade] = [];

    for ((client_code, trades) in tradeMap.entries()) {
      allTrades := allTrades.concat(trades);
    };

    allTrades;
  };

  // Document Management
  public shared ({ caller }) func addDocument(clientId : ClientId, docType : Text, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add documents");
    };
    if (isReadOnlyUser(caller)) {
      Runtime.trap("Unauthorized: Read-only users cannot add documents");
    };
    let key = generateDocumentKey(clientId, docType);
    let metadata : DocumentMeta = {
      uploadedBy = caller;
      uploadTime = Time.now();
      file = blob;
      docType;
    };
    documents.add(key, metadata);
    addAuditEntry(caller, "ADD_DOCUMENT", "Added document for client " # clientId.toText());
  };

  public query ({ caller }) func getDocument(key : DocumentKey) : async ?DocumentMeta {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view documents");
    };
    if (not canViewClientData(caller)) {
      Runtime.trap("Unauthorized: Insufficient permissions to view documents");
    };
    documents.get(key);
  };

  // Client Management (KYC)
  public shared ({ caller }) func createClient(name : Text, pan : Text, address : Text) : async ClientId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create clients");
    };
    if (isReadOnlyUser(caller)) {
      Runtime.trap("Unauthorized: Read-only users cannot create clients");
    };
    let clientId = currentClientId;
    let client : KycDocument = {
      name;
      pan;
      address;
      documents = [];
      createdAt = Time.now();
      updatedAt = Time.now();
      createdBy = caller;
    };
    clients.add(clientId, client);
    currentClientId += 1;
    addAuditEntry(caller, "CREATE_CLIENT", "Created client " # clientId.toText());
    clientId;
  };

  public query ({ caller }) func getClient(clientId : ClientId) : async ?KycDocument {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view clients");
    };
    if (not canViewClientData(caller)) {
      Runtime.trap("Unauthorized: Insufficient permissions to view client data");
    };
    clients.get(clientId);
  };

  public query ({ caller }) func getAllClients() : async [KycDocument] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view all clients");
    };
    if (not canViewClientData(caller)) {
      Runtime.trap("Unauthorized: Insufficient permissions to view client data");
    };

    var allClients : [KycDocument] = [];
    for ((id, client) in clients.entries()) {
      allClients := allClients.concat([client]);
    };
    allClients;
  };

  public shared ({ caller }) func updateClient(clientId : ClientId, name : Text, pan : Text, address : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update clients");
    };
    if (isReadOnlyUser(caller)) {
      Runtime.trap("Unauthorized: Read-only users cannot update clients");
    };
    switch (clients.get(clientId)) {
      case (?existingClient) {
        let updatedClient : KycDocument = {
          name;
          pan;
          address;
          documents = existingClient.documents;
          createdAt = existingClient.createdAt;
          updatedAt = Time.now();
          createdBy = existingClient.createdBy;
        };
        clients.add(clientId, updatedClient);
        addAuditEntry(caller, "UPDATE_CLIENT", "Updated client " # clientId.toText());
      };
      case (null) { Runtime.trap("Client not found") };
    };
  };

  // Bulk Upload Features
  public shared ({ caller }) func bulkUploadClients(clientsInput : [BulkClient]) : async [ClientId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can bulk upload clients");
    };
    if (isReadOnlyUser(caller)) {
      Runtime.trap("Unauthorized: Read-only users cannot bulk upload clients");
    };

    let createdClientIds = List.empty<ClientId>();

    for (bulkClient in clientsInput.values()) {
      let clientId = currentClientId;
      let kycDocument : KycDocument = {
        name = bulkClient.name;
        pan = bulkClient.pan;
        address = bulkClient.address;
        documents = bulkClient.documents;
        createdAt = Time.now();
        updatedAt = Time.now();
        createdBy = caller;
      };
      clients.add(clientId, kycDocument);
      currentClientId += 1;
      createdClientIds.add(clientId);
    };

    addAuditEntry(caller, "BULK_UPLOAD_CLIENTS", "Bulk uploaded " # clientsInput.size().toText() # " clients");
    createdClientIds.toArray();
  };

  public shared ({ caller }) func bulkUploadStatementRows(rowsInput : [StatementRow]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can bulk upload statement rows");
    };
    if (not canManageFinancialData(caller)) {
      Runtime.trap("Unauthorized: Only authorized financial roles can bulk upload statement rows");
    };

    let runId = nextReconciliationRunId;
    nextReconciliationRunId += 1;

    for (row in rowsInput.values()) {
      let rowWithTimestamp : StatementRow = {
        row with
        recordedBy = caller;
      };
      statementRows.add(rowWithTimestamp);
    };

    let run : ReconciliationRun = {
      runId;
      uploadDate = Time.now();
      uploadedBy = caller;
      rowCount = rowsInput.size();
      status = "Completed";
    };
    reconciliationRuns.add(runId, run);

    addAuditEntry(caller, "BULK_UPLOAD_STATEMENT_ROWS", "Bulk uploaded " # rowsInput.size().toText() # " statement rows");
    runId;
  };

  public shared ({ caller }) func bulkUploadMarginSnapshots(snapshots : [MarginSnapshot]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can bulk upload margin snapshots");
    };
    if (not canManageFinancialData(caller)) {
      Runtime.trap("Unauthorized: Only authorized financial roles can bulk upload margin snapshots");
    };

    for (snapshot in snapshots.values()) {
      let snapshotWithTimestamp : MarginSnapshot = {
        snapshot with
        snapshotTime = Time.now();
        recordedBy = caller;
      };
      marginSnapshots.add(snapshotWithTimestamp);
    };

    addAuditEntry(caller, "BULK_UPLOAD_MARGIN_SNAPSHOTS", "Bulk uploaded " # snapshots.size().toText() # " margin snapshots");
  };

  public shared ({ caller }) func bulkUploadCollateral(collateralInput : [CollateralRecord]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can bulk upload collateral");
    };
    if (not canManageFinancialData(caller)) {
      Runtime.trap("Unauthorized: Only authorized financial roles can bulk upload collateral");
    };

    for (collateral in collateralInput.values()) {
      let collateralWithTimestamp : CollateralRecord = {
        collateral with
        recordedBy = caller;
        recordedAt = Time.now();
      };
      collateralRecords.add(collateralWithTimestamp);
    };

    addAuditEntry(caller, "BULK_UPLOAD_COLLATERAL", "Bulk uploaded " # collateralInput.size().toText() # " collateral records");
  };

  public query ({ caller }) func getStatementRows() : async [StatementRow] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view statement rows");
    };
    if (not canManageFinancialData(caller)) {
      Runtime.trap("Unauthorized: Only authorized financial roles can view statement rows");
    };
    statementRows.toArray();
  };

  public query ({ caller }) func getReconciliationRuns() : async [ReconciliationRun] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view reconciliation runs");
    };
    if (not canManageFinancialData(caller)) {
      Runtime.trap("Unauthorized: Only authorized financial roles can view reconciliation runs");
    };

    var runs : [ReconciliationRun] = [];
    for ((id, run) in reconciliationRuns.entries()) {
      runs := runs.concat([run]);
    };
    runs;
  };

  public query ({ caller }) func getReconciliationRun(runId : Nat) : async ?ReconciliationRun {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view reconciliation runs");
    };
    if (not canManageFinancialData(caller)) {
      Runtime.trap("Unauthorized: Only authorized financial roles can view reconciliation runs");
    };
    reconciliationRuns.get(runId);
  };

  // Thread Management
  public shared ({ caller }) func createThread(title : Text, authorizedUsers : [Principal]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create threads");
    };
    if (isReadOnlyUser(caller)) {
      Runtime.trap("Unauthorized: Read-only users cannot create threads");
    };
    let thread = {
      id = nextThreadId;
      title;
      creator = caller;
      authorizedUsers;
      createdAt = Time.now();
    };
    threads.add(nextThreadId, thread);
    nextThreadId += 1;
    addAuditEntry(caller, "CREATE_THREAD", "Created thread " # thread.id.toText());
    thread.id;
  };

  public query ({ caller }) func getThread(threadId : Nat) : async ?Thread {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view threads");
    };
    switch (threads.get(threadId)) {
      case (?thread) {
        // Check if caller is creator, authorized user, or admin
        let isAuthorized = thread.creator == caller or
          thread.authorizedUsers.find(func(user) { user == caller }) != null or
          isAdminUser(caller);
        if (isAuthorized) {
          ?thread;
        } else {
          Runtime.trap("Unauthorized: Not authorized to view this thread");
        };
      };
      case (null) { null };
    };
  };

  // Behavioral Pattern Analysis (Compliance/Admin only)
  public shared ({ caller }) func createBehaviorPattern(user : Principal, description : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create behavior patterns");
    };
    if (not isComplianceOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only compliance officers and admins can create behavior patterns");
    };
    let pattern = {
      id = nextPatternId;
      user;
      patternDescription = description;
      detectedAt = Time.now();
      analyzedBy = caller;
    };
    patterns.add(nextPatternId, pattern);
    nextPatternId += 1;
    addAuditEntry(caller, "CREATE_BEHAVIOR_PATTERN", "Created behavior pattern " # pattern.id.toText());
    pattern.id;
  };

  public query ({ caller }) func getBehaviorPattern(patternId : Nat) : async ?BehaviorPattern {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view behavior patterns");
    };
    if (not isComplianceOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only compliance officers and admins can view behavior patterns");
    };
    patterns.get(patternId);
  };

  // Margin Analysis (Financial data - restricted to authorized roles)
  public shared ({ caller }) func addMarginSnapshot(available : Float, used : Float, timestamp : Timestamp) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add margin snapshots");
    };
    if (not canManageFinancialData(caller)) {
      Runtime.trap("Unauthorized: Only authorized financial roles can add margin snapshots");
    };
    let snapshot : MarginSnapshot = {
      date = timestamp;
      marginAvailable = available;
      marginUsed = used;
      snapshotTime = Time.now();
      recordedBy = caller;
    };
    marginSnapshots.add(snapshot);
    addAuditEntry(caller, "ADD_MARGIN_SNAPSHOT", "Added margin snapshot");
  };

  public query ({ caller }) func getMarginSnapshots() : async [MarginSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view margin snapshots");
    };
    marginSnapshots.toArray();
  };

  public query ({ caller }) func getCollateralRecords() : async [CollateralRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view collateral records");
    };
    collateralRecords.toArray();
  };

  // Dashboard Metrics (All authenticated users can view)
  public query ({ caller }) func getDashboardMetrics() : async {
    totalClients : Nat;
    totalTrades : Nat;
    latestMarginAvailable : Float;
    latestMarginUsed : Float;
    reconciliationRunCount : Nat;
    pendingDeadlines : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view dashboard metrics");
    };

    var totalClients = 0;
    for ((id, client) in clients.entries()) {
      totalClients += 1;
    };

    var totalTrades = 0;
    for ((code, trades) in tradeMap.entries()) {
      totalTrades += trades.size();
    };

    var latestMarginAvailable = 0.0;
    var latestMarginUsed = 0.0;
    let marginArray = marginSnapshots.toArray();
    if (marginArray.size() > 0) {
      let latest = marginArray[marginArray.size() - 1];
      latestMarginAvailable := latest.marginAvailable;
      latestMarginUsed := latest.marginUsed;
    };

    var reconciliationRunCount = 0;
    for ((id, run) in reconciliationRuns.entries()) {
      reconciliationRunCount += 1;
    };

    var pendingDeadlines = 0;
    let currentTime = Time.now();
    for ((id, deadline) in regulatoryDeadlines.entries()) {
      if (deadline.dueDate > currentTime and deadline.status == "Pending") {
        pendingDeadlines += 1;
      };
    };

    {
      totalClients;
      totalTrades;
      latestMarginAvailable;
      latestMarginUsed;
      reconciliationRunCount;
      pendingDeadlines;
    };
  };

  // Regulatory Calendar Management
  public shared ({ caller }) func addRegulatoryDeadline(
    title : Text,
    description : Text,
    dueDate : Timestamp,
    category : Text
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add regulatory deadlines");
    };
    if (not isComplianceOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only compliance officers and admins can add regulatory deadlines");
    };

    let deadline : RegulatoryDeadline = {
      id = nextDeadlineId;
      title;
      description;
      dueDate;
      category;
      status = "Pending";
      createdBy = caller;
      createdAt = Time.now();
    };
    regulatoryDeadlines.add(nextDeadlineId, deadline);
    nextDeadlineId += 1;
    addAuditEntry(caller, "ADD_REGULATORY_DEADLINE", "Added regulatory deadline: " # title);
    deadline.id;
  };

  public query ({ caller }) func getRegulatoryDeadlines() : async [RegulatoryDeadline] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view regulatory deadlines");
    };

    var deadlines : [RegulatoryDeadline] = [];
    for ((id, deadline) in regulatoryDeadlines.entries()) {
      deadlines := deadlines.concat([deadline]);
    };
    deadlines;
  };

  public shared ({ caller }) func updateRegulatoryDeadlineStatus(deadlineId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update regulatory deadlines");
    };
    if (not isComplianceOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only compliance officers and admins can update regulatory deadlines");
    };

    switch (regulatoryDeadlines.get(deadlineId)) {
      case (?deadline) {
        let updated : RegulatoryDeadline = {
          deadline with status;
        };
        regulatoryDeadlines.add(deadlineId, updated);
        addAuditEntry(caller, "UPDATE_DEADLINE_STATUS", "Updated deadline " # deadlineId.toText() # " to " # status);
      };
      case (null) { Runtime.trap("Deadline not found") };
    };
  };

  // Report Management
  public query ({ caller }) func getReportTemplates() : async [ReportTemplate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view report templates");
    };

    [
      { id = "client-summary"; name = "Client Summary Report"; description = "Summary of all client accounts"; category = "Client" },
      { id = "trade-activity"; name = "Trade Activity Report"; description = "Detailed trade activity analysis"; category = "Trading" },
      { id = "margin-analysis"; name = "Margin Analysis Report"; description = "Margin utilization and availability"; category = "Financial" },
      { id = "compliance-audit"; name = "Compliance Audit Report"; description = "Compliance and regulatory audit trail"; category = "Compliance" },
      { id = "reconciliation-summary"; name = "Reconciliation Summary"; description = "Statement reconciliation summary"; category = "Financial" }
    ];
  };

  public shared ({ caller }) func generateReport(templateId : Text, parameters : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can generate reports");
    };

    let report : GeneratedReport = {
      id = nextReportId;
      templateId;
      generatedBy = caller;
      generatedAt = Time.now();
      parameters;
      status = "Generated";
    };
    generatedReports.add(nextReportId, report);
    nextReportId += 1;
    addAuditEntry(caller, "GENERATE_REPORT", "Generated report: " # templateId);
    report.id;
  };

  public query ({ caller }) func getGeneratedReports() : async [GeneratedReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view generated reports");
    };

    var reports : [GeneratedReport] = [];
    for ((id, report) in generatedReports.entries()) {
      if (report.generatedBy == caller or isAdminUser(caller) or isComplianceOrAdmin(caller)) {
        reports := reports.concat([report]);
      };
    };
    reports;
  };

  // Audit Trail (Admin and Compliance only)
  public query ({ caller }) func getAuditEntries() : async [AuditEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view audit entries");
    };
    if (not isComplianceOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only compliance officers and admins can view audit trail");
    };
    auditEntries.toArray();
  };

  // Helper Functions
  func generateDocumentKey(clientId : ClientId, docType : Text) : DocumentKey {
    let timeStamp = Time.now().toText();
    clientId.toText() # "_" # docType # "_" # timeStamp;
  };
};
