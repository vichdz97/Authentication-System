import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpComponent } from '../../modals/help/help.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openModal() {
    this.modalService.open(HelpComponent, { 
      centered: true, 
      scrollable: true,
      size: 'lg' 
    });
  }

}
