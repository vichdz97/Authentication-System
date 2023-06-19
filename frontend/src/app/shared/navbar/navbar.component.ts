import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpComponent } from 'src/app/modals/help/help.component';
import { LogoutComponent } from 'src/app/modals/logout/logout.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    @Input() user: any;
    isCollapsed: boolean = true;

    constructor(private modalService: NgbModal) { }

    openFAQ() {
        this.modalService.open(HelpComponent, {
            centered: true,
            scrollable: true,
            size: 'lg'
        });
    }

    confirmLogout() {
        this.modalService.open(LogoutComponent);
    }

}
