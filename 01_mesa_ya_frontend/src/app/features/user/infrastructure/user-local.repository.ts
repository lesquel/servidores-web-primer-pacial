import { Injectable } from '@angular/core';
import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';

const KEY = 'mesaya.currentUser';

function safeStorage(): Storage | null {
  try {
    // SSR safety: window may not exist
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class UserLocalRepository implements UserRepository {
  async getCurrentUser(): Promise<User | null> {
    const ls = safeStorage();
    if (!ls) return null;
    const raw = ls.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  async signIn(name: string): Promise<User> {
    const user: User = {
      id: 'u_' + Math.random().toString(36).slice(2, 9),
      name,
      avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`,
    };
    const ls = safeStorage();
    if (ls) ls.setItem(KEY, JSON.stringify(user));
    return user;
  }

  async signOut(): Promise<void> {
    const ls = safeStorage();
    if (ls) ls.removeItem(KEY);
  }
}
