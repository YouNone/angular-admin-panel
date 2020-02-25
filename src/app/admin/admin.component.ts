import { Component, OnInit } from '@angular/core';


@Component({
	selector: 'admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
	/** По умолчанию mat-sidenav открыт */
	public sideNavToggle = true;

	constructor() { 
	
	}

	stateToggle(barState: boolean) {
		this.sideNavToggle = barState;
	}
}
