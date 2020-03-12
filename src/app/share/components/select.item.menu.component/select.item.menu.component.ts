import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material';
import { TypeOfLeader } from 'src/app/share/classes/TypeOfLeader';

@Component({
	selector: 'select-item-menu',
	templateUrl: './select.item.menu.component.html',
	styleUrls: ['./select.item.menu.component.scss']
})
export class SelectItemMenuComponent implements OnInit {
	isChanged: boolean = false;
	@Output() selectedOutputItem = new EventEmitter<TypeOfLeader>();
	@Input() incomeData: TypeOfLeader[] = [];
	@Input() selectedMenuItemInput: TypeOfLeader = undefined;
	@ViewChild('dynamicMenu', { static: true }) dynamicMenu: MatMenu;
	constructor() { }

	ngOnInit() {
		// console.log("I am ready");
	}

	onSelectMenu(item: TypeOfLeader, indx: number) {
		this.selectedMenuItemInput = item;
		this.selectedOutputItem.emit(this.selectedMenuItemInput);
		this.isChanged = true;
	}
}