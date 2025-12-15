import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Calendar, User, TreePine, Plus } from 'lucide-react';
import { apiService } from '@/services/api';
import type { Tree, TreeUpdate } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function TreeDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tree, setTree] = useState<Tree | null>(null);
  const [updates, setUpdates] = useState<TreeUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTree();
    }
  }, [id]);

  const loadTree = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const treeData = await apiService.getTree(id);
      if (treeData) {
        setTree(treeData);
        const treeUpdates = await apiService.getTreeUpdates(id);
        setUpdates(treeUpdates);
      } else {
        toast.error('Tree not found');
        navigate('/trees');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <TreePine className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!tree) {
    return null;
  }

  const isOwner = user?.id === tree.userId;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted':
        return 'bg-muted text-muted-foreground';
      case 'growing':
        return 'bg-info/10 text-info';
      case 'healthy':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('trees.treeDetails')}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                  {tree.photoUrl ? (
                    <img
                      src={tree.photoUrl}
                      alt={t(`trees.types.${tree.type}`)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TreePine className="w-24 h-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{t(`trees.types.${tree.type}`)}</h2>
                      <p className="text-muted-foreground">Tree ID: {tree.id.slice(0, 8)}</p>
                    </div>
                    <Badge className={getStatusColor(tree.status)}>
                      {t(`trees.${tree.status}`)}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="w-5 h-5" />
                      <div>
                        <p className="text-xs">Planted by</p>
                        <p className="font-medium text-foreground">{tree.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <div>
                        <p className="text-xs">Location</p>
                        <p className="font-medium text-foreground">{tree.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="text-xs">Planted Date</p>
                        <p className="font-medium text-foreground">
                          {format(new Date(tree.plantedDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="text-xs">Last Update</p>
                        <p className="font-medium text-foreground">
                          {format(new Date(tree.lastUpdateDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isOwner && (
                    <>
                      <Separator />
                      <Link to={`/trees/${tree.id}/update`}>
                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          {t('trees.addUpdate')}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('trees.monthlyUpdate')}</CardTitle>
              </CardHeader>
              <CardContent>
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map(update => (
                      <div key={update.id} className="flex space-x-4 p-4 rounded-lg border border-border">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {update.photoUrl ? (
                            <img
                              src={update.photoUrl}
                              alt="Update"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <TreePine className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">
                            {format(new Date(update.createdAt), 'MMM d, yyyy')}
                          </p>
                          {update.notes && (
                            <p className="text-sm">{update.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TreePine className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No updates yet</p>
                    {isOwner && (
                      <Link to={`/trees/${tree.id}/update`}>
                        <Button className="mt-4" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Update
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${tree.status === 'planted' || tree.status === 'growing' || tree.status === 'healthy' ? 'bg-success' : 'bg-muted'}`} />
                    <div className="flex-1">
                      <p className="font-medium">{t('trees.planted')}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tree.plantedDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${tree.status === 'growing' || tree.status === 'healthy' ? 'bg-success' : 'bg-muted'}`} />
                    <div className="flex-1">
                      <p className="font-medium">{t('trees.growing')}</p>
                      {tree.status === 'growing' || tree.status === 'healthy' ? (
                        <p className="text-xs text-muted-foreground">In progress</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Pending</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${tree.status === 'healthy' ? 'bg-success' : 'bg-muted'}`} />
                    <div className="flex-1">
                      <p className="font-medium">{t('trees.healthy')}</p>
                      {tree.status === 'healthy' ? (
                        <p className="text-xs text-muted-foreground">Achieved!</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Goal</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Care Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>🌱 Water regularly, especially during dry seasons</p>
                <p>☀️ Ensure adequate sunlight exposure</p>
                <p>🌿 Remove weeds around the base</p>
                <p>📸 Update monthly with photos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
