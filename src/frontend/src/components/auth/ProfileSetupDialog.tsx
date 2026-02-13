import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { toast } from 'sonner';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import type { BusinessRole } from '../../auth/roles';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [extendedRole, setExtendedRole] = useState<BusinessRole>('Compliance Officer');
  
  const saveProfile = useSaveCallerUserProfile();
  const { refetch } = useCurrentUser();

  const ADMIN_EMAIL = 'sanjeev.vohra@gmail.com';
  const isAdminEmail = email.trim() === ADMIN_EMAIL;
  const showEmailHint = email.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !department) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name,
        email,
        department,
        extendedRole,
      });
      
      // Explicitly refetch to pick up any backend-enforced role changes
      await refetch();
      
      toast.success('Profile created successfully');
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your information to get started with ComplianceEdge Pro
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              required
            />
            {showEmailHint && (
              <Alert variant={isAdminEmail ? "default" : "destructive"} className="mt-2">
                {isAdminEmail ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      This email will receive Super Admin access automatically.
                    </AlertDescription>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Super Admin access requires using the admin email: <strong>{ADMIN_EMAIL}</strong>
                    </AlertDescription>
                  </>
                )}
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Compliance, Operations"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={extendedRole} onValueChange={(value) => setExtendedRole(value as BusinessRole)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Compliance Head">Compliance Head</SelectItem>
                <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                <SelectItem value="Accountant">Accountant</SelectItem>
                <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                <SelectItem value="Dealer">Dealer (Read-only)</SelectItem>
                <SelectItem value="External Auditor">External Auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
