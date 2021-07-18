import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONNECTION } from '../global'; 
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { UpdateUserPasswordInterface } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class RestUserService {
  public uri:string;
  public user:any;
  public token:any;
  public role:any;
  public username:any;

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  public httpOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  };

  private extractData(res: Response){
    let body = res;
    return body || [] || {};
  }

  constructor(private http:HttpClient) {
    this.uri = CONNECTION.URI;
  }

  getToken(){
    let token = localStorage.getItem('token')!;
    this.token = token;
    
    return token;
  }

  async getUserLS(){
    let user = await JSON.parse(<any>(localStorage.getItem('user')));
    this.user = (user != null || user != undefined)? user : null;

    return this.user
  }

  register(user:User){
    let params = JSON.stringify(user);

    return this.http.post<any>(`${this.uri}user/create`, params, this.httpOptions).pipe(map(this.extractData), catchError((err) => {
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: err.error.message
      })
      return throwError(err.error.message)
    }));
  }

  login(user: User){
    let params = JSON.stringify(user);
    return this.http.post<any>(`${this.uri}user/login`, params, this.httpOptions).pipe(map(this.extractData), catchError((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Upps!',
        text: err.error.message
      })
      return throwError(err.error.message)
    }))
  }

  getUsers(){
    return this.http.get<any>(`${this.uri}user/getUsers`, this.httpOptions).pipe(map(this.extractData))
  }

  updateUser(user: User, userId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    let params = JSON.stringify(user);
    return this.http.put<any>(`${this.uri}user/updateUser/${userId}`, params,{headers: headers} ).pipe(map(this.extractData))
  }

  updateUserPassword(updatePass: UpdateUserPasswordInterface, userId: string){
    delete updatePass._id;
    delete updatePass.confirmNew;

    let params = JSON.stringify(updatePass);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put<any>(`${this.uri}user/updatePassword/${userId}`, params, {headers}).pipe(map(this.extractData), catchError((err) => {
      Swal.fire({
        icon: 'warning',
        title: 'Upps!',
        text: err.error.message
      });
      return throwError(err.error.message);
    }));
  }

  deleteUser(userId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.delete<any>(`${this.uri}user/deleteUser/${userId}`, {headers: headers} ).pipe(map(this.extractData))
  }

  getUser(userId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.get<any>(`${this.uri}user/oneUser/${userId}`, {headers: headers} ).pipe(map(this.extractData))
  }

  addImageUser(userId: string, params: Array<string>, files: Array<File>, name: string){
    return new Promise((resolve, reject) => {
      let formData: any = new FormData();
      let xhr = new XMLHttpRequest();
      let uri = `${this.uri}user/uploadUserImage/${userId}`;

      for (let i = 0; i < files.length; i++) {
        formData.append(name, files[i], files[i].name);
      }

      console.log(formData);

      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else {
            reject(xhr.response);
          }
        }
      }
      console.log(formData);
      xhr.open("PUT",uri,true); 
      xhr.setRequestHeader('Authorization','Bearer ' + this.getToken());
      xhr.send(formData);
    })
  }

}
