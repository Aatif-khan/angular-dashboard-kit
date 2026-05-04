import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TokenService } from './core/services/token.service';
import { AuthActions } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('angular-dashboard-kit');
  
  private store = inject(Store);
  private tokenService = inject(TokenService);

  ngOnInit() {
    const user = this.tokenService.getUser();
    if (user) {
      this.store.dispatch(AuthActions.setUser({ user }));
    }
  }
}
