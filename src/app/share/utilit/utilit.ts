import { IRouteTreeNode } from './../models/type';
import { IUniversalTreeNode } from 'src/app/share/models/type';
import { InjectionToken } from '@angular/core';
import { Routes, Route } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { MsgList } from '../services/msg.list';

export const ROUTES_TREE = new InjectionToken<Routes>('ROUTES_TREE');

export function getErrMsg(control: AbstractControl, msgList: MsgList): string {
	const errors = control.errors;
	let errorMsg = '';
	for (const key in errors) {
		if (errors.hasOwnProperty(key)) {
			switch (key) {
				case 'required':
					errorMsg = msgList.getMsg("eEmptyField"); break;
				case 'whitespace':
					errorMsg = msgList.getMsg("eCanNotBeWhiteSpace"); break;
				case 'minlength':
					errorMsg = msgList.getMsg("eFieldToShort"); break;
				case 'spaceinput':
					errorMsg = msgList.getMsgFormat("eCanNotBeWhiteSpace", errors[key]['requiredLength'], errors[key]['actualLength']); break;
				default:
					errorMsg = msgList.getMsg("eFieldFill"); break;
			}
			return errorMsg;
		}
	}
	return '';
}

export class Util {

	// /**
	//  * Возвращает результирующий маршрут для каждого пунскта меню приложения. Т.е. если пункт лежит в дочернем роуте, 
	//  * то результатом будет роут родителя + роут текущего елемента дерева меню.
	//  *
	//  * @export
	//  * @param {IRouteTreeNode[]} tree Дерево роутов, включающие название пункта меню и его маршрут.
	//  * @param {string} [startPath=''] Родительский маршрут для теекущего пункта меню. Для корня меню = ""
	//  */
	// static summRoutesPath(tree: IRouteTreeNode[], startPath = '') {
	// 	tree.forEach((item: IRouteTreeNode) => {
	// 		item.path = startPath ? startPath + '/' + item.path : item.path;
	// 		if (item.children && item.children.length > 0) Util.summRoutesPath(item.children, item.path);
	// 	});
	// }

	// /**
	//  * Рукурсивная функция. Расковыривает дерево роутов приложения и на его основе фомирует дерево меню. 
	//  *
	//  * @export
	//  * @param {Routes} src Текущий роутер приложения.
	//  * @param {number} [level=0] Уровень вложенности меню. Для корня дерева роутов = 0. 
	//  * @returns {IRouteTreeNode[]}
	//  */
	// static readModuleRoutes(src: Routes, level: number = 0): IRouteTreeNode[] {
	// 	let res: IRouteTreeNode[] = [];

	// 	src.forEach((item: Route) => {
	// 		if (item.redirectTo) return;
	// 		if (item.path !== undefined) {
	// 			// Если это ветка подмодуля: path = '' и children > 0 и data не определен
	// 			if (item.path.length == 0 && item.children && item.children.length > 0 && !item.data) {
	// 				let subTree = JSON.parse(JSON.stringify(Util.readModuleRoutes(item.children, level)));
	// 				res = [...res, ...subTree];
	// 				// Нормальная ветка, которую надо добавить в объект data определен
	// 			} else if (item.data) {
	// 				const newItem: IRouteTreeNode = {
	// 					path: item.path,
	// 					icon: item.data.icon ? item.data.icon : '',
	// 					name: item.data.breadcrumb,
	// 					level: level
	// 				}
	// 				res.push(newItem);
	// 				if (item.children && item.children.length > 0) {
	// 					newItem.children = JSON.parse(JSON.stringify(Util.readModuleRoutes(item.children, level + 1)));
	// 				} else if (item.data.childRoute) {
	// 					newItem.children = JSON.parse(JSON.stringify(item.data.childRoute));
	// 				}
	// 			}
	// 		}
	// 		return;
	// 	});
	// 	return res;
	// }

