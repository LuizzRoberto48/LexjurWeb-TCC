import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment-prod';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {
    }

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${environment.apiURL}/forgot`, email);
    }

    signIn(credentials: { email: string; password: string }): Observable<any> {

        if (this._authenticated)
            return throwError(() => 'User is already logged in.');

        return this._httpClient.post(`${environment.apiURL}/auth/login`, credentials).pipe(
            switchMap((response: any) => {
                console.log(response)
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

   
    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        return of(true);
    }

    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    check(): Observable<boolean> {
        const accessToken = <string>localStorage.getItem('accessToken');
        
        // Check if the user is logged in
        if (this._authenticated || accessToken) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken || !accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return of(true);
    }
}
