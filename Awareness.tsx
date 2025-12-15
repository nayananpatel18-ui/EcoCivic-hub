import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TreePine, Recycle, Target, Users, Award } from 'lucide-react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Challenge } from '@/types';
import { toast } from 'sonner';

export default function Awareness() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    const data = await apiService.getChallenges();
    setChallenges(data);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      toast.error('Please login to join challenges');
      return;
    }
    try {
      await apiService.joinChallenge(challengeId);
      toast.success('Joined challenge successfully!');
      loadChallenges();
    } catch (error) {
      toast.error('Failed to join challenge');
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">{t('awareness.title')}</h1>
          <p className="text-lg opacity-90">Learn, grow, and make a difference</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('awareness.challenges')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map(challenge => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5" />
                        <span>{challenge.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {challenge.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      <Award className="w-3 h-3 mr-1" />
                      {challenge.points} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{challenge.participants.length} participants</span>
                    </div>
                    {user && !challenge.participants.includes(user.id) && (
                      <Button size="sm" onClick={() => handleJoinChallenge(challenge.id)}>
                        {t('awareness.joinChallenge')}
                      </Button>
                    )}
                    {user && challenge.participants.includes(user.id) && (
                      <Badge variant="outline">Joined</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">{t('awareness.treeCare')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <TreePine className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Watering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Water young trees regularly, especially during dry seasons. Deep watering encourages strong root growth.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TreePine className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Mulching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Apply mulch around the base to retain moisture, regulate temperature, and prevent weed growth.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TreePine className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Pruning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Remove dead or diseased branches to promote healthy growth and prevent pest infestations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">{t('awareness.wasteSeg')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Recycle className="w-10 h-10 text-info mb-2" />
                <CardTitle>Recyclable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Paper, plastic, glass, metal - items that can be recycled
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Recycle className="w-10 h-10 text-destructive mb-2" />
                <CardTitle>Hazardous</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Batteries, chemicals, electronics - require special disposal
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Recycle className="w-10 h-10 text-success mb-2" />
                <CardTitle>Organic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Food waste, garden waste - can be composted
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Recycle className="w-10 h-10 text-muted-foreground mb-2" />
                <CardTitle>General</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Non-recyclable items that go to landfill
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">{t('awareness.guidelines')}</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Plant Native Species</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose native tree species that are adapted to local climate and soil conditions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Proper Waste Disposal</h3>
                    <p className="text-sm text-muted-foreground">
                      Segregate waste at source and dispose of it in designated bins.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Report Issues Promptly</h3>
                    <p className="text-sm text-muted-foreground">
                      Report civic issues and hazards immediately to prevent accidents.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Community Participation</h3>
                    <p className="text-sm text-muted-foreground">
                      Engage with your community in environmental initiatives and awareness programs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
