import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from "ngx-charts";


@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  exports: [
    CommonModule,
    NgxChartsModule
  ]
})
export class SharedModule { }
