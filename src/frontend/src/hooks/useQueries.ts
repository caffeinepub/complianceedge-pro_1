import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ClientID, KycDocument, MarginSnapshot, AuditEntry, DocumentKey, DocumentMeta } from '../backend';
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
    },
  });
}

export function useGetClient(clientId: ClientID | null) {
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

export function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, name, pan, address }: { clientId: ClientID; name: string; pan: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClient(clientId, name, pan, address);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['client', variables.clientId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useAddDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, docType, blob }: { clientId: ClientID; docType: string; blob: ExternalBlob }) => {
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
