import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Report } from 'src/app/models/report';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestReportService {

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

  createReport(report: Report, leagueId: string, teamId: string, soccerGameId: string, journeyId: string){
    let params = JSON.stringify(report);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post<any>(`${this.uri}report/create/${leagueId}/${teamId}/${soccerGameId}/${journeyId}`, params,{headers: headers}).pipe(map(this.extractData))
  }

  getReport(idReport:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    })
    return this.http.get<any>(`${this.uri}report/oneReport/${idReport}`, {headers: headers}).pipe(map(this.extractData));
  }


}
