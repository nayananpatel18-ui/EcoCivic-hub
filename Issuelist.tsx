import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { apiService } from '@/services/api';
import type { CivicIssue } from '@/types';
import { format } from 'date-fns';

export default function IssueList() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [myIssues, setMyIssues] = useState<CivicIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, [user]);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const allIssues = await apiService.getIssues();
      setIssues(allIssues);
      if (user) {
        const userIssues = await apiService.getIssues(user.id);
        setMyIssues(userIssues);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported':
        return 'bg-accent/10 text-accent';
      case 'inReview':
        return 'bg-info/10 text-info';
      case 'resolved':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const IssueCard = ({ issue }: { issue: CivicIssue }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
          {issue.photoUrl ? (
            <img
              src={issue.photoUrl}
              alt={t(`issues.categories.${issue.category}`)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <span>{t(`issues.categories.${issue.category}`)}</span>
                {issue.isEmergency && (
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                )}
              </h3>
              <p className="text-sm text-muted-foreground">by {issue.username}</p>
            </div>
            <Badge className={getStatusColor(issue.status)}>
              {t(`issues.${issue.status}`)}
            </Badge>
          </div>
          <p className="text-sm line-clamp-2">{issue.description}</p>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{issue.location}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{format(new Date(issue.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-accent text-accent-foreground py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('issues.title')}</h1>
            <p className="opacity-90">Report and track civic issues</p>
          </div>
          <Link to="/issues/report">
            <Button size="lg" variant="secondary">
              <Plus className="w-5 h-5 mr-2" />
              {t('issues.reportIssue')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">{t('issues.allIssues')}</TabsTrigger>
            <TabsTrigger value="my">{t('issues.myIssues')}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="aspect-video w-full bg-muted rounded-t-lg" />
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : issues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map(issue => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No issues reported yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to report a civic issue!
                </p>
                <Link to="/issues/report">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('issues.reportIssue')}
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="aspect-video w-full bg-muted rounded-t-lg" />
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myIssues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myIssues.map(issue => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">You haven't reported any issues yet</h3>
                <p className="text-muted-foreground mb-6">
                  Help your community by reporting civic issues!
                </p>
                <Link to="/issues/report">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('issues.reportIssue')}
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
