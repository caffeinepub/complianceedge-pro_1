import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAddRegulatoryDeadline } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface AddDeadlineDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddDeadlineDialog({ open, onClose }: AddDeadlineDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('SEBI');

  const addMutation = useAddRegulatoryDeadline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const dueDateTimestamp = BigInt(new Date(dueDate).getTime() * 1000000);
      await addMutation.mutateAsync({
        title,
        description,
        dueDate: dueDateTimestamp,
        category,
      });
      toast.success('Deadline added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add deadline');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Regulatory Deadline</DialogTitle>
          <DialogDescription>Create a new compliance deadline</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., SEBI Annual Report Submission"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about this deadline..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEBI">SEBI</SelectItem>
                <SelectItem value="NSE">NSE</SelectItem>
                <SelectItem value="BSE">BSE</SelectItem>
                <SelectItem value="MCX">MCX</SelectItem>
                <SelectItem value="NCDEX">NCDEX</SelectItem>
                <SelectItem value="RBI">RBI</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Adding...' : 'Add Deadline'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
