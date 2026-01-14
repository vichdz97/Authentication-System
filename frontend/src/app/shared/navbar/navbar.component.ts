import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent {
    @Input() user: any;
    isCollapsed: boolean = true;
    showSidebar: boolean = false;
    showLogoutModal: boolean = false;

    constructor() { }

    toggleSidebar(): void {
        this.showSidebar = !this.showSidebar;
    }

    toggleLogoutModal(e?: Event): void {
        this.showSidebar = false;
        this.showLogoutModal = !this.showLogoutModal;
    }

    stopPropagation(e: Event): void {
        e.stopPropagation();
    }
}
