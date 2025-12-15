import type { User, Tree, TreeUpdate, CivicIssue, Challenge } from '@/types';

const STORAGE_KEYS = {
  USERS: 'ecocivic_users',
  CURRENT_USER: 'ecocivic_current_user',
  TREES: 'ecocivic_trees',
  TREE_UPDATES: 'ecocivic_tree_updates',
  ISSUES: 'ecocivic_issues',
  CHALLENGES: 'ecocivic_challenges',
};

class StorageService {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUsers(): User[] {
    return this.getItem<User>(STORAGE_KEYS.USERS);
  }

  saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  getTrees(): Tree[] {
    return this.getItem<Tree>(STORAGE_KEYS.TREES);
  }

  saveTrees(trees: Tree[]): void {
    this.setItem(STORAGE_KEYS.TREES, trees);
  }

  getTreeUpdates(): TreeUpdate[] {
    return this.getItem<TreeUpdate>(STORAGE_KEYS.TREE_UPDATES);
  }

  saveTreeUpdates(updates: TreeUpdate[]): void {
    this.setItem(STORAGE_KEYS.TREE_UPDATES, updates);
  }

  getIssues(): CivicIssue[] {
    return this.getItem<CivicIssue>(STORAGE_KEYS.ISSUES);
  }

  saveIssues(issues: CivicIssue[]): void {
    this.setItem(STORAGE_KEYS.ISSUES, issues);
  }

  getChallenges(): Challenge[] {
    return this.getItem<Challenge>(STORAGE_KEYS.CHALLENGES);
  }

  saveChallenges(challenges: Challenge[]): void {
    this.setItem(STORAGE_KEYS.CHALLENGES, challenges);
  }

  initializeDefaultData(): void {
    if (this.getChallenges().length === 0) {
      const defaultChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Plant 3 Trees in 30 Days',
          description: 'Join our community challenge to plant 3 trees within the next 30 days and earn 50 bonus points!',
          points: 50,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          participants: [],
          isActive: true,
        },
        {
          id: '2',
          title: 'Monthly Green Challenge',
          description: 'Report at least 2 civic issues and plant 1 tree this month to become an Eco Guardian!',
          points: 30,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          participants: [],
          isActive: true,
        },
      ];
      this.saveChallenges(defaultChallenges);
    }
  }

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new StorageService();
