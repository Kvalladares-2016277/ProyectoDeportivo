import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SoccerGame } from 'src/app/models/soccergame';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestSoccerGameService {

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

  createSoccerGame(soccergame: SoccerGame, teamOneId: string, teamTwoId: string,  journeyId: string){
    let params = JSON.stringify(soccergame);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post<any>(`${this.uri}soccergame/create/${teamOneId}/${teamTwoId}/${journeyId}`, params,{headers: headers}).pipe(map(this.extractData))
  }


}
