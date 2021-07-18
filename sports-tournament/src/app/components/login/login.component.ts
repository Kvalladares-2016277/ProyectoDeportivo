import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserInterface } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: User;
  token: string = "";
  userLogged: any;


  constructor(private restUser: RestUserService, private router: Router) {
    this.user = new User("", "", "", "", "ROLE_CLIENT", "", [], []);
  }

  ngOnInit(): void {
  }

  onSubmit(login: NgForm){
    this.restUser.login(this.user).subscribe((res:any) => {
      if(res.token){

        res.user.password = null;
        delete res.user.tournamentsAdmin;
        delete res.user.tournamentsUser;

        this.userLogged = JSON.stringify(res.user);

        localStorage.setItem("token",res.token);
        localStorage.setItem("user", this.userLogged);

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Datos correctos'
        })

        if(res.user.role == 'ROLE_ADMIN'){
          this.router.navigateByUrl('homeAdmin');
        }else{
          this.router.navigateByUrl('home#carouselExampleIndicators');
        }
      }
    },
    (error:any) => 
    Swal.fire({
      icon: 'error',
      title: '¡Ups!',
      text: error.error.message
    })
    )
  }

}