	// /**
	//  * Функция поиска списка родителей для элемента дерева. Выводит все ноды дерева, начиная от ноды с указанным ID.
	//  * Предполагается, что все ноды дерева реализуют интерфейс IUniversalTreeNode, который содержит: id, name, children[].
	//  * 
	//  *
	//  * @static
	//  * @param {number} id ID ноды, которая является конечной нодой, выбранной в дереве
	//  * @param {IUniversalTreeNode[]} tree Массив нод дерева. Если дерево имеет одну корневую ноду, ее необходимо 
	//  * обернуть в массив.
	//  * @returns {IUniversalTreeNode[]}
	//  * @memberof Util
	//  */
	// static searchParents(id: string, tree: IUniversalTreeNode[]): IUniversalTreeNode[] {
	// 	for (let count = 0; count < tree.length; count++) {
	// 		if (tree[count].id === id) {
	// 			return [tree[count]];
	// 		} else if (tree[count].children && tree[count].children.length) {
	// 			const res = Util.searchParents(id, tree[count].children);
	// 			if (res.length > 0) return [tree[count], ...res];
	// 		}
	// 	}
	// 	return [];
	// }


	// /**
	//  * Функция принимает на вход стандартное дерево (с объектами IUniversalTreeNode) и возвращает новое дерево, 
	//  * не содержащее оъектов с указанным ID.
	//  *
	//  * @static
	//  * @param {string} deleteNodeId ID удаляемой ноды
	//  * @param {IUniversalTreeNode[]} tree Дерево элементов
	//  * @param {boolean} [genTree=true] Служебный параметр, служащий для индакации первого входа в функцию, при котором генерируется клон дерева
	//  * @returns {IUniversalTreeNode[]} Новый объект дерева, не содержащий элементов с указанным ID
	//  * @memberof Util
	//  */
	// static deleteTreeChildren(deleteNodeId: string, tree: IUniversalTreeNode[]): IUniversalTreeNode[] {
	// 	// Фильтруем
	// 	let newTree = tree.filter((item: IUniversalTreeNode) => {
	// 		if (item.id != deleteNodeId) {
	// 			if (item.children && item.children.length > 0) {
	// 				item.children = Util.deleteTreeChildren(deleteNodeId, item.children);
	// 			}
	// 			return true;
	// 		}
	// 		return false;
	// 	});
	// 	return newTree;
	// }


