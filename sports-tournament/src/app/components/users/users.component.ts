import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user: User;
  userId: string = "";
  users: Array<User> = [];
  roles: Array<String> = ["ROLE_CLIENT", "ROLE_ADMIN"];
  search: any;

  constructor(private restUser: RestUserService) { 
    this.user = new User("", "", "", "", "ROLE_CLIENT", "", [], []);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngDoCheck(): void{
    this.users = JSON.parse(localStorage.getItem("users")!);
  }

  loadUsers(){
    this.restUser.getUsers().subscribe((resp: any)=>{
      if(resp.users){
        localStorage.setItem("users",JSON.stringify(resp.users)!);
        this.users = JSON.parse(localStorage.getItem("users")!);
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

  onSubmit(saveUserByAdmin: NgForm){
    this.restUser.register(this.user).subscribe((resp:any)=>{
      if(resp.user){
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado exitosamente'
        })
        saveUserByAdmin.reset();
        this.users.push(resp.user);
        localStorage.setItem("users",JSON.stringify(this.users)!);
      }
    },
    (error:any)=>
    Swal.fire({
      icon: 'error',
      title: '¡Ups!',
      text: error.error.message
    })
    )
  }

  updateUserByAdmin(updateUser: NgForm){
    let userToUpdate:any = this.user;
    delete userToUpdate.password;
    delete userToUpdate.__v;
    delete userToUpdate._id;
    this.restUser.updateUser(userToUpdate, this.userId).subscribe((resp:any)=>{
      if(resp.user){
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado exitosamente'
        })
        updateUser.reset();
        this.loadUsers();
        this.user = new User("", "", "", "", "ROLE_CLIENT", "", [], []);
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

  setUserInfo(user:any){
    this.user = user;
    this.userId = user._id;
  }

  deleteUserInfo(){
    this.user = new User("", "", "", "", "ROLE_CLIENT", "", [], []);
    this.userId = "";
  }

  deleteUserByAdmin(user:any){
    this.setUserInfo(user);
    let userToDelete:any = this.user;
    Swal.fire({
      title: "¿Eliminar usuario " + userToDelete.username + " ?" ,
      text: "Esta acción no se puede remover",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.restUser.deleteUser(this.userId).subscribe((resp:any)=>{
            if(resp.user){
              Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado permanente'
              })
              this.users = resp.user;
              this.loadUsers();
              this.user = new User("", "", "", "", "ROLE_CLIENT", "", [], []);
            }
          },
           (error:any)=>{
            Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: error.error.message
            })
          })
        }else {
          this.deleteUserInfo();
        }
    });
  }
}
