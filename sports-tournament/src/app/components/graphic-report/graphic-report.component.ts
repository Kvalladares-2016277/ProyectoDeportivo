import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js'
import { MultiDataSet, Label } from 'ng2-charts'

@Component({
  selector: 'app-graphic-report',
  templateUrl: './graphic-report.component.html',
  styleUrls: ['./graphic-report.component.css']
})
export class GraphicReportComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
