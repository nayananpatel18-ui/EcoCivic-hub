import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreePine, Plus, MapPin, Calendar } from 'lucide-react';
import { apiService } from '@/services/api';
import type { Tree } from '@/types';
import { format } from 'date-fns';

export default function TreeList() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [myTrees, setMyTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrees();
  }, [user]);

  const loadTrees = async () => {
    setLoading(true);
    try {
      const allTrees = await apiService.getTrees();
      setTrees(allTrees);
      if (user) {
        const userTrees = await apiService.getTrees(user.id);
        setMyTrees(userTrees);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const TreeCard = ({ tree }: { tree: Tree }) => (
    <Link to={`/trees/${tree.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
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
                <TreePine className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{t(`trees.types.${tree.type}`)}</h3>
                <p className="text-sm text-muted-foreground">by {tree.username}</p>
              </div>
              <Badge className={getStatusColor(tree.status)}>
                {t(`trees.${tree.status}`)}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{tree.location}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Planted {format(new Date(tree.plantedDate), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('trees.title')}</h1>
            <p className="opacity-90">Track and care for community trees</p>
          </div>
          <Link to="/trees/add">
            <Button size="lg" variant="secondary">
              <Plus className="w-5 h-5 mr-2" />
              {t('trees.addTree')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">{t('trees.allTrees')}</TabsTrigger>
            <TabsTrigger value="my">{t('trees.myTrees')}</TabsTrigger>
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
            ) : trees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trees.map(tree => (
                  <TreeCard key={tree.id} tree={tree} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <TreePine className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No trees planted yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to plant a tree in your community!
                </p>
                <Link to="/trees/add">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('trees.addTree')}
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
            ) : myTrees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTrees.map(tree => (
                  <TreeCard key={tree.id} tree={tree} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <TreePine className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">You haven't planted any trees yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start your green journey by planting your first tree!
                </p>
                <Link to="/trees/add">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('trees.addTree')}
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
