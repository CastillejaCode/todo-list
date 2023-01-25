import './style.scss';
import format from 'date-fns/format';
import add from 'date-fns/add';
import parseJSON from 'date-fns/parseJSON';

const buttonsList = document.querySelectorAll('.button-header');
const buttonListEdit = document.querySelector('.list-edit');
const buttonNew = document.querySelector('.add-new');
const buttonExit = document.querySelectorAll('.exit-modal');
const buttonNewList = document.querySelector('.new-list');

const taskBar = document.querySelector('.task-bar') as HTMLElement;
const taskBarList = document.querySelectorAll('.task-bar-list');
const taskContainer = document.querySelector('.task-container');

// Adding new todos
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal-overlay');
const formTitle = document.querySelector('.form-title') as HTMLInputElement;
const formDescription = document.querySelector('.form-description') as HTMLInputElement;
const formDate = document.querySelector('.form-date') as HTMLInputElement;
const formPriority = document.querySelector('.form-priority') as HTMLSelectElement;
const form = document.querySelector('.modal-form') as HTMLFormElement;

// List form modal
const listModal = document.querySelector('.list-modal');
const listModalForm = document.querySelector('.list-modal-form') as HTMLFormElement;
const formTitleList = document.querySelector('.list-form-title') as HTMLInputElement;

// Edit/ Delete options for list
const listModalEdit = document.querySelector('.list-modal-edit');
const listModalEditForm = document.querySelector('.list-modal-edit-form') as HTMLFormElement;
const buttonDeleteList = document.querySelector('.list-delete');
const formTitleListEdit = document.querySelector('.list-form-title-edit') as HTMLInputElement;

// Delete Modal
const deleteModal = document.querySelector('.delete-modal');
const buttonDelete = document.querySelector('.button-delete');
const buttonConfirm = document.querySelector('.button-confirm');

const mainList = (function () {
	const list: any[] = [];

	const addList = (name: string) => {
		list.push(lists(name));
	};

	const removeList = (index: number) => {
		list.splice(index, 1);
	};

	return {
		list,
		addList,
		removeList,
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
					<input type="checkbox"/>
					<h1>${e.title}</h1>
					<h1>${e.description}</h1>
					<h1>${
						// Checks if user does not put in date field
						e.date.getTime() != new Date(0).getTime()
							? // Added b/c didn't have all dates set in UTC, so now have to workaround the lack of providng a timezone
							  format(add(e.date, { hours: 8 }), 'MMM do')
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
		updateTaskBar,
		updateTaskCards: updateTaskCards,
		clearTaskCards,
	};
})();

// mainList.addList('default');
// mainList.addList('pizza');

let listIndex: number;
let todoIndex: any;
let editToggle: boolean;
let editIndex: number;
let todoDeleteToggle: boolean;

function populateStorage() {
	let lists = mainList.list;
	localStorage.setItem('lists', JSON.stringify(lists));
	localStorage.setItem('listIndex', JSON.stringify(listIndex));
}

function setStyles() {
	let allLists = localStorage.getItem('lists');

	let i = 0;

	if (typeof allLists === 'string') {
		let lists = JSON.parse(allLists);
		// console.log(lists[2].list);
		// console.log(list);

		for (let list of lists) {
			mainList.addList(list.name);
			// console.log(list.list);
		}

		for (let list of mainList.list) {
			// console.log(list);
			for (let todo of lists[i].list) {
				todo.date = parseJSON(todo.date);
				list.addTodo(todo);
			}
			i++;
		}
	}

	domHandler.updateTaskBar();
}

//Initialize stored information

setStyles();
// console.log(localStorage.getItem('lists')?.length);

if (localStorage.getItem('lists')) {
	let intialListIndex = localStorage.getItem('listIndex');

	if (typeof intialListIndex == 'string') {
		listIndex = Number(intialListIndex.split('"').join(''));

		document.querySelector(`[data-index='${listIndex}']`)?.classList.add('selected');
		// console.log(document.querySelector(`[data-index='${listIndex}']`));
		domHandler.updateTaskCards(listIndex);
	}
}

// console.log(localStorage.)

// Switch b/t lists
taskBar?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('task-bar-list')) {
		listIndex = e.target?.dataset.index;
		domHandler.updateTaskCards(listIndex);

		populateStorage();
	}
});

