import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TreePine, AlertCircle, Award, TrendingUp, Users, Leaf, Shield, Heart, Sprout } from 'lucide-react';
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
      <div className="min-h-screen bg-background animate-fade-in">
        {/* Hero Section */}
        <div className="relative gradient-primary text-primary-foreground py-20 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-white rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-8 animate-scale-in">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-soft-xl">
                <Leaf className="w-14 h-14 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up leading-tight">
              Building Greener, Safer<br />Communities Together
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl mb-10 opacity-95 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Join thousands of citizens making a real impact through tree plantation, civic issue reporting, and community awareness
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-soft-lg font-semibold px-8 h-14 text-lg button-press">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white shadow-soft font-semibold px-8 h-14 text-lg button-press">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stats.totalTrees}+</div>
                <div className="text-sm md:text-base opacity-90">Trees Planted</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stats.totalIssues}+</div>
                <div className="text-sm md:text-base opacity-90">Issues Resolved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-soft col-span-2 md:col-span-1">
                <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
                <div className="text-sm md:text-base opacity-90">Community Driven</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How EcoCivic Hub Works</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Three simple ways to make a lasting impact in your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 stagger-animation">
            {/* Feature 1: Tree Plantation */}
            <Card className="shadow-soft-lg border-0 card-hover group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-success-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sprout className="w-10 h-10 text-success" />
                </div>
                <CardTitle className="text-2xl mb-3">{t('trees.title')}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Plant trees, track their growth with monthly updates, and earn rewards for your environmental contributions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/register">
                  <Button className="w-full shadow-soft button-press">
                    <TreePine className="w-4 h-4 mr-2" />
                    Plant a Tree
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Feature 2: Civic Issues */}
            <Card className="shadow-soft-lg border-0 card-hover group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-warning-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-accent" />
                </div>
                <CardTitle className="text-2xl mb-3">{t('issues.title')}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Report civic problems like fallen trees, open manholes, and flooded roads to keep your community safe
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/register">
                  <Button variant="outline" className="w-full shadow-soft button-press">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Report an Issue
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Feature 3: Community */}
            <Card className="shadow-soft-lg border-0 card-hover group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-info-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-10 h-10 text-info" />
                </div>
                <CardTitle className="text-2xl mb-3">Community Impact</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Access environmental guidelines, participate in challenges, and connect with fellow eco-warriors
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/awareness">
                  <Button variant="outline" className="w-full shadow-soft button-press">
                    <Users className="w-4 h-4 mr-2" />
                    View Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-soft-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-success" />
                  </div>
                  <span>Community Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-success-light/50">
                    <span className="text-muted-foreground font-medium">Trees Planted</span>
                    <span className="text-3xl font-bold text-success">{stats.totalTrees}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-warning-light/50">
                    <span className="text-muted-foreground font-medium">Issues Reported</span>
                    <span className="text-3xl font-bold text-accent">{stats.totalIssues}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft-lg border-0 gradient-primary text-white">
              <CardHeader>
                <CardTitle className="text-white">Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 text-base">
                  Join our community to make a difference in your local environment.
                </p>
                <Link to="/register">
                  <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 font-semibold shadow-soft">
                    {t('nav.register')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 animate-fade-in">
      <div className="gradient-primary text-primary-foreground py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse-soft" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 animate-slide-up">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-lg md:text-xl opacity-95">{t('app.tagline')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 stagger-animation">
          <Card className="shadow-soft-lg border-0 card-hover">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-info-light flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-info" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{user?.points || 0}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('rewards.points')}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft-lg border-0 card-hover">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-success-light flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TreePine className="w-6 h-6 text-success" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stats.userTrees}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('trees.myTrees')}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft-lg border-0 card-hover">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-warning-light flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stats.userIssues}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('issues.myIssues')}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft-lg border-0 card-hover">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-glow flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{user?.badges.length || 0}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('rewards.badges')}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card className="shadow-soft-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-success-light flex items-center justify-center">
                    <TreePine className="w-4 h-4 text-success" />
                  </div>
                  <span>{t('trees.title')}</span>
                </span>
                <Link to="/trees">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary button-press">{t('common.view')}</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTrees.length > 0 ? (
                <div className="space-y-3">
                  {recentTrees.map(tree => (
                    <div key={tree.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center flex-shrink-0">
                        <TreePine className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">{t(`trees.types.${tree.type}`)}</div>
                        <div className="text-sm text-muted-foreground truncate">{tree.location}</div>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">{t(`trees.${tree.status}`)}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                    <TreePine className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="mb-4 font-medium">No trees planted yet</p>
                  <Link to="/trees">
                    <Button className="shadow-soft button-press">{t('trees.addTree')}</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-warning-light flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-accent" />
                  </div>
                  <span>{t('issues.title')}</span>
                </span>
                <Link to="/issues">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary button-press">{t('common.view')}</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentIssues.length > 0 ? (
                <div className="space-y-3">
                  {recentIssues.map(issue => (
                    <div key={issue.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${issue.isEmergency ? 'bg-destructive/10' : 'bg-warning-light'}`}>
                        <AlertCircle className={`w-5 h-5 ${issue.isEmergency ? 'text-destructive' : 'text-accent'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">{t(`issues.categories.${issue.category}`)}</div>
                        <div className="text-sm text-muted-foreground truncate">{issue.location}</div>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">{t(`issues.${issue.status}`)}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="mb-4 font-medium">No issues reported yet</p>
                  <Link to="/issues">
                    <Button className="shadow-soft button-press">{t('issues.reportIssue')}</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Card className="md:col-span-2 shadow-soft-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <div className="w-8 h-8 rounded-lg bg-primary-glow flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/trees/add">
                <Button className="w-full shadow-soft button-press ripple-effect" size="lg">
                  <TreePine className="w-5 h-5 mr-2" />
                  {t('trees.addTree')}
                </Button>
              </Link>
              <Link to="/issues/report">
                <Button className="w-full shadow-soft button-press" size="lg" variant="outline">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {t('issues.reportIssue')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-soft-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <div className="w-8 h-8 rounded-lg bg-info-light flex items-center justify-center">
                  <Users className="w-4 h-4 text-info" />
                </div>
                <span>Community</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-success-light/50 transition-all hover:bg-success-light/70">
                  <span className="text-muted-foreground font-medium">Total Trees</span>
                  <span className="text-xl font-bold text-success">{stats.totalTrees}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-warning-light/50 transition-all hover:bg-warning-light/70">
                  <span className="text-muted-foreground font-medium">Total Issues</span>
                  <span className="text-xl font-bold text-accent">{stats.totalIssues}</span>
                </div>
                <Link to="/leaderboard">
                  <Button variant="outline" className="w-full mt-2 shadow-soft button-press">
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
