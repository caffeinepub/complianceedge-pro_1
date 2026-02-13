import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Blob "mo:core/Blob";

module {
  type Timestamp = Int;
  type DocumentKey = Text;
  type ClientID = Nat;
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
  type UserProfile = {
    name : Text;
    email : Text;
    department : Text;
    extendedRole : Text;
  };
  type DocumentMeta = {
    uploadedBy : Principal;
    uploadTime : Timestamp;
    file : Blob;
    docType : Text;
  };
  type KycDocument = {
    name : Text;
    pan : Text;
    address : Text;
    documents : [DocumentKey];
    createdAt : Timestamp;
    updatedAt : Timestamp;
    createdBy : Principal;
  };
  type MarginSnapshot = {
    date : Timestamp;
    marginAvailable : Float;
    marginUsed : Float;
    snapshotTime : Timestamp;
    recordedBy : Principal;
  };
  type InterestRecord = {
    loanID : Text;
    amount : Float;
    interestRate : Float;
    startDate : Timestamp;
    endDate : ?Timestamp;
  };
  type AuditEntry = {
    entryTime : Timestamp;
    user : Principal;
    action : Text;
    details : Text;
  };
  type Thread = {
    id : Nat;
    title : Text;
    creator : Principal;
    authorizedUsers : [Principal];
    createdAt : Timestamp;
  };
  type BehaviorPattern = {
    id : Nat;
    user : Principal;
    patternDescription : Text;
    detectedAt : Timestamp;
    analyzedBy : Principal;
  };

  type OldActor = {
    clients : Map.Map<ClientID, KycDocument>;
    documents : Map.Map<DocumentKey, DocumentMeta>;
    threads : Map.Map<Nat, Thread>;
    patterns : Map.Map<Nat, BehaviorPattern>;
    userProfiles : Map.Map<Principal, UserProfile>;
    auditEntries : List.List<AuditEntry>;
    marginSnapshots : List.List<MarginSnapshot>;
    interestRecords : List.List<InterestRecord>;
    currentClientId : Nat;
    nextPatternId : Nat;
    nextThreadId : Nat;
  };

  type NewActor = {
    clients : Map.Map<ClientID, KycDocument>;
    documents : Map.Map<DocumentKey, DocumentMeta>;
    threads : Map.Map<Nat, Thread>;
    patterns : Map.Map<Nat, BehaviorPattern>;
    userProfiles : Map.Map<Principal, UserProfile>;
    auditEntries : List.List<AuditEntry>;
    marginSnapshots : List.List<MarginSnapshot>;
    interestRecords : List.List<InterestRecord>;
    tradeMap : Map.Map<Text, [Trade]>;
    nextThreadId : Nat;
    nextPatternId : Nat;
    currentClientId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    { old with tradeMap = Map.empty<Text, [Trade]>() };
  };
};
