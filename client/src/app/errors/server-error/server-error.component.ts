import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements  OnInit {
error: any;

  // Can only access Router inside Constr. Too late inside ngOnInit.
  constructor(private router:Router) {
    const navigation = this.router.getCurrentNavigation();

    this.error = navigation?.extras?.state?.['error'];
    
  }

  ngOnInit(): void {
    
  }

}
