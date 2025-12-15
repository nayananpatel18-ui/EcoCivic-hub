import type { Tree, TreeUpdate, CivicIssue, Challenge, LeaderboardEntry, TreeType, TreeStatus, IssueCategory, IssueStatus } from '@/types';
import { storageService } from './storage';
import { authService } from './auth';

class ApiService {
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async addTree(data: {
    type: TreeType;
    location: string;
    photoUrl: string;
  }): Promise<Tree> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const trees = storageService.getTrees();
    const newTree: Tree = {
      id: this.generateId(),
      userId: currentUser.id,
      username: currentUser.username,
      type: data.type,
      status: 'planted',
      location: data.location,
      photoUrl: data.photoUrl,
      plantedDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    trees.push(newTree);
    storageService.saveTrees(trees);

    authService.addPoints(currentUser.id, 10);
    
    const userTrees = trees.filter(t => t.userId === currentUser.id);
    if (userTrees.length === 1) {
      authService.addBadge(currentUser.id, 'greenStarter');
    } else if (userTrees.length >= 5) {
      authService.addBadge(currentUser.id, 'treePlanter');
    }

    return newTree;
  }

  async getTrees(userId?: string): Promise<Tree[]> {
    const trees = storageService.getTrees();
    if (userId) {
      return trees.filter(t => t.userId === userId);
    }
    return trees;
  }

  async getTree(id: string): Promise<Tree | null> {
    const trees = storageService.getTrees();
    return trees.find(t => t.id === id) || null;
  }

  async updateTreeStatus(treeId: string, status: TreeStatus): Promise<void> {
    const trees = storageService.getTrees();
    const tree = trees.find(t => t.id === treeId);
    if (tree) {
      tree.status = status;
      tree.lastUpdateDate = new Date().toISOString();
      storageService.saveTrees(trees);
    }
  }

  async addTreeUpdate(data: {
    treeId: string;
    photoUrl: string;
    notes?: string;
  }): Promise<TreeUpdate> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const updates = storageService.getTreeUpdates();
    const newUpdate: TreeUpdate = {
      id: this.generateId(),
      treeId: data.treeId,
      photoUrl: data.photoUrl,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    updates.push(newUpdate);
    storageService.saveTreeUpdates(updates);

    authService.addPoints(currentUser.id, 5);

    const tree = await this.getTree(data.treeId);
    if (tree && tree.status === 'planted') {
      await this.updateTreeStatus(data.treeId, 'growing');
    } else if (tree && tree.status === 'growing') {
      const treeUpdates = updates.filter(u => u.treeId === data.treeId);
      if (treeUpdates.length >= 2) {
        await this.updateTreeStatus(data.treeId, 'healthy');
        authService.addPoints(currentUser.id, 10);
      }
    }

    return newUpdate;
  }

  async getTreeUpdates(treeId: string): Promise<TreeUpdate[]> {
    const updates = storageService.getTreeUpdates();
    return updates.filter(u => u.treeId === treeId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async reportIssue(data: {
    category: IssueCategory;
    description: string;
    location: string;
    photoUrl: string;
    isEmergency: boolean;
  }): Promise<CivicIssue> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const issues = storageService.getIssues();
    const newIssue: CivicIssue = {
      id: this.generateId(),
      userId: currentUser.id,
      username: currentUser.username,
      category: data.category,
      description: data.description,
      location: data.location,
      photoUrl: data.photoUrl,
      status: 'reported',
      isEmergency: data.isEmergency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    issues.push(newIssue);
    storageService.saveIssues(issues);

    authService.addPoints(currentUser.id, 5);

    const userIssues = issues.filter(i => i.userId === currentUser.id);
    if (userIssues.length >= 3) {
      authService.addBadge(currentUser.id, 'communityHero');
    }

    return newIssue;
  }

  async getIssues(userId?: string): Promise<CivicIssue[]> {
    const issues = storageService.getIssues();
    if (userId) {
      return issues.filter(i => i.userId === userId);
    }
    return issues.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getIssue(id: string): Promise<CivicIssue | null> {
    const issues = storageService.getIssues();
    return issues.find(i => i.id === id) || null;
  }

  async updateIssueStatus(issueId: string, status: IssueStatus): Promise<void> {
    const issues = storageService.getIssues();
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      issue.status = status;
      issue.updatedAt = new Date().toISOString();
      storageService.saveIssues(issues);
    }
  }

  async getChallenges(): Promise<Challenge[]> {
    return storageService.getChallenges();
  }

  async joinChallenge(challengeId: string): Promise<void> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const challenges = storageService.getChallenges();
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.participants.includes(currentUser.id)) {
      challenge.participants.push(currentUser.id);
      storageService.saveChallenges(challenges);
    }
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = storageService.getUsers();
    const trees = storageService.getTrees();
    const issues = storageService.getIssues();

    const entries: LeaderboardEntry[] = users.map(user => ({
      userId: user.id,
      username: user.username,
      points: user.points,
      treesPlanted: trees.filter(t => t.userId === user.id).length,
      issuesReported: issues.filter(i => i.userId === user.id).length,
      location: user.location,
      rank: 0,
    }));

    entries.sort((a, b) => b.points - a.points);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }

  async getAllUsers() {
    return storageService.getUsers();
  }

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
    const users = storageService.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = role;
      authService.updateUser(user);
    }
  }
}

export const apiService = new ApiService();
