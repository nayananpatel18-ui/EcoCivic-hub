import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TreePine, AlertCircle, Award, TrendingUp, Users, Leaf } from 'lucide-react';
import { apiService } from '@/services/api';
import type { Tree, CivicIssue } from '@/types';

export default function Home() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalTrees: 0,
    totalIssues: 0,
    userTrees: 0,
    userIssues: 0,
  });
  const [recentTrees, setRecentTrees] = useState<Tree[]>([]);
  const [recentIssues, setRecentIssues] = useState<CivicIssue[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const trees = await apiService.getTrees();
    const issues = await apiService.getIssues();
    
    setStats({
      totalTrees: trees.length,
      totalIssues: issues.length,
      userTrees: user ? trees.filter(t => t.userId === user.id).length : 0,
      userIssues: user ? issues.filter(i => i.userId === user.id).length : 0,
    });

    setRecentTrees(trees.slice(-3).reverse());
    setRecentIssues(issues.slice(0, 3));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="relative text-primary-foreground py-20 px-4 bg-[#21c45fff] bg-none">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary-foreground rounded-full flex items-center justify-center">
                <Leaf className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('app.name')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t('app.tagline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t('nav.register')}
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  {t('nav.login')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <TreePine className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t('trees.title')}</CardTitle>
                <CardDescription>
                  Track and care for trees in your community
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <AlertCircle className="w-10 h-10 text-accent mb-2" />
                <CardTitle>{t('issues.title')}</CardTitle>
                <CardDescription>
                  Report civic issues and emergency hazards
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Award className="w-10 h-10 text-success mb-2" />
                <CardTitle>{t('rewards.title')}</CardTitle>
                <CardDescription>
                  Earn points and badges for your contributions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TreePine className="w-5 h-5" />
                  <span>Community Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trees Planted</span>
                    <span className="text-2xl font-bold text-primary">{stats.totalTrees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Issues Reported</span>
                    <span className="text-2xl font-bold text-accent">{stats.totalIssues}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Join our community to make a difference in your local environment.
                </p>
                <Link to="/register">
                  <Button className="w-full">{t('nav.register')}</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-lg opacity-90">{t('app.tagline')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Award className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold">{user?.points || 0}</div>
                <div className="text-sm text-muted-foreground">{t('rewards.points')}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <TreePine className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold">{stats.userTrees}</div>
                <div className="text-sm text-muted-foreground">{t('trees.myTrees')}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="w-8 h-8 text-accent mb-2" />
                <div className="text-2xl font-bold">{stats.userIssues}</div>
                <div className="text-sm text-muted-foreground">{t('issues.myIssues')}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Badge className="w-8 h-8 mb-2 flex items-center justify-center">
                  {user?.badges.length || 0}
                </Badge>
                <div className="text-2xl font-bold">{user?.badges.length || 0}</div>
                <div className="text-sm text-muted-foreground">{t('rewards.badges')}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('trees.title')}</span>
                <Link to="/trees">
                  <Button variant="ghost" size="sm">{t('common.view')}</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTrees.length > 0 ? (
                <div className="space-y-3">
                  {recentTrees.map(tree => (
                    <div key={tree.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                      <TreePine className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{t(`trees.types.${tree.type}`)}</div>
                        <div className="text-sm text-muted-foreground">{tree.location}</div>
                      </div>
                      <Badge variant="outline">{t(`trees.${tree.status}`)}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TreePine className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No trees planted yet</p>
                  <Link to="/trees">
                    <Button className="mt-4">{t('trees.addTree')}</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('issues.title')}</span>
                <Link to="/issues">
                  <Button variant="ghost" size="sm">{t('common.view')}</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentIssues.length > 0 ? (
                <div className="space-y-3">
                  {recentIssues.map(issue => (
                    <div key={issue.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                      <AlertCircle className={`w-8 h-8 ${issue.isEmergency ? 'text-destructive' : 'text-accent'}`} />
                      <div className="flex-1">
                        <div className="font-medium">{t(`issues.categories.${issue.category}`)}</div>
                        <div className="text-sm text-muted-foreground">{issue.location}</div>
                      </div>
                      <Badge variant="outline">{t(`issues.${issue.status}`)}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No issues reported yet</p>
                  <Link to="/issues">
                    <Button className="mt-4">{t('issues.reportIssue')}</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/trees/add">
                <Button className="w-full" size="lg">
                  <TreePine className="w-5 h-5 mr-2" />
                  {t('trees.addTree')}
                </Button>
              </Link>
              <Link to="/issues/report">
                <Button className="w-full" size="lg" variant="outline">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {t('issues.reportIssue')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Community</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Trees</span>
                  <span className="font-bold text-primary">{stats.totalTrees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Issues</span>
                  <span className="font-bold text-accent">{stats.totalIssues}</span>
                </div>
                <Link to="/leaderboard">
                  <Button variant="outline" className="w-full mt-4">
                    {t('rewards.leaderboard')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
