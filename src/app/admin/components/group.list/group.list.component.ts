import { Component, OnInit } from '@angular/core';
import { GroupEditComponent } from '../group.edit/group.edit.component';
import { ListComponentsClass } from 'src/app/share/classes/ListComponents';
import { SettingService } from 'src/app/share/services/settings.service';
import { BehaviorSubject } from 'rxjs';
import { ESort, IGroup, compRoutes } from 'src/app/share/models/type';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { DialogService } from 'src/app/share/services/dialog.service';
import { MsgList } from 'src/app/share/services/msg.list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group.list',
  templateUrl: './group.list.component.html',
  styleUrls: ['./group.list.component.css']
})
export class GroupListComponent extends ListComponentsClass<IGroup> {
	state = {
		orderField: "name",
		f: "",
		order: ESort.asc,
		f2: "",
		rubFilterTree: new BehaviorSubject<string[]>([]),
		field2: "rub_id",
	}
	filterStream$ = this.state.rubFilterTree.asObservable();

	constructor(
		public $SETTINGS: SettingService,
		public $MSG: MsgList,
		public router: Router,
		public listService: UniversalDataService,
		public dialogService: DialogService
	) { 
		super($SETTINGS, router, $MSG, listService, dialogService);		
		this.displayedColumns = ['code', 'name', 'count', 'action'];
		this.editUrl = compRoutes.groupEdit;
		this.dataUrl = compRoutes.group;
		this.listService.setServiceUrl(this.dataUrl);
	}

	onChildDeactivate(compRef: GroupEditComponent) {
		if (compRef instanceof GroupEditComponent) {
			this.getChangedItemToList(compRef);
		}
	}

	// /** Фильтр в дереве предприятий */
	// setTreeFilter(e: ITreeSelectEvent) {
	// 	if (e.nodes.length > 0) {
	// 		const activeNode: IUniversalTreeNode = e.activeNode;

	// 		this.state.rubFilterTree.next(e.nodes.map(item => item.name));
	// 		this.state.f2 = activeNode.id;
	// 		this.itemReload();
	// 	} else {
	// 		this.state.f2 = undefined;
	// 		this.state.rubFilterTree.next([]);
	// 	}
	// }

	/** Убрать фильтр */
	removeFilter() {
		this.state.rubFilterTree.next([]);
		this.state.f2 = "";
		this.itemReload();
	}
}