// Select list and current list index
taskBar?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('selected')) {
		buttonsList.forEach((e) => e.classList.toggle('closed'));
	}
	if (e.target.classList.value.includes('task-bar-list') && !e.target.classList.value.includes('selected')) {
		document.querySelectorAll('.task-bar-list').forEach((element) => element.classList.remove('selected'));
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
	domHandler.updateTaskBar();

	// Edited list is selected after name change
	let currentList = document.querySelector(`[data-index='${listIndex}']`);
	currentList?.classList.add('selected');
	populateStorage();

	listModalEdit?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Open Delete Modal
buttonDeleteList?.addEventListener('click', () => {
	deleteModal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Don't delete
buttonDelete?.addEventListener('click', () => {
	deleteModal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Delete the list
buttonConfirm?.addEventListener('click', () => {
	// Deletes the todo
	if (todoDeleteToggle) {
		todoIndex.closest('.task-card').remove();
		mainList.list.at(listIndex).removeTodo(todoIndex.dataset.index);
		todoDeleteToggle != todoDeleteToggle;
	}
	// Deletes the list
	else {
		mainList.removeList(listIndex);
		domHandler.clearTaskCards();
		domHandler.updateTaskBar();
		populateStorage();
	}

	populateStorage();
	deleteModal?.classList.toggle('closed');
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
	domHandler.updateTaskBar();

	// New list is selected
	let lastChild: any = taskBar.lastElementChild;
	taskBarList.forEach((e) => e.classList.remove('selected'));
	lastChild?.classList.add('selected');

	// On new list creation, display new list todos
	listIndex = Number(lastChild?.dataset.index);
	domHandler.updateTaskCards(listIndex);

	listModal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');

	// Remove edit lists
	buttonsList.forEach((e) => e.classList.add('closed'));

	populateStorage();
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

// Submit Todo
form?.addEventListener('submit', () => {
	let todo = mainList.list.at(listIndex).list.at(editIndex);
	// Submit button edits the current todo
	if (editToggle) {
		todo.title = formTitle.value;
		todo.description = formDescription.value;
		todo.date = formDate.valueAsDate !== null ? formDate.valueAsDate : new Date(0);
		todo.priority = formPriority.value;

		form?.reset();
	} else {
		mainList.list.at(listIndex).addTodo({
			title: formTitle.value,
			description: formDescription.value,
			date: formDate.value !== '' ? formDate.valueAsDate : new Date(0),
			priority: formPriority.value,
		});
	}

	// console.log(mainList);
	populateStorage();
	editToggle = false;

	// console.log(mainList.list.at(listIndex).list.at(editIndex).title);
	domHandler.updateTaskCards(listIndex);
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// mainList.list.at(1)?.addTodo({
// 	title: 'Eat Pizza',
// 	description: 'Pet the cat a lot',
// 	date: new Date(),
// 	priority: 'urgent',
// });

// mainList.list.at(0)?.addTodo({
// 	title: 'Pet Cat',
// 	description: 'Pet the cat a lot',
// 	date: new Date(),
// 	priority: 'urgent',
// });

// Show all lists and default todos
// domHandler.taskBarUpdate();
// domHandler.taskCardsUpdate(0);

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
		formDate.valueAsDate = todo.date.getTime() !== new Date(0).getTime() ? todo.date : null;
		formPriority.value = todo.priority;

		// console.log(todo.date);
	}
});

// Delete Modal
taskContainer?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('delete-todo')) {
		todoDeleteToggle = true;
		todoIndex = e.target;
		deleteModal?.classList.toggle('closed');
		modalOverlay?.classList.toggle('closed');
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
