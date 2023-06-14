import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from 'src/app/modals/logout/logout.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() user: any;
  isCollapsed: boolean = true;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  confirmLogout() {
    this.modalService.open(LogoutComponent);
  }
}
