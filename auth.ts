import type { User } from '@/types';
import { storageService } from './storage';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  location?: string;
}

class AuthService {
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const users = storageService.getUsers();
    const user = users.find(
      u => u.username === credentials.username
    );

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const storedPassword = localStorage.getItem(`pwd_${user.id}`);
    if (storedPassword !== credentials.password) {
      throw new Error('Invalid username or password');
    }

    storageService.setCurrentUser(user);
    return user;
  }

  async register(data: RegisterData): Promise<User> {
    const users = storageService.getUsers();
    
    if (users.some(u => u.username === data.username)) {
      throw new Error('Username already exists');
    }

    const isFirstUser = users.length === 0;
    const newUser: User = {
      id: this.generateId(),
      username: data.username,
      role: isFirstUser ? 'admin' : 'user',
      points: 0,
      badges: [],
      location: data.location,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storageService.saveUsers(users);
    
    localStorage.setItem(`pwd_${newUser.id}`, data.password);
    
    storageService.setCurrentUser(newUser);
    return newUser;
  }

  logout(): void {
    storageService.setCurrentUser(null);
  }

  getCurrentUser(): User | null {
    return storageService.getCurrentUser();
  }

  updateUser(user: User): void {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      storageService.saveUsers(users);
      
      const currentUser = storageService.getCurrentUser();
      if (currentUser?.id === user.id) {
        storageService.setCurrentUser(user);
      }
    }
  }

  addPoints(userId: string, points: number): void {
    const users = storageService.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.points += points;
      this.updateUser(user);
    }
  }

  addBadge(userId: string, badge: string): void {
    const users = storageService.getUsers();
    const user = users.find(u => u.id === userId);
    if (user && !user.badges.includes(badge)) {
      user.badges.push(badge);
      this.updateUser(user);
    }
  }
}

export const authService = new AuthService();
