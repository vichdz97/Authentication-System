import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent {

    @Input() user: any;
    isCollapsed: boolean = true;

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    logout() {
        this.userService.currentUser = <User>{};
        this.router.navigateByUrl('/login');
    }

}
