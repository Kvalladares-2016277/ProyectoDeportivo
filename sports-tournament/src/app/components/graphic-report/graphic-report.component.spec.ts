import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicReportComponent } from './graphic-report.component';

describe('GraphicReportComponent', () => {
  let component: GraphicReportComponent;
  let fixture: ComponentFixture<GraphicReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphicReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
