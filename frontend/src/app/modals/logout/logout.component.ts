import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
  ) { }

  logout() {
    this.activeModal.close();
    this.router.navigateByUrl('/login');
  }
}
