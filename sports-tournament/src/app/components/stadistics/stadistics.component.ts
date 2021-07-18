import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ReportInterface } from '../../interfaces/report';
import { ChartType } from 'chart.js'
import { MultiDataSet, Label } from 'ng2-charts'
import { RestLeagueService } from '../../services/restLeague/rest-league.service';
import { RestReportService } from '../../services/restReport/rest-report.service';

@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.css']
})
export class StadisticsComponent implements OnInit {

  public league:any;
  public reports = [] as any;
  /*public reportTeams: Array<ReportInterface>;*/
  public reportTeams = [] as any;
  public reportTeam = [] as any;
  public nameTeam = [] as any;
  public goles = [] as any;
  public selectedReport:string;
  public goals = [] as any;
  public doughnutChartLabels: Label[] = ['Goals', 'GoalsAgainst', 'Score'];
  public doughnutChartData: MultiDataSet = [];
  public doughnutChartType: ChartType = 'doughnut';
  public hidden:any;

  constructor(private restLeague:RestLeagueService, private restReport:RestReportService) {
    this.selectedReport = "";
    this.reportTeams = [];
  }

  ngOnInit(): void {
    this.hidden = true;
    this.league = JSON.parse(localStorage.getItem('league')!);
    this.restLeague.getLeague(this.league._id).subscribe((res:any) => {
      localStorage.setItem('league', JSON.stringify(res.league))
      this.reports = res.league.reports;
      this.reports.forEach((elemento:any) => {
        this.restReport.getReport(elemento._id).subscribe((res:any) => {
          this.reportTeams.push(res.report);
          this.nameTeam.push(res.report.team.name);

        })
      })
    })
    this.goles = JSON.parse(localStorage.getItem('goles')!)
    console.log(this.goles);
    this.doughnutChartData.push(this.goles)
    console.log(this.doughnutChartData);
    console.log(this.reportTeams)
    this.league =  JSON.parse(localStorage.getItem('league')!)
  }

  createGraphic(graphic: any){
    let idReport = graphic.value.reportTeam;
    console.log(idReport)
    this.restReport.getReport(idReport).subscribe((res:any) => {
      this.goals.push(JSON.stringify([res.report.goals, res.report.goalsAgainst, res.report.score]));
      console.log(this.goals)
      localStorage.setItem('goles', this.goals)
      window.location.reload();
    })

  }

}
