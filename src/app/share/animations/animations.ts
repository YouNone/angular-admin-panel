import { trigger, transition, state, style, animate, sequence, query, stagger, animateChild, group } from '@angular/animations';

/** Вращение на 180 градусов и обратная анимация */
export const rotate180ccw = trigger('rotate180ccw', [
	state('rotate0', style({ transform: 'rotate(0deg)' })),
	state('rotate180', style({ transform: 'rotate(-180deg)' })),
	transition('rotate0 <=> rotate180', animate(300))
]);

export const rotate180cw = trigger('rotate180cw', [
	state('rotate0', style({ transform: 'rotate(0deg)' })),
	state('rotate180', style({ transform: 'rotate(180deg)' })),
	transition('rotate0 <=> rotate180', animate(300))
]);

export const rotate45cw = trigger('rotate45cw', [
	state('rotate0', style({ transform: 'rotate(0deg)' })),
	state('rotate45', style({ transform: 'rotate(45deg)' })),
	transition('rotate0 <=> rotate45', animate(300))
]);


/** Вращение на 90 градусов по часовой стрелке и обратная анимация */
export const rotate90cw = trigger('rotate90cw', [
	state('rotate90', style({ transform: 'rotate(90deg)' })),
	state('rotate0', style({ transform: 'rotate(0deg)' })),
	transition('rotate90 <=> rotate0', animate(300))
]);

// /** Проявление содержимого компонента от 0 до 100% и обратная анимация при его удалении */
// export const fade = trigger('fade', [
// 	transition(':enter', [
// 		style({ opacity: 0 }),
// 		animate(100, style({ opacity: 1 }))
// 	]),
// 	transition(':leave', [
// 		animate(100, style({ opacity: 0 }))
// 	])
// ]);


// /** 
//  * Список компонентов. При добавлении элемента список раздвигается и элемент вставляется от
//  * прозрачного состояния увеличиваясь в размерах. При удалении -- уменьшаем элемент и схлопываем ряд
//  */
// export const listItem = trigger('listItem', [
// 	state('start', style({ transform: 'scale(1)', opacity: 1, height: '*' })),
// 	transition(':enter', [
// 		style({ opacity: 0, height: '0px', transform: 'scale(0.5)' }),
// 		sequence([
// 			animate(200, style({ height: "*" })),
// 			animate(100, style({ opacity: 1, transform: 'scale(1)' }))
// 		])
// 	]),
// 	transition(':leave', [
// 		style({ opacity: 1, height: '*' }),
// 		sequence([
// 			animate(200, style({ opacity: 0, height: '0px', minHeight: '0' })),
// 			animate(300, style({ height: '0px', minHeight: '0' }))
// 		])
// 	])
// ]);


// /** Анимация компонента, в котором расположен список */
// export const listContainer = trigger('listContainer', [
// 	transition(':enter', [
// 		query('@listItem', stagger(300, animateChild()))
// 	]),
// ]);

/** Выползание компонента из-за правого края */
export const slideFromRight = trigger('slideFromRight', [
	state('in', style({ transform: 'translate(0, 0)', visibility: 'visible' })),
	state('out', style({ transform: 'translate(100%, 0)', visibility: 'hidden' })),
	// transition(':enter', [
	// 	style({ transform: 'translate(100%, 0)', visibility: 'hidden' }),
	// 	animate(300, style({ transform: 'translate(0, 0)', visibility: 'visible' }))
	// ]),
	// transition(':leave', [
	// 	animate(300, style({ transform: 'translate(100%, 0)', visibility: 'hidden' }))
	// ]),
	transition('out <=> in', animate(300))
]);
