import { Directive, inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectUserRoles } from '../../store/auth/auth.selectors';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnDestroy {
  private store = inject(Store);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  private destroy$ = new Subject<void>();
  private hasView = false;
  private requiredRoles: string[] = [];

  private currentRoles: string[] = [];

  @Input() set appHasRole(roles: string[]) {
    this.requiredRoles = roles;
    this.updateView();
  }

  constructor() {
    this.store.select(selectUserRoles)
      .pipe(takeUntil(this.destroy$))
      .subscribe((roles) => {
        this.currentRoles = roles;
        this.updateView();
      });
  }

  private updateView() {
    const hasRole = this.currentRoles.some(role => this.requiredRoles.includes(role));
    
    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
