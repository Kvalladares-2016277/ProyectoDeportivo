import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Team } from 'src/app/models/team';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestTeamService {

  public uri:string;
  public user:any;
  public token:any;

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

  createTeam(team: Team, leagueId: string){
    let params = JSON.stringify(team);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post<any>(`${this.uri}team/create/${leagueId}`, params,{headers: headers}).pipe(map(this.extractData))
  }

  addTeamImage(teamId: string, params: Array<string>, image: Array<File>, name:string){
    return new Promise((resolve,reject)=>{
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      let uri = this.uri + "team/uploadTeamImage/" + teamId;

      for(var i = 0; i < image.length; i++){
        formData.append(name, image[i], image[i].name);
      }

      xhr.onreadystatechange = ()=>{
        if(xhr.readyState == 4){ // Es 4 porque tiene 5 estados y el estado 4 es cuando finaliza y la respuesta está lista.
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }
        }
      }

      xhr.open("PUT",uri,true); // El último true es para afirmar que sea asíncrona.
      xhr.setRequestHeader('Authorization','Bearer ' + this.getToken());
      xhr.send(formData);
    })
  }

  updateTeam(team: Team,teamId: string){
    let params = JSON.stringify(team);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put<any>(`${this.uri}team/updateTeam/${teamId}`, params,{headers: headers}).pipe(map(this.extractData))
  }

  deleteTeam(teamId: string, leagueId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.delete<any>(`${this.uri}team/deleteTeam/${teamId}/${leagueId}`,{headers: headers}).pipe(map(this.extractData))
  }
}
