import { User } from './user';

export abstract class UserRepository {
  abstract getCurrentUser(): Promise<User | null>;
  abstract signIn(name: string): Promise<User>;
  abstract signOut(): Promise<void>;
}
