import { Injectable, inject } from '@angular/core';
import { UserRepository } from '../domain/user.repository';

@Injectable({ providedIn: 'root' })
export class SignOutUseCase {
  private readonly repo = inject(UserRepository);
  execute(): Promise<void> {
    return this.repo.signOut();
  }
}
