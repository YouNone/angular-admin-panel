import { NotificationsService } from 'angular2-notifications';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';
import { DialogButtonConfig } from 'src/app/share/utilit/dialog.button.config';
import { rotate45cw } from 'src/app/share/animations/animations';
import { Util } from './../../../share/utilit/utilit';
import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ESort, IDivision, compRoutes, EItemListType, IUniversalTreeNode, ITreeFlatNode, ITreeSelectEvent } from 'src/app/share/models/type';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { SettingService } from 'src/app/share/services/settings.service';
import { MsgList } from 'src/app/share/services/msg.list';
import { DialogService } from 'src/app/share/services/dialog.service';
import { DivisionEditComponent } from '../division.edit/division.edit.component';
import { ListComponentsClass } from 'src/app/share/classes/ListComponents';
import { MatButtonToggleChange, MatSnackBar } from '@angular/material';
import { Division } from 'src/app/share/classes/Division';

export class divisionItemDeleteEvent {
	event: MouseEvent;
	item: IDivision;
}

@Component({
	selector: 'division-list',
	templateUrl: './division.list.component.html',
	styleUrls: ['./division.list.component.scss'],
	animations: [rotate45cw]
})

export class DivisionListComponent extends ListComponentsClass<IDivision> {

	transformer = (node: IUniversalTreeNode, level: number) => {
		return {
			expandable: !!node.children && node.children.length > 0,
			name: node.name,
			level: level,
			id: node.id
		};
	}
	/** Отступ вложенного узла */
	readonly NODE_INDENT = 20;
	/**Стиль отбражения данных (дерево/таблица) дерево*/
	shownType: EItemListType;
	/** Контроллер дерева */
	treeControl = new FlatTreeControl<ITreeFlatNode>(node => node.level, node => node.expandable);
	/** Уплощение дерева для преобразования нормального типа узла информацией о дочерних элементах и уровне. */
	treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
	/** Источник данных для плоского дерева.  */
	dataSourceTree = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

	/** хранит поле сортировки таблицы, фильтры */
	state = {
		orderField: "name",
		f: "",
		order: ESort.asc,
		f2: "",
		divFilterTree: new BehaviorSubject<string[]>([]),
		field2: "division_id",
	};
	/** Дерево предприятий */
	divisionTree: IUniversalTreeNode[] = [];

	constructor(
		public $SETTINGS: SettingService,
		public router: Router,
		public $MSG: MsgList,
		public $NOTE: NotificationsService,
		public listService: UniversalDataService,
		public dialogService: DialogService,
		public snackBar: MatSnackBar
	) {
		super($SETTINGS, router, $MSG, listService, dialogService);
		this.displayedColumns = ['code', 'name', 'action'];
		this.editUrl = compRoutes.divEdit;
		this.dataUrl = compRoutes.division;
		this.listService.setServiceUrl(this.dataUrl);
	}

	/**
	 * Переопределяем ngOnInit родительского класса
	 * Данные приходят в виде списка элементов дерева. Преобразуем его в дерево при помощи 
	 * Util.listToTree
	 *
	 * @memberof DivisionListComponent
	 */
	ngOnInit() {
		this.dataUrl = compRoutes.division;
		this.shownType = EItemListType.tree;

		this.listService.getList().subscribe((data: IUniversalTreeNode[]) => {
			this.divisionTree = Util.listToTree(data);
			this.dataSourceTree.data = this.divisionTree;
		});
	}

	// /** Переход на страницу редактирования записи в дереве  */
	editDivisionTree(e: MouseEvent, item: ITreeFlatNode) {
		e.stopPropagation();
		this.editItem(<IDivision>item);
	}

	/** Оболочка для определения узла дерева */
	hasChild = (_: number, node: ITreeFlatNode) => node.expandable;

	onChildDeactivate(compRef: DivisionEditComponent) {
		if (compRef instanceof DivisionEditComponent) {
			this.getChangedItemToList(compRef);
		}
	}


	// divisionItemDelete(e: divisionItemDeleteEvent) {
	// 	let item = e.item;
	// 	e.event.stopPropagation();
	// 	if (item.children && item.children.length > 0) {
	// 		this.$NOTE.warn(
	// 			this.$MSG.getMsg('warning'),
	// 			this.$MSG.getMsg("wchildListNotEmpty"),
	// 			NotifElemetntConfig.timeOption
	// 		);
	// 		return false;
	// 	}
	// 	this.listService.setServiceUrl(this.dataUrl);
	// 	this.dialogService.openConfirm(
	// 		this.$MSG.getMsg('mConfirmRecordDelete'),
	// 		this.$MSG.getMsg('warning'),
	// 		DialogButtonConfig.YesNo
	// 	).subscribe(res => {
	// 		if (res) {
	// 			this.listService.deleteItem<Division>(item.id).subscribe((deletedItem: Division) => {
	// 				if(deletedItem && deletedItem.id) this.componentData = <Division[]>Util.deleteTreeChildren(item.id, this.componentData);
	// 				this.snackBar.open(
	// 					this.$MSG.getMsg("mRecordDeleted"),
	// 					this.$MSG.getMsg("btnOk"),
	// 					NotifElemetntConfig.snackInfoConfig
	// 				);
	// 			});
	// 		}
	// 	});
	// }

}