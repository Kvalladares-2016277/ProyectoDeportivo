import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { League } from 'src/app/models/league';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestLeagueService {

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

  getLeagues(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.get<any>(`${this.uri}league/getLeagues`, {headers: headers}).pipe(map(this.extractData))
  }

  createLeague(league: League){
    let params = JSON.stringify(league);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post<any>(`${this.uri}league/create`, params,{headers: headers}).pipe(map(this.extractData))
  }

  updateLeague(league: League, leagueId: string){
    let params = JSON.stringify(league);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put<any>(`${this.uri}league/updateLeague/${leagueId}`, params,{headers: headers}).pipe(map(this.extractData))
  }

  deleteLeague(leagueId:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.delete<any>(`${this.uri}league/deleteLeague/${leagueId}`,{headers: headers}).pipe(map(this.extractData))
  }

  getLeague(leagueId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.get<any>(`${this.uri}league/oneLeague/${leagueId}`,{headers: headers}).pipe(map(this.extractData))
  }
}
