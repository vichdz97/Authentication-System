import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.activeModal.close();
    this.router.navigateByUrl('/home');
  }
}
