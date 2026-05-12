import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViews } from './report-views';

describe('ReportViews', () => {
  let component: ReportViews;
  let fixture: ComponentFixture<ReportViews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportViews],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportViews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
