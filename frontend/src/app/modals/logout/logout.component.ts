import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css'],
    standalone: false
})
export class LogoutComponent {
    @Output() dataEvent = new EventEmitter<any>();

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    closeModal(): void {
        this.dataEvent.emit();
    }

    logout(): void {
        this.userService.currentUser = undefined;
        this.router.navigate(['/login']);
    }
    
}
