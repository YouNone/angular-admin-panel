import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AngMaterialModule } from './ang.material.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		HttpClientModule,
		ReactiveFormsModule,
		AngMaterialModule,
	],
	exports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		AngMaterialModule,
	],
	declarations: [
	
	],
	entryComponents: [
	
	],
})
export class CommonAppModule{}