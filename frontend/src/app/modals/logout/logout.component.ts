import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css'],
    standalone: false
})
export class LogoutComponent {

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    logout() {
        this.userService.currentUser = <User>{};
        this.router.navigateByUrl('/login');
    }
    
}
