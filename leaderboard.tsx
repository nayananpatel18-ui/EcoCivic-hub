import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, TreePine, AlertCircle, Medal } from 'lucide-react';
import { apiService } from '@/services/api';
import type { LeaderboardEntry } from '@/types';

export default function Leaderboard() {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await apiService.getLeaderboard();
      setLeaderboard(data);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">{t('rewards.leaderboard')}</h1>
          <p className="text-lg opacity-90">Top contributors in our community</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-muted animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-muted-foreground/20" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted-foreground/20 rounded w-1/4" />
                      <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : leaderboard.length > 0 ? (
          <>
            {leaderboard.slice(0, 3).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {leaderboard.slice(0, 3).map((entry, index) => (
                  <Card key={entry.userId} className={index === 0 ? 'md:col-span-3' : ''}>
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-2">
                        {getRankIcon(entry.rank)}
                      </div>
                      <CardTitle className="text-2xl">{entry.username}</CardTitle>
                      {entry.location && (
                        <p className="text-sm text-muted-foreground">{entry.location}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center space-x-6">
                        <div className="text-center">
                          <Award className="w-8 h-8 text-primary mx-auto mb-1" />
                          <div className="text-2xl font-bold">{entry.points}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                        <div className="text-center">
                          <TreePine className="w-8 h-8 text-primary mx-auto mb-1" />
                          <div className="text-2xl font-bold">{entry.treesPlanted}</div>
                          <div className="text-xs text-muted-foreground">Trees</div>
                        </div>
                        <div className="text-center">
                          <AlertCircle className="w-8 h-8 text-accent mx-auto mb-1" />
                          <div className="text-2xl font-bold">{entry.issuesReported}</div>
                          <div className="text-xs text-muted-foreground">Issues</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {leaderboard.length > 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>All Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboard.slice(3).map(entry => (
                      <div
                        key={entry.userId}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {getRankIcon(entry.rank)}
                          </div>
                          <div>
                            <p className="font-medium">{entry.username}</p>
                            {entry.location && (
                              <p className="text-sm text-muted-foreground">{entry.location}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="font-bold">{entry.points}</div>
                            <div className="text-xs text-muted-foreground">pts</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{entry.treesPlanted}</div>
                            <div className="text-xs text-muted-foreground">trees</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{entry.issuesReported}</div>
                            <div className="text-xs text-muted-foreground">issues</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-16">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No rankings yet</h3>
                <p className="text-muted-foreground">
                  Be the first to contribute and top the leaderboard!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
