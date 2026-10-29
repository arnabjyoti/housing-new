import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface DecodedToken {
  id?: number | string;
  email?: string;
  phone_no?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private autoLogoutTimer: any = null;

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {}

  /**
   * Helper to verify if string has 3 parts of JWT (header.payload.signature)
   */
  public isValidJwtFormat(tokenStr: string): boolean {
    if (!tokenStr || typeof tokenStr !== 'string') return false;
    const parts = tokenStr.trim().split('.');
    return parts.length === 3;
  }

  /**
   * Get raw JWT token string
   */
  public getRawJwtToken(): string | null {
    // 1. Direct jwt_token in localStorage
    const jwtDirect = localStorage.getItem('jwt_token');
    if (jwtDirect && this.isValidJwtFormat(jwtDirect)) {
      return jwtDirect.trim();
    }

    // 2. Extract from JSON token object stored in 'token'
    const stored = localStorage.getItem('token');
    if (!stored) return null;

    if (this.isValidJwtFormat(stored)) {
      return stored.trim();
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        if (parsed.jwt_token && this.isValidJwtFormat(parsed.jwt_token)) {
          return parsed.jwt_token.trim();
        }
        if (parsed.token && this.isValidJwtFormat(parsed.token)) {
          return parsed.token.trim();
        }
      }
    } catch (e) {
      // not JSON
    }
    return null;
  }

  /**
   * Decode JWT token payload
   */
  public decodeToken(token?: string | null): DecodedToken | null {
    const rawToken = token || this.getRawJwtToken();
    if (!rawToken || !this.isValidJwtFormat(rawToken)) {
      return null;
    }

    try {
      const base64Url = rawToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Get expiration date of the token
   */
  public getTokenExpirationDate(token?: string | null): Date | null {
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    }

    // Fallback: check stored 'expiresAt' in token object
    try {
      const stored = localStorage.getItem('token');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.expiresAt) {
          return new Date(parsed.expiresAt);
        }
      }
    } catch (e) {
      // ignore
    }

    return null;
  }

  /**
   * Check whether JWT token has expired (after 15 days)
   */
  public isTokenExpired(token?: string | null): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) {
      const rawStored = localStorage.getItem('token');
      return !rawStored;
    }

    // Token is expired if current time is greater than expiration date
    return new Date().valueOf() > expirationDate.valueOf();
  }

  /**
   * Returns remaining milliseconds before token expires
   */
  public getRemainingTimeMs(): number {
    const expirationDate = this.getTokenExpirationDate();
    if (!expirationDate) return 0;
    return expirationDate.getTime() - Date.now();
  }

  /**
   * Main authentication check for guards and components
   */
  public isAuthenticated(): boolean {
    const rawStored = localStorage.getItem('token');
    if (!rawStored) {
      return false;
    }

    if (this.isTokenExpired()) {
      console.warn('[AuthService] Session has expired after 15 days.');
      this.logout('Your session has expired after 15 days. Please log in again.');
      return false;
    }

    return true;
  }

  /**
   * Initialize or resume auto-logout timer on app startup
   */
  public initAutoLogoutTimer(): void {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }

    const rawStored = localStorage.getItem('token');
    if (!rawStored) return;

    const remainingMs = this.getRemainingTimeMs();
    if (remainingMs <= 0) {
      if (this.isTokenExpired()) {
        this.logout('Your session has expired after 15 days. Please log in again.');
      }
      return;
    }

    const remainingDays = (remainingMs / (1000 * 60 * 60 * 24)).toFixed(1);
    console.log(`[JWT Auth] 15-day session active. Remaining time: ~${remainingDays} days`);

    // Set auto-logout timer (capped at max 32-bit signed int 2,147,483,647 ms ~24.8 days)
    const timeoutDuration = Math.min(remainingMs, 2147483647);
    this.autoLogoutTimer = setTimeout(() => {
      if (this.getRemainingTimeMs() <= 0) {
        this.logout('Your session has expired after 15 days. Please log in again.');
      } else {
        // If capped, schedule remaining time
        this.initAutoLogoutTimer();
      }
    }, timeoutDuration);
  }

  /**
   * Save session upon successful login
   * @param data The user and privileges object returned from /api/authenticate
   * @param token Optional explicit JWT token string
   */
  public saveSession(data: any, token?: string): void {
    const jwtToken = token || data.token || data.jwt_token;

    // 15 days in milliseconds = 15 * 24 * 60 * 60 * 1000 = 1,296,000,000 ms
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
    const expiresAt = data.expiresAt || (Date.now() + fifteenDaysMs);

    const sessionData = {
      ...data,
      token: jwtToken,
      jwt_token: jwtToken,
      expiresAt: expiresAt,
      loginTime: Date.now()
    };

    localStorage.setItem('token', JSON.stringify(sessionData));
    if (jwtToken) {
      localStorage.setItem('jwt_token', jwtToken);
    }

    // Start 15-day auto logout timer
    this.initAutoLogoutTimer();
  }

  /**
   * Log out user, clean storage, show notice, and redirect to login
   */
  public logout(reason?: string): void {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('jwt_token');

    if (reason) {
      this.toastr.warning(reason, 'Session Expired', {
        timeOut: 6000,
        progressBar: true
      });
    }

    this.router.navigate(['/login']);
  }

  /**
   * Get currently logged-in user object from session
   */
  public getUser(): any {
    try {
      const stored = localStorage.getItem('token');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.usr || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Update fields on the stored user object (e.g. after profile update)
   */
  public updateUserSession(updatedFields: any): void {
    try {
      const stored = localStorage.getItem('token');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed && parsed.usr) {
        parsed.usr = { ...parsed.usr, ...updatedFields };
        localStorage.setItem('token', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error('Failed to update user session', e);
    }
  }
}