import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Journey } from 'src/app/models/journey';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestJourneyService {

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

  createJourney(journey: Journey, leagueId: String){
    let params = JSON.stringify(journey);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post<any>(`${this.uri}journey/${leagueId}/create`, params,{headers: headers}).pipe(map(this.extractData))
  }

}
