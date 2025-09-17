import { Injectable, inject } from '@angular/core';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user';

@Injectable({ providedIn: 'root' })
export class GetCurrentUserUseCase {
  private readonly repo = inject(UserRepository);
  execute(): Promise<User | null> {
    return this.repo.getCurrentUser();
  }
}
