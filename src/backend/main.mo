import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Timestamp = Int;
  type DocumentKey = Text;
  type ClientID = Nat;

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
  public type UserProfile = {
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

  // Margin Snapshot Structure
  type MarginSnapshot = {
    date : Timestamp;
    marginAvailable : Float;
    marginUsed : Float;
    snapshotTime : Timestamp;
    recordedBy : Principal;
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

  public type Trade = {
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

  let clients = Map.empty<ClientID, KycDocument>();
  let documents = Map.empty<DocumentKey, DocumentMeta>();
  let threads = Map.empty<Nat, Thread>();
  let patterns = Map.empty<Nat, BehaviorPattern>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let auditEntries = List.empty<AuditEntry>();
  let marginSnapshots = List.empty<MarginSnapshot>();
  let interestRecords = List.empty<InterestRecord>();

  // New stateful trade storage!
  let tradeMap = Map.empty<Text, [Trade]>(); // Use client_code as key

  var nextThreadId = 0;
  var nextPatternId = 0;
  var currentClientId = 0;

  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to check if user has read-only restriction (Dealer role)
  func isReadOnlyUser(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.extendedRole == "Dealer" };
      case (null) { false };
    };
  };

  // Helper function to check if user is compliance/admin
  func isComplianceOrAdmin(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
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
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        profile.extendedRole == "Accountant" or profile.extendedRole == "Operations Manager" or profile.extendedRole == "Super Admin";
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

  // User Profile Management
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
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    addAuditEntry(caller, "UPDATE_PROFILE", "User updated their profile");
  };

  // Trade Import Workflow
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

  // Fetch all trades for a given client code
  public query ({ caller }) func getTradesByClientCode(client_code : Text) : async [Trade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch trades");
    };

    switch (tradeMap.get(client_code)) {
      case (?trades) { trades };
      case (null) { [] };
    };
  };

  // Fetch all trades in the system
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
  public shared ({ caller }) func addDocument(clientId : ClientID, docType : Text, blob : Storage.ExternalBlob) : async () {
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
    switch (documents.get(key)) {
      case (?doc) {
        // Users can view documents they uploaded or if they are admin
        if (doc.uploadedBy == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?doc;
        } else {
          Runtime.trap("Unauthorized: Can only view your own documents or be an admin");
        };
      };
      case (null) { null };
    };
  };

  // Client Management (KYC)
  public shared ({ caller }) func createClient(name : Text, pan : Text, address : Text) : async ClientID {
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

  public query ({ caller }) func getClient(clientId : ClientID) : async ?KycDocument {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view clients");
    };
    clients.get(clientId);
  };

  public shared ({ caller }) func updateClient(clientId : ClientID, name : Text, pan : Text, address : Text) : async () {
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
          AccessControl.isAdmin(accessControlState, caller);
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
  func generateDocumentKey(clientId : ClientID, docType : Text) : DocumentKey {
    let timeStamp = Time.now().toText();
    clientId.toText() # "_" # docType # "_" # timeStamp;
  };
};
