import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);

  /** Public observable for components to bind to loading state */
  public readonly isLoading$: Observable<boolean> = this._isLoading$.asObservable();

  /** Show the global loading indicator (increments request counter) */
  show(): void {
    this.activeRequests++;
    if (!this._isLoading$.value) {
      this._isLoading$.next(true);
    }
  }

  /** Hide the global loading indicator (decrements request counter) */
  hide(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0 && this._isLoading$.value) {
      this._isLoading$.next(false);
    }
  }

  /** Force hide the loader regardless of active request count */
  forceHide(): void {
    this.activeRequests = 0;
    this._isLoading$.next(false);
  }

  /** Get snapshot of current loading state */
  get isLoading(): boolean {
    return this._isLoading$.value;
  }
}