	/**
	 * Поиск элемента дерева по его ID. На вход получает ID искомого элемента и содержащее его дерево.
	 * В случае, если элемент не найден, возвращает null.
	 *
	 * @static
	 * @param {string} id ID искомого элемента
	 * @param {IUniversalTreeNode[]} tree Дерево, в котором производится поиск элемента
	 * @returns {IUniversalTreeNode}
	 * @memberof Util
	 */
	static getTreeItemById(id: string, tree: IUniversalTreeNode[]): IUniversalTreeNode {
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



	// /**
	//  * Обновляет/ вставляет узел дерева. Поиск узла производится по его id. Если parent_id не задан, или равен 
	//  * null, узел вставляется в корень дерева в начало. Если parent_id задан, вставляем в его children в начало.
	//  * Если children не задан, создаем его и вставляем туда incomeItem. 
	//  * 
	//  * Функция при изменении ветки children производит копирование обновленной версии в children для изменения 
	//  * состояния объекта tree для того, чтобы детектор Angular смог выловить изменение состояния данных.
	//  *
	//  * @static
	//  * @param {IUniversalTreeNode} incomeItem Входящий элемент, который необходимо обновить/вставить в дерево
	//  * @param {IUniversalTreeNode[]} tree Дерево, в котором необходимо выполнить обновление
	//  * @param {boolean} sort Производить или нет сортировку в массиве, в котором произведено изменение путем правки или вставки узла дерева
	//  * @param {boolean} field Поле, по которому производится сортировка объектов массива
	//  * @returns {boolean}
	//  * @memberof Util
	//  */
	// static updateTreeItem(incomeItem: IUniversalTreeNode, tree: IUniversalTreeNode[], sort: boolean = false, field: string = 'name'): boolean {
	// 	if (!incomeItem) return false;
	// 	if (incomeItem.parent_id) {
	// 		for (let count = 0; count < tree.length; count++) {
	// 			if (tree[count].id == incomeItem.parent_id) {
	// 				if (!tree[count].children) tree[count].children = [];
	// 				const index = tree[count].children.findIndex((item: IUniversalTreeNode) => item.id == incomeItem.id);
	// 				if (index == -1) {
	// 					tree[count].children.unshift(incomeItem);
	// 				} else {
	// 					tree[count].children[index] = incomeItem;
	// 				}
	// 				if (sort) {
	// 					tree[count].children.sort((a: IUniversalTreeNode, b: IUniversalTreeNode) => {
	// 						return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
	// 					});
	// 				}

	// 				return true;
	// 			} else if (tree[count].children && tree[count].children.length > 0) {
	// 				const res = Util.updateTreeItem(incomeItem, tree[count].children);
	// 				if (res) return true;
	// 			}
	// 		}
	// 	} else {
	// 		const index = tree.findIndex((item: IUniversalTreeNode) => item.id == incomeItem.id);
	// 		if (index == -1) {
	// 			tree.unshift(incomeItem);
	// 		} else {
	// 			tree[index].name = incomeItem.name;
	// 		}
	// 		if (sort) {
	// 			tree.sort((a: IUniversalTreeNode, b: IUniversalTreeNode) => {
	// 				return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
	// 			});
	// 		}
	// 	}
	// 	return true;
	// }


	/**
	 * Функция преобразования плоского массива в дерево. На вход получает массив элементов дерева 
	 * с обязательными полями id, name, parent_id, отсортированными по уровню вложенности, названию.
	 * Предполагается, что если у элемента parent_id не определен или null, то он является корневым
	 * елементом дерева. 
	 *
	 * @static
	 * @param {IUniversalTreeNode[]} list Плоский массив с элементами дерева
	 * @returns {IUniversalTreeNode[]} Дерево, составленное из елементов входящего массива
	 * @memberof Util
	 */
	static listToTree(list: IUniversalTreeNode[]): IUniversalTreeNode[] {
		let map = {},
			roots: IUniversalTreeNode[] = [];

		list.forEach((item, i) => {
			map[item.id] = i;
			item.children = [];
		});

		list.forEach((item, i) => {
			if (item.parent_id) {
				list[map[item.parent_id]].children.push(item);
			} else {
				roots.push(item);
			}
		});
		return roots;
	}


	/**
	 * Преобразует дерево в плоский список.
	 *
	 * @static
	 * @param {IUniversalTreeNode[]} tree Исходное дерево
	 * @returns {IUniversalTreeNode[]} Массив с элементами дерева
	 * @memberof Util
	 */
	static treeToList(tree: IUniversalTreeNode[]): IUniversalTreeNode[] {
		let res: IUniversalTreeNode[] = [];
		for (let count = 0; count < tree.length; count++) {
			res.push(tree[count]);
			if (tree[count].children && tree[count].children.length > 0) {
				// res = [...res, ...Util.treeToList(tree[count].children)];
				res = res.concat(Util.treeToList(tree[count].children));
			}
		}
		return res;
	}


	static updateTreeItem(incomeItem: IUniversalTreeNode, tree: IUniversalTreeNode[], sort: boolean = false, field: string = 'name'): boolean {
		if (!incomeItem) return false;
		if (incomeItem.parent_id) {
			for (let count = 0; count < tree.length; count++) {
				if (+tree[count].id == incomeItem.parent_id) {
					if (!tree[count].children) tree[count].children = [];
					const index = tree[count].children.findIndex((item: IUniversalTreeNode) => item.id == incomeItem.id);
					if (index == -1) {
						tree[count].children = [incomeItem, ...tree[count].children];
					} else {
						tree[count].children[index] = incomeItem;
					}
					if (sort) {
						tree[count].children.sort((a: IUniversalTreeNode, b: IUniversalTreeNode) => {
							return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
						});
					}
					return true;
				} else if (tree[count].children && tree[count].children.length > 0) {
					const res = Util.updateTreeItem(incomeItem, tree[count].children);
					if (res) return true;
				}
			}
			return false;
		} else {
			const index = tree.findIndex((item: IUniversalTreeNode) => item.id == incomeItem.id);
			if (index == -1) {
				tree.unshift(incomeItem);
			} else {
				tree[index].name = incomeItem.name;
			}
			if (sort) {
				tree.sort((a: IUniversalTreeNode, b: IUniversalTreeNode) => {
					return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
				});
			}
		}
		return true;
	}


	static deleteTreeChildren(deleteNodeId: string, tree: IUniversalTreeNode[]): IUniversalTreeNode[] {
		// Фильтруем
		let newTree = tree.filter((item: IUniversalTreeNode) => {
			if (item.id != deleteNodeId) {
				if (item.children && item.children.length > 0) {
					item.children = Util.deleteTreeChildren(deleteNodeId, item.children);
				}
				return true;
			}
			return false;
		});
		return newTree;
	}

}