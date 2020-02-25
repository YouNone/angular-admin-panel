import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
	selector: 'admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
	/** По умолчанию mat-sidenav открыт */
	private _mobileQueryListener: () => void;
	public sideNavToggle = true;
	mobileQuery: MediaQueryList;

	constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) { 
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	stateToggle(barState: boolean) {
		this.sideNavToggle = barState;
	}
	
}
