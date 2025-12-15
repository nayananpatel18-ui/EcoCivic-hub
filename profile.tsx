import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Award, TreePine, AlertCircle, MapPin } from 'lucide-react';
import { apiService } from '@/services/api';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    treesPlanted: 0,
    issuesReported: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadStats();
    refreshUser();
  }, [user?.id]);

  const loadStats = async () => {
    if (!user) return;
    const trees = await apiService.getTrees(user.id);
    const issues = await apiService.getIssues(user.id);
    setStats({
      treesPlanted: trees.length,
      issuesReported: issues.length,
    });
  };

  if (!user) return null;

  const badgeInfo: Record<string, { icon: string; color: string; name: string }> = {
    greenStarter: { icon: '🌱', color: 'bg-success/10 text-success', name: t('rewards.greenStarter') },
    ecoGuardian: { icon: '🛡️', color: 'bg-primary/10 text-primary', name: t('rewards.ecoGuardian') },
    treePlanter: { icon: '🌳', color: 'bg-success/10 text-success', name: t('rewards.treePlanter') },
    communityHero: { icon: '🦸', color: 'bg-accent/10 text-accent', name: t('rewards.communityHero') },
  };

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-24 h-24 bg-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
          <Badge variant="outline" className="text-primary-foreground border-primary-foreground">
            {user.role === 'admin' ? 'Administrator' : 'Member'}
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Award className="w-10 h-10 text-primary mb-2" />
                <div className="text-3xl font-bold">{user.points}</div>
                <div className="text-sm text-muted-foreground">{t('rewards.points')}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <TreePine className="w-10 h-10 text-primary mb-2" />
                <div className="text-3xl font-bold">{stats.treesPlanted}</div>
                <div className="text-sm text-muted-foreground">Trees Planted</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="w-10 h-10 text-accent mb-2" />
                <div className="text-3xl font-bold">{stats.issuesReported}</div>
                <div className="text-sm text-muted-foreground">Issues Reported</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>{t('rewards.badges')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {user.badges.map(badge => {
                    const info = badgeInfo[badge] || { icon: '🏆', color: 'bg-muted', name: badge };
                    return (
                      <div
                        key={badge}
                        className={`p-4 rounded-lg ${info.color} text-center`}
                      >
                        <div className="text-3xl mb-2">{info.icon}</div>
                        <div className="font-medium text-sm">{info.name}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No badges earned yet</p>
                  <p className="text-sm mt-1">Start planting trees and reporting issues!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              {user.location && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </p>
                  <p className="font-medium">{user.location}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="outline">{user.role === 'admin' ? 'Administrator' : 'Member'}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
