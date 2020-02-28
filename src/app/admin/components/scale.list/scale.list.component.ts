import { Component, OnInit } from '@angular/core';
import { ListComponentsClass } from 'src/app/share/classes/ListComponents';
import { IScale, compRoutes } from 'src/app/share/models/type';
import { SettingService } from 'src/app/share/services/settings.service';
import { Router } from '@angular/router';
import { MsgList } from 'src/app/share/services/msg.list';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { DialogService } from 'src/app/share/services/dialog.service';
import { ScaleEditComponent } from '../scale.edit/scale.edit.component';

@Component({
  selector: 'scale.list',
  templateUrl: './scale.list.component.html',
  styleUrls: ['./scale.list.component.css']
})
export class ScaleListComponent extends ListComponentsClass<IScale> {

	constructor(
		public $SETTINGS: SettingService,
		public router: Router,
		public $MSG: MsgList,
		public listService: UniversalDataService,
		public dialogService: DialogService
	) {
		super($SETTINGS, router, $MSG, listService, dialogService);
		this.displayedColumns = ['code', 'name', 'type', 'action'];
		this.editUrl = compRoutes.scaleEdit;
		this.dataUrl = compRoutes.scale;
		this.listService.setServiceUrl(this.dataUrl);
	}

	onChildDeactivate(compRef: ScaleEditComponent) {
		if (compRef instanceof ScaleEditComponent) {
			this.getChangedItemToList(compRef);
		}
	}
}

