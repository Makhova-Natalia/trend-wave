import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeComponent } from './real-time.component';
import { HttpClientModule } from "@angular/common/http";

describe('RealTimeComponent', () => {
  let component: RealTimeComponent;
  let fixture: ComponentFixture<RealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RealTimeComponent,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
