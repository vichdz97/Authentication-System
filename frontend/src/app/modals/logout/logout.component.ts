import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(
    private userService: UserService,
    public activeModal: NgbActiveModal,
    private router: Router
  ) { }

  logout() {
    this.userService.currentUser = <User>{};
    this.activeModal.close();
    this.router.navigateByUrl('/login');
  }
}
