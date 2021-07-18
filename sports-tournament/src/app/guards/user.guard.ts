import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RestUserService } from '../services/restUser/rest-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user = JSON.parse(localStorage.getItem("user")!) || null;
      if(user != null && (user.role == "ROLE_CLIENT" || user.role == "ROLE_ADMIN")){
        return true;
      }else{
        let token = this.restUser.getToken();
        if(user && token.length > 0){
          this.router.navigateByUrl("home");
        }else{
          this.router.navigateByUrl("login");
        }
        return false;
      }
  }

  constructor(private restUser: RestUserService, private router: Router){}
  
}
