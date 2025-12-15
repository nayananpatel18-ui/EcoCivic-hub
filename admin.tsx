import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, AlertCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import type { User, CivicIssue, IssueStatus } from '@/types';
import { toast } from 'sonner';

export default function Admin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allUsers, allIssues] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getIssues(),
      ]);
      setUsers(allUsers);
      setIssues(allIssues);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await apiService.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    try {
      await apiService.updateIssueStatus(issueId, newStatus);
      toast.success(t('issues.updateSuccess'));
      loadData();
    } catch (error) {
      toast.error('Failed to update issue status');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          </div>
          <p className="opacity-90">Manage users and civic issues</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{t('admin.manageUsers')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted animate-pulse">
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/4" />
                    <div className="h-8 bg-muted-foreground/20 rounded w-24" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div>
                      <p className="font-medium">{u.username}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>{u.points} points</span>
                        <span>{u.badges.length} badges</span>
                        {u.location && <span>{u.location}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                        {u.role}
                      </Badge>
                      {u.id !== user?.id && (
                        <Select
                          value={u.role}
                          onValueChange={(value) => handleRoleChange(u.id, value as 'user' | 'admin')}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{t('admin.manageIssues')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted animate-pulse">
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/3" />
                    <div className="h-8 bg-muted-foreground/20 rounded w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map(issue => (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium">{t(`issues.categories.${issue.category}`)}</p>
                        {issue.isEmergency && (
                          <Badge variant="destructive" className="text-xs">Emergency</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {issue.location} • by {issue.username}
                      </p>
                    </div>
                    <Select
                      value={issue.status}
                      onValueChange={(value) => handleStatusChange(issue.id, value as IssueStatus)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reported">{t('issues.reported')}</SelectItem>
                        <SelectItem value="inReview">{t('issues.inReview')}</SelectItem>
                        <SelectItem value="resolved">{t('issues.resolved')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                {issues.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No issues to manage</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
