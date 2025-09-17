import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetCurrentUserUseCase } from '../../../features/user/application/get-current-user.use-case';
import { SignInUseCase } from '../../../features/user/application/sign-in.use-case';
import { SignOutUseCase } from '../../../features/user/application/sign-out.use-case';
import { User } from '../../../features/user/domain/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private readonly getCurrentUser = inject(GetCurrentUserUseCase);
  private readonly signIn = inject(SignInUseCase);
  private readonly signOut = inject(SignOutUseCase);

  protected isMobileMenuOpen = signal(false);
  protected user = signal<User | null>(null);

  ngOnInit(): void {
    this.loadUser();
  }

  private async loadUser() {
    this.user.set(await this.getCurrentUser.execute());
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  async doSignIn() {
    const name = prompt('Tu nombre para continuar:')?.trim();
    if (!name) return;
    const u = await this.signIn.execute(name);
    this.user.set(u);
  }

  async doSignOut() {
    await this.signOut.execute();
    this.user.set(null);
  }
}
