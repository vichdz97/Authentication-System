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
        return this.checkLoggedIn();
    }

    checkLoggedIn(): boolean {
        if (this.userService.isLoggedIn) {
            return true;
        }
        this.router.navigateByUrl('/login');
        return false;
    }
  
}
