import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  returnUrl:string;
  constructor(
    public _servLogin:LoginService,
    private _route: ActivatedRoute,
    private _router: Router) {}

  public logout(){
    this._servLogin.logout();
    this._router.navigateByUrl(this.returnUrl);

    
  }
  ngOnInit(): void {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/home';
  }

}
