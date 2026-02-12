import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useCreateClient } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { validatePAN } from '../../validation/pan';

interface ClientUpsertModalProps {
  open: boolean;
  onClose: () => void;
  clientId?: bigint;
}

export default function ClientUpsertModal({ open, onClose, clientId }: ClientUpsertModalProps) {
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [address, setAddress] = useState('');
  const [panError, setPanError] = useState('');

  const createClient = useCreateClient();

  const handlePanChange = (value: string) => {
    setPan(value.toUpperCase());
    if (value && !validatePAN(value)) {
      setPanError('Invalid PAN format (e.g., ABCDE1234F)');
    } else {
      setPanError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePAN(pan)) {
      setPanError('Invalid PAN format');
      return;
    }

    try {
      await createClient.mutateAsync({ name, pan, address });
      toast.success('Client created successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create client');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{clientId ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            Enter client details and KYC information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter client's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pan">PAN *</Label>
            <Input
              id="pan"
              value={pan}
              onChange={(e) => handlePanChange(e.target.value)}
              placeholder="ABCDE1234F"
              maxLength={10}
              required
            />
            {panError && <p className="text-xs text-destructive">{panError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createClient.isPending || !!panError}>
              {createClient.isPending ? 'Creating...' : 'Create Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
