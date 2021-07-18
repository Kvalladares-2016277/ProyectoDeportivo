import { Component, OnInit, DoCheck } from '@angular/core';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CONNECTION } from '../../services/global';
import { UpdateUserPasswordInterface } from '../../interfaces/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  myAccount: any;
  userId: string = '';
  updateUserPassword: UpdateUserPasswordInterface = {};
  public filesToUpload: Array<File> = [];
  uri: string;

  constructor(private resUser: RestUserService, private router: Router) {
    this.myAccount = {}
    this.uri = CONNECTION.URI
    this.updateUserPassword = {
      _id: "",
      current: "",
      new: "",
      confirmNew: ""
    };
  }

  ngOnInit() {
    this.resUser.getUserLS().then(user => {
      this.myAccount = user
      this.userId = this.myAccount._id;
    });
  }

  updateMyAccount(myAccountForm: NgForm){
    delete this.myAccount._id;
    delete this.myAccount.__v;
    delete this.myAccount.password;

    this.resUser.updateUser(this.myAccount, this.userId).subscribe((resp:any) => {
      if(resp.user){
        resp.user.password = null;
        delete resp.user.__v;

        this.myAccount = resp.user;
        localStorage.setItem('user', JSON.stringify(this.myAccount));

        Swal.fire({
          icon: 'success',
          title: 'Actualizado!',
          text: 'Datos actualizados correctamente'
        });
      }else {
        Swal.fire({
          icon: 'warning',
          title: 'Upps!',
          text: 'Datos no se actualizaron correctamente'
        });
      }
    })
  }

  deleteAccountUser(){
    let userId = this.myAccount._id || null;

    this.resUser.deleteUser(userId).subscribe((resp:any) => {
      if(resp.user){
        Swal.fire({
          icon: 'success',
          title: 'Cuenta Eliminada!',
          text: 'Fue un gusto que usaras esta aplicación :)'
        }).then(() => {
          localStorage.clear();
          this.router.navigateByUrl('login');
        })
      }else {
        Swal.fire({
          icon: 'error',
          title: 'Ups!',
          text: 'Algo salió mal :('
        });
      }
    },
    err => {
      Swal.fire({
        icon: 'error',
        title: 'Ups!',
        text: err.error.message
      });
    })
  }

  updatePassword(updatePasswordForm: NgForm){
    if(this.updateUserPassword.new === this.updateUserPassword.confirmNew){
      this.resUser.updateUserPassword(this.updateUserPassword, this.myAccount._id).subscribe((resp:any) => {
        if(resp.user && resp.token){
          delete resp.user._v;
          resp.user.password = null;

          this.myAccount = resp.user;
          localStorage.setItem('user', JSON.stringify(this.myAccount));

          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada!',
            text: "Has actualizado tu contraseña correctamente"
          });
        }else {
          Swal.fire({
            icon: 'warning',
            title: 'Upps!',
            text: 'No se actualizó correctamente su contraseña'
          });
        }
      });
    }else {
      Swal.fire({
        icon: 'error',
        title: 'Upps!',
        text: 'Confirma correctamente tu nueva contraseña, por favor'
      });
    }
  }

  uploadUserImage(uploadUserImageForm){
    console.log(this.filesToUpload);
    this.resUser.addImageUser(this.myAccount._id, [], this.filesToUpload, "img")
    .then((resp:any) => {
      console.log(resp);
      if(resp.userImage){
        resp.user.password = null;
        localStorage.setItem('user', JSON.stringify(resp.user))
        this.myAccount.img = resp.userImage;
        Swal.fire({
          icon: 'success',
          title: 'Images subida!',
          text: 'Has actualizado tu imagen de perfil'
        })
        uploadUserImageForm.reset();
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: resp.message
        })
      }
    }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: err.error.message
        })
    })
  }

  fileChange(userImage){
    this.filesToUpload = <Array<File>> userImage.target.files;
  }

}
