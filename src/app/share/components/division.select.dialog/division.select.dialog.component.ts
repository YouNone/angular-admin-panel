import { Util } from './../../utilit/utilit';
import { DialogButtonConfig } from 'src/app/share/utilit/dialog.button.config';
import { BehaviorSubject } from 'rxjs';
import { Inject, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatTreeFlatDataSource, MatTreeFlattener, MatButtonToggleChange } from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';

import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { IUniversalTreeNode, ESort, ITreeFlatNode, EItemListType, ITreeSelectEvent, IDivision, compRoutes } from 'src/app/share/models/type';
import { SettingService } from 'src/app/share/services/settings.service';
import { Division } from 'src/app/share/classes/Division';
import { ListComponentsClass } from 'src/app/share/classes/ListComponents';
import { MsgList } from 'src/app/share/services/msg.list';
import { DialogService } from 'src/app/share/services/dialog.service';
import { rotate45cw } from 'src/app/share/animations/animations';

@Component({
	selector: 'division.select.dialog',
	templateUrl: './division.select.dialog.component.html',
	styleUrls: ['./division.select.dialog.component.scss'],
	animations: [rotate45cw]
})

export class DivisionSelectDialogComponent extends ListComponentsClass<IDivision> {

	/**
	 * Transformer to convert nested node to flat node. Record the nodes in maps for later use
	 * transformer для преобразования вложенного узла в плоский узел
	 * 
	 * @memberof DivisionSelectDialogComponent
	 */
	transformer = (node: IUniversalTreeNode, level: number) => {
		return {
			expandable: !!node.children && node.children.length > 0,
			name: node.name,
			level: level,
			id: node.id
		};
	}

	/**Стиль отбражения данных (дерево/таблица) */
	shownType = EItemListType.list;
	/** Контроллер дерева */
	treeControl = new FlatTreeControl<ITreeFlatNode>(node => node.level, node => node.expandable);
	/** Уплощение дерева для преобразования нормального типа узла информацией о дочерних элементах и уровне. */
	treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
	/** Источник данных для плоского дерева.  */
	dataSourceTree = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
	/** хранит поле сортировки таблицы, фильтры */
	state = {
		orderField: "name",
		order: ESort.asc,
		f: "",
		f2: "",
		divFilterTree: new BehaviorSubject<string[]>([]),
		field2: "division_id",
	};
	/** Дерево предприятий */
	divisionTree: IUniversalTreeNode[] = [];
	/** Фильтр поиска в дереве (не реализован / не используется)*/
	filterStream$ = this.state.divFilterTree.asObservable();

	/** Флаг выбраного подразделения */
	isSelected: boolean = false;

	constructor(
		public router: Router,
		public $MSG: MsgList,
		public dialogService: DialogService,
		public listService: UniversalDataService,
		public $SETTINGS: SettingService,
		public dialogRef: MatDialogRef<DivisionSelectDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogButtonConfig
	) {
		super($SETTINGS, router, $MSG, listService, dialogService);
		this.displayedColumns = ['name'];
		this.dataUrl = compRoutes.div;
		this.listService.setServiceUrl(this.dataUrl);

		this.getTree();
		this.shownType = EItemListType.tree;
	}


	/**
	 *	выбирает элемент в списке, выставляет флагвыбраного подразделения в true
	 *
	 * @param {Division} item
	 * @memberof DivisionSelectDialogComponent
	 */
	selectItem(item: Division) {
		if (item) {
			this.isSelected = true;
			this.data.item = item;
		}
	}

	/**
	 * выставляет флаг выбраного подразделения в false
	 * сбрасывает выбраное подразделение
	 * @memberof DivisionSelectDialogComponent
	 */
	removeChoice() {
		this.isSelected = false;
		this.data.item = null;
	}

	// Дерево

	/**
	 * Выставляет роут дерева, получаем дерево, 
	 * выставляем роут обратно на division
	 * 
	 * @memberof DivisionSelectDialogComponent
	 */
	getTree() {
		this.dataUrl = compRoutes.div;
		this.listService.setServiceUrl(this.dataUrl);
		this.listService.getList().subscribe((incomeTree: IUniversalTreeNode[]) => {
			let tree = this.listToTree(incomeTree);

			this.dataSourceTree.data = tree;
			this.divisionTree = tree;
		});
		this.dataUrl = compRoutes.div;
	}
	// ----- Util
	listToTree(list: IUniversalTreeNode[]): IUniversalTreeNode[] {
		let map = {}, item: IUniversalTreeNode, roots: IUniversalTreeNode[] = [];
		for (let i = 0; i < list.length; i += 1) {
			map[list[i].id] = i; // initialize the map
			list[i].children = []; // initialize the children
		}
		for (let i = 0; i < list.length; i += 1) {
			item = list[i];			
			if (item.parent_id) {				
				list[map[item.parent_id]].children.push(item);
			} else {
				roots.push(item);
			}
		}
		return roots;
	}

	getTreeItemById(tree: IUniversalTreeNode[], id: string): IUniversalTreeNode {
		for (let count = 0; count < tree.length; count++) {
			if (tree[count].id == id) {
				return tree[count];
			} else if (tree[count].children && tree[count].children.length > 0) {
				const res = Util.getTreeItemById(id, tree[count].children);
				if (res !== null) return res;
			}
		}
		return null;
	}

	/**
	 * Переход на страницу редактирования записи в дереве
	 *
	 * @param {*} item
	 * @memberof DivisionSelectDialogComponent
	 */
	editDivisionTree(item: Division) {
		if (item) {
			this.isSelected = true;
			this.dialogRef.componentInstance.data.item = item;
		}
	}

	/**
	 *  Оболочка для определения узла дерева 
	 *
	 * @memberof DivisionSelectDialogComponent
	 */
	hasChild = (_: number, node: ITreeFlatNode) => node.expandable;

}