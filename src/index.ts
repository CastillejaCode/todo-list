import './style.scss';
import format from 'date-fns/format';

const buttonNew = document.querySelector('.add-new');
const buttonSumbit = document.querySelector('.submit-todo');
const buttonExit = document.querySelector('.exit-modal');
const taskContainer = document.querySelector('.task-container');
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal-overlay');
const title = document.querySelector('.title') as HTMLInputElement;
const description = document.querySelector('.description') as HTMLInputElement;
const date = document.querySelector('.date') as HTMLInputElement;
const priority = document.querySelector('.priority') as HTMLSelectElement;
const taskCard = document.querySelectorAll('.task-card');
const buttonEdit = document.querySelectorAll('.edit');
const buttonNewList = document.querySelector('.new-list');

const mainList = (function () {
	const list: any[] = [];

	const addList = (name: string) => {
		list.push(lists(name));
	};

	return {
		list,
		addList,
	};
})();

const lists = function (nameList: string) {
	interface Todo {
		title: string;
		description: string;
		date: Date;
		priority: string;
	}

	const list: object[] = [];

	let name = nameList;

	const addTodo = (e: Todo) => list.push(e);

	const removeTodo = (index: number) => list.splice(index, 1);

	return {
		list,
		name,
		addTodo,
		removeTodo,
	};
};

const domHandler = (function () {
	task;
})();

mainList.list.at(0)?.addTodo({
	title: 'Pet Cat',
	description: 'Pet the cat a lot',
	date: new Date(),
	priority: 'urgent',
});

console.log(mainList.list[0]);

interface TodoStructure {
	title: string;
	description: string;
	date: Date;
	priority: 'Urgent' | 'Soon' | 'Later';
	list: object[];
	// name: string;
}

// class Todo extends List {
// 	constructor() {
// 		super();
// 	}
// }

// function projects(name: string) {
// 	const getName = () => name;

// 	let list: any[] = [];
// 	const getList = () => list;

// 	function addToList(object: object) {
// 		list.push(object);
// 	}

// 	function addTodoToList(
// 		title: string,
// 		description: string,
// 		date: Date | null,
// 		priority: string
// 	) {
// 		addToList({
// 			title,
// 			description,
// 			date,
// 			priority,
// 		});
// 	}

// 	function removeTodoFromList(todo: string) {
// 		let index = list.findIndex((e: Todo) => e.title === todo);

// 		list.splice(index, 1);
// 	}

// 	return {
// 		getName,
// 		getList,
// 		addTodoToList,
// 		removeTodoFromList,
// 	};
// }

// const domHandler = (() => {
// 	function clearList() {
// 		taskContainer?.replaceChildren();
// 	}

// 	function updateList(project: object[]) {
// 		project.getList().forEach((e: Todo) =>
// 			taskContainer?.insertAdjacentHTML(
// 				'beforeend',
// 				`
// 				<div class="task-card">
// 				<div class="info-container">
// 					<input type="checkbox" />
// 					<h2>${e.title}</h2>
// 					<h3>${format(e.date, 'MMM do')}</h3>
// 				</div>
// 				<div class="expanded-container">
// 					<p>
// 						${e.description}
// 					</p>
// 					<h2>${e.priority}</h2>
// 				</div>
// 			</div>
// 	`
// 			)
// 		);
// 	}

// 	const clearUpdateList = () => {
// 		clearList();
// 		updateList();
// 	};

// 	return {
// 		clearUpdateList,
// 	};
// })();

// // Clicking on add brings up modal form
// buttonNew?.addEventListener('click', () => {
// 	modal?.classList.toggle('closed');
// 	modalOverlay?.classList.toggle('closed');
// 	// domHandler.updateList();
// });

// // Exit button on modal form
// buttonExit?.addEventListener('click', () => {
// 	console.log(1234);
// 	modal?.classList.toggle('closed');
// 	modalOverlay?.classList.toggle('closed');
// });

// const defaultList = projects('default');
// defaultList.addTodoToList(
// 	'Eat Paint',
// 	'Look at the paint',
// 	new Date(),
// 	'urgent'
// );
// domHandler.clearUpdateList();

// buttonSumbit?.addEventListener('click', () => {
// 	// Add to project list
// 	defaultList.addTodoToList(
// 		title.value,
// 		description.value,
// 		date.valueAsDate,
// 		priority.value
// 	);
// 	domHandler.clearUpdateList();
// 	modal?.classList.toggle('closed');
// 	modalOverlay?.classList.toggle('closed');
// });

// taskContainer?.addEventListener('click', (e: any) => {
// 	// console.log(e.target.closest('.task-card'));
// 	// console.log(e.target.classList.value.includes('info-container'));
// 	if (
// 		e.target.closest('.task-card') &&
// 		e.target.classList.value !== 'edit' &&
// 		e.target.classList.value !== 'checkbox'
// 	) {
// 		console.log(123);
// 		e.target.closest('.task-card').classList.toggle('expand');
// 	}
// });

// //  Edit Button
// taskContainer?.addEventListener('click', (e: any) => {
// 	if (e.target.classList.value === 'edit') {
// 		e.target.closest('.task-card').classList.toggle('edit-expand');
// 		e.target.closest('.task-card').classList.add('expand');
// 		document
// 			.querySelector('.task-title')
// 			?.setAttribute('contenteditable', 'true');
// 	}
// });

// taskCard.forEach((e) =>
// 	e.addEventListener('click', () => {
// 		console.log(124);
// 		e.classList.toggle('expand');
// 	})
// );

// import createObjects from './modules/objects';

// let masterList: object[] = [];

// class todo {
// 	title: string;
// 	constructor(
// 		title: string,
// 		description: string,
// 		date: Date,
// 		priority: 'urgent' | 'later'
// 	) {
// 		this.title = title;
// 	}
// }

// function projects(name: string) {
// 	const getName = name;

// 	const list: object[] = [];
// 	const getList = () => list;

// 	const addToList = function (object: object) {
// 		list.push(object);
// 	};

// 	const removeFromList = function (objectTitle: string) {
// 		list.splice(
// 			list.findIndex((element: object) => (element.title = objectTitle))
// 		);
// 	};

// 	return {
// 		getName,
// 		getList,
// 		addToList,
// 	};
// }

// let defaultList = projects('default');

// console.log(defaultList.getList());
