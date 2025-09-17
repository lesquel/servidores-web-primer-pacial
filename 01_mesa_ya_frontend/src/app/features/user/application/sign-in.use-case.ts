import { Injectable, inject } from '@angular/core';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user';

@Injectable({ providedIn: 'root' })
export class SignInUseCase {
  private readonly repo = inject(UserRepository);
  execute(name: string): Promise<User> {
    return this.repo.signIn(name);
  }
}
