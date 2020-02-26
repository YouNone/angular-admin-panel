import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';

import { routesRoot } from 'src/app/app.routes';
import { IRoute } from '../../models/type';

@Component({
	selector: 'main-menu',
	templateUrl: './main.menu.component.html',
	styleUrls: ['./main.menu.component.css']
})
export class MainMenuComponent implements OnInit {
	resRoutes = [];

	constructor() { }

	filterMenuRoutes() {
		if (routesRoot[0].children) {
			routesRoot[0].children.forEach((item: Route) => {
				// console.log(item);
				
				if (item.path !== '') {
					if (item.data) {
						let newItem: IRoute = {
							path: item.path,
							name: item.data.breadcrumb
						}
						this.resRoutes.push(newItem);
					}
					// this.resRoutes.push(item);
				}
			});
		}
	}


	ngOnInit() {
		this.filterMenuRoutes();
		console.log(this.resRoutes);
	}
}
