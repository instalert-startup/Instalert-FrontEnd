import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMapView } from './risk-map-view';

describe('RiskMapView', () => {
  let component: RiskMapView;
  let fixture: ComponentFixture<RiskMapView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskMapView],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskMapView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
