import './style.scss';
import format from 'date-fns/format';

const taskBar = document.querySelector('.task-bar') as HTMLElement;
const taskBarList = document.querySelectorAll('.task-bar-list');
const buttonNew = document.querySelector('.add-new');
const buttonSumbit = document.querySelector('.submit-todo');
const buttonExit = document.querySelector('.exit-modal');
const buttonDeleteTodo = document.querySelector('.delete-todo');
const taskContainer = document.querySelector('.task-container');
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal-overlay');
const formTitle = document.querySelector('.form-title') as HTMLInputElement;
const formDescription = document.querySelector(
	'.form-description'
) as HTMLInputElement;
const formDate = document.querySelector('.form-date') as HTMLInputElement;
const formPriority = document.querySelector(
	'.form-priority'
) as HTMLSelectElement;
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

interface Todo {
	title: string;
	description: string;
	date: Date;
	priority: string;
	listIndex: number;
}

const lists = function (nameList: string) {
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
	const clearTaskBar = () => {
		taskBar?.replaceChildren();
	};

	const updateTaskBar = () => {
		clearTaskBar();
		let i = 0;
		mainList.list.forEach((e) => {
			taskBar?.insertAdjacentHTML(
				'beforeend',
				`
				<div class="task-bar-list" data-index = ${i}>${e.name}</div>
				`
			),
				i++;
		});
	};

	const clearTaskCards = () => {
		taskContainer?.replaceChildren();
	};

	const updateTaskCards = (index: number) => {
		clearTaskCards();
		let i = 0;
		mainList.list.at(index).list.forEach((e: Todo) => {
			taskContainer?.insertAdjacentHTML(
				'beforeend',
				`
				<div class="task-card" data-index=${i}>
				<h1>${e.title}</h1>
				<h1>${e.description}</h1>
				<h1>${e.date}</h1>
				<h1>${e.priority}</h1>
				<button class="delete-todo">Delete</button>
				</div>
				`
			);
			i++;
		});
	};

	return {
		taskBarUpdate: updateTaskBar,
		taskCardsUpdate: updateTaskCards,
	};
})();

mainList.addList('default');
mainList.addList('pizza');

let listIndex: number = 0;

// Open Modal
buttonNew?.addEventListener('click', () => {
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

buttonExit?.addEventListener('click', () => {
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

buttonSumbit?.addEventListener('click', () => {
	mainList.list
		.at(listIndex)
		.addTodo({
			title: formTitle.value,
			description: formDescription.value,
			date: formDate.valueAsDate,
			priority: formPriority.value,
		});
	domHandler.taskCardsUpdate(listIndex);
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Select list and current list index
taskBar?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('task-bar-list')) {
		document
			.querySelectorAll('.task-bar-list')
			.forEach((element) => element.classList.remove('selected'));
		e.target.classList.toggle('selected');
	}
});

mainList.list.at(1)?.addTodo({
	title: 'Eat Pizza',
	description: 'Pet the cat a lot',
	date: new Date(),
	priority: 'urgent',
});

mainList.list.at(0)?.addTodo({
	title: 'Pet Cat',
	description: 'Pet the cat a lot',
	date: new Date(),
	priority: 'urgent',
});

// Show all lists and default todos
domHandler.taskBarUpdate();
domHandler.taskCardsUpdate(0);

// Switch b/t lists
taskBar?.addEventListener('click', (e: any) => {
	let listIndex = e.target?.dataset.index;
	domHandler.taskCardsUpdate(listIndex);
});

// Create new list
// TODO create new list based on input name
buttonNewList?.addEventListener('click', () => {
	mainList.addList('pizza');
	domHandler.taskBarUpdate();
});

// interface TodoStructure {
// 	title: string;
// 	description: string;
// 	date: Date;
// 	priority: 'Urgent' | 'Soon' | 'Later';
// 	list: object[];
// 	// name: string;
// }

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
