import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {
    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.userService.isLoggedIn) {
            const userRole = this.userService.currentUser?.role;
            const expectedRole = this.router.url.split('/')[1]; // "admin", "manager", "user"
            if (userRole === expectedRole || expectedRole === 'login' || expectedRole === 'signup') {
                return true;
            }
        }
        
        this.router.navigate(['/login']);
        return false;
    }
}
