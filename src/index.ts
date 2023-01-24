import './style.scss';
import format from 'date-fns/format';
import { quartersInYear } from 'date-fns';

const buttonsList = document.querySelectorAll('.button-header');
const buttonListDelete = document.querySelector('.list-delete');
const buttonListEdit = document.querySelector('.list-edit');

const taskBar = document.querySelector('.task-bar') as HTMLElement;
const taskBarList = document.querySelectorAll('.task-bar-list');

const buttonNew = document.querySelector('.add-new');
const buttonSumbit = document.querySelector('.submit-todo');
const buttonExit = document.querySelectorAll('.exit-modal');
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
const buttonEdit = document.querySelectorAll('.edit-todo');
const buttonNewList = document.querySelector('.new-list');
const form = document.querySelector('.modal-form') as HTMLFormElement;

// List Modal
const listModal = document.querySelector('.list-modal');
const listModalForm = document.querySelector(
	'.list-modal-form'
) as HTMLFormElement;
const buttonSubmitList = document.querySelector('.submit-list');
const formTitleList = document.querySelector(
	'.list-form-title'
) as HTMLInputElement;

// Edit List Mdodal
const listModalEdit = document.querySelector('.list-modal-edit');
const listModalEditForm = document.querySelector(
	'.list-modal-edit-form'
) as HTMLFormElement;
const buttonEditList = document.querySelector('.submit-list-edit');
const formTitleListEdit = document.querySelector(
	'.list-form-title-edit'
) as HTMLInputElement;

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
	const list: Todo[] = [];

	let name = nameList;

	const addTodo = (e: Todo) => list.push(e);

	const removeTodo = (index: number) => list.splice(index, 1);

	// const editTodo = (e: Todo) => {
	// 	title = e.title;
	// };

	return {
		list,
		name,
		addTodo,
		removeTodo,
		// editTodo,
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
					<h1>${
						e.date.getTime() != new Date(0).getTime()
							? format(e.date, 'MMM do')
							: ''
					}</h1>
					<h1>${e.priority}</h1>
					<button class="delete-todo">Delete</button>
					<button class="edit-todo">Edit</button>
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

let listIndex: number;
let editToggle: boolean;
let editIndex: number;

// taskBar?.addEventListener('click', (e: any) => {
// 	if (e.target.classList.value.includes('task-bar-list')) {
// 	}
// });

// Switch b/t lists
taskBar?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('task-bar-list')) {
		listIndex = e.target?.dataset.index;
		domHandler.taskCardsUpdate(listIndex);
	}
});

// Select list and current list index
taskBar?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('selected')) {
		buttonsList.forEach((e) => e.classList.toggle('closed'));
	}
	if (
		e.target.classList.value.includes('task-bar-list') &&
		!e.target.classList.value.includes('selected')
	) {
		document
			.querySelectorAll('.task-bar-list')
			.forEach((element) => element.classList.remove('selected'));
		e.target.classList.add('selected');
		buttonsList.forEach((e) => e.classList.add('closed'));
	}
});

// Open edit modal
buttonListEdit?.addEventListener('click', () => {
	listModalEditForm?.reset();
	listModalEdit?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Edit current list
listModalEditForm.addEventListener('submit', (e: any) => {
	mainList.list.at(listIndex).name = formTitleListEdit.value;
	domHandler.taskBarUpdate();

	// Edited list is selected after name change
	let currentList = document.querySelector(`[data-index='${listIndex}']`);
	currentList?.classList.add('selected');

	listModalEdit?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// New List form
buttonNewList?.addEventListener('click', () => {
	listModalForm?.reset();
	listModal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Add new list
listModalForm?.addEventListener('submit', (e: any) => {
	mainList.addList(formTitleList.value);
	domHandler.taskBarUpdate();

	// New list is selected
	let lastChild = taskBar.lastElementChild;
	taskBarList.forEach((e) => e.classList.remove('selected'));
	lastChild?.classList.add('selected');

	listModal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');

	// Remove edit lists
	buttonsList.forEach((e) => e.classList.add('closed'));
});

// Add new todo form
// TODO: create module
buttonNew?.addEventListener('click', () => {
	form?.reset();

	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Exit Modal for all forms
buttonExit?.forEach((e) =>
	e.addEventListener('click', () => {
		modal?.classList.add('closed');
		listModal?.classList.add('closed');
		listModalEdit?.classList.add('closed');
		modalOverlay?.classList.add('closed');
	})
);

// Submit
form?.addEventListener('submit', () => {
	let todo = mainList.list.at(listIndex).list.at(editIndex);
	// Submit button edits the current todo
	if (editToggle) {
		todo.title = formTitle.value;
		todo.description = formDescription.value;
		todo.date =
			formDate.valueAsDate !== null ? formDate.valueAsDate : new Date(0);
		todo.priority = formPriority.value;

		console.log(formDate.valueAsDate);
		form?.reset();
	} else {
		mainList.list.at(listIndex).addTodo({
			title: formTitle.value,
			description: formDescription.value,
			date: formDate.value !== '' ? formDate.valueAsDate : new Date(0),
			priority: formPriority.value,
		});
	}

	editToggle = false;

	// console.log(mainList.list.at(listIndex).list.at(editIndex).title);
	domHandler.taskCardsUpdate(listIndex);
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
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

// Edit Button
taskContainer?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('edit-todo')) {
		editIndex = e.target.closest('.task-card').dataset.index;
		editToggle = true;
		modal?.classList.toggle('closed');
		modalOverlay?.classList.toggle('closed');

		// Populate fields from current todo
		let todo = mainList.list.at(listIndex).list.at(editIndex);

		formTitle.value = todo.title;
		formDescription.value = todo.description;
		formDate.valueAsDate =
			todo.date.getTime() !== new Date(0).getTime() ? todo.date : null;
		formPriority.value = todo.priority;

		// console.log(todo.date);
	}
});

// TODO: Confirmation
// Delete current Todo
taskContainer?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('delete-todo')) {
		e.target.closest('.task-card').remove();
		mainList.list.at(listIndex).removeTodo(e.target.dataset.index);
	}
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
