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
	const checkedList: Todo[] = [];

	let name = nameList;

	const addTodo = (e: Todo) => list.push(e);

	// const addCheckedToList = (index: number) => {
	// 	addTodo(checkedList[index]);
	// 	checkedList.splice(index, 1);
	// };

	const addCheckedTodo = (e: Todo) => checkedList.push(e);

	const removeTodo = (index: number) => list.splice(index, 1);

	return {
		list,
		checkedList,
		// addCheckedToList,
		addCheckedTodo,
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
				<div class="task-card ${e.priority === 'Urgent' ? 'urgent' : ''}" data-index=${i}>
				
					<input class="checkbox" type="checkbox"/>
					<div class="card-info">
					<h1>${e.title}</h1>
					<h1>${
						// Checks if user does not put in date field
						e.date.getTime() != new Date(0).getTime()
							? // Added b/c didn't have all dates set in UTC, so now have to workaround the lack of providng a timezone
							  format(add(e.date, { hours: 8 }), 'MMM do')
							: ''
					}</h1>
				
					<h1>${e.description}</h1>
					<h1>${e.priority}</h1>
					</div>
					<div class="buttons-container">
					<button class="edit-todo"><i class="fa-regular fa-pen-to-square edit-todo"></i></button>
					<button class="delete-todo"><i class="fa-solid fa-trash delete-todo"></i></button>
					</div>
				</div>
				`
			);
			i++;
		});
	};

	return {
		updateTaskBar,
		updateTaskCards,
		clearTaskCards,
	};
})();

// Which list are we on
let listIndex: number;

// Which todo am I picking
let todoIndex: any;

// Allows the modal to edit rather than submit new todo to list
let editToggle: boolean;

// Index for editing which todo
let editIndex: number;

// Delete modal shows for both lists and todos; determines if on a todo or list
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

		for (let list of lists) {
			mainList.addList(list.name);
		}

		for (let list of mainList.list) {
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

// Remembers last selected list
if (localStorage.getItem('lists')) {
	let intialListIndex = localStorage.getItem('listIndex');

	if (typeof intialListIndex == 'string') {
		listIndex = Number(intialListIndex.split('"').join(''));

		document.querySelector(`[data-index='${listIndex}']`)?.classList.add('selected');
		// console.log(document.querySelector(`[data-index='${listIndex}']`));
		domHandler.updateTaskCards(listIndex);
	}
}

// DOM for lists //

//TODO: Combine these functions
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

// Open edit modal for lists
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

	// OPTIMIZE: dry
	listModalEdit?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Open Delete Modal
buttonDeleteList?.addEventListener('click', () => {
	deleteModal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// On delete confirmation modal window, exits out
buttonDelete?.addEventListener('click', () => {
	deleteModal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Delete button for both lists and todos
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

// Bring up new list modal form
buttonNewList?.addEventListener('click', () => {
	listModalForm?.reset();
	listModal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Add new list button
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

	// Remove option buttons for all lists
	buttonsList.forEach((e) => e.classList.add('closed'));

	populateStorage();
});

// DOM for todos////////////////////////////////////////////////////////////////////////////////

// Add new todo form
// TODO: create module
buttonNew?.addEventListener('click', () => {
	form?.reset();
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

document.addEventListener('keydown', (e: any) => {
	if (e.key === 'Enter' && modalOverlay?.classList.value.includes('closed')) {
		form?.reset();
		modal?.classList.toggle('closed');
		modalOverlay?.classList.toggle('closed');
	}
});

// Exit button for all forms that have the option
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
	}
	// Add todo to current list based off listIndex
	else {
		mainList.list.at(listIndex).addTodo({
			title: formTitle.value,
			description: formDescription.value,
			date: formDate.value !== '' ? formDate.valueAsDate : new Date(0),
			priority: formPriority.value,
		});
	}

	populateStorage();

	editToggle = false;

	domHandler.updateTaskCards(listIndex);

	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

// Edit Button
taskContainer?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('edit-todo')) {
		// Setting global values
		editIndex = e.target.closest('.task-card').dataset.index;
		editToggle = true;

		// Populate fields from current todo when editing for easy reference
		let todo = mainList.list.at(listIndex).list.at(editIndex);

		formTitle.value = todo.title;
		formDescription.value = todo.description;
		formDate.valueAsDate = todo.date.getTime() !== new Date(0).getTime() ? todo.date : null;
		formPriority.value = todo.priority;

		modal?.classList.toggle('closed');
		modalOverlay?.classList.toggle('closed');
	}
});

// Delete current todo
taskContainer?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('delete-todo')) {
		todoDeleteToggle = true;
		todoIndex = e.target;

		deleteModal?.classList.toggle('closed');
		modalOverlay?.classList.toggle('closed');
	}
});

// Checked off current todo
taskContainer?.addEventListener('click', (e: any) => {
	if (e.target.classList.value.includes('checkbox')) {
		if (e.target.checked) {
			editIndex = e.target.closest('.task-card').dataset.index;
			let todo = mainList.list.at(listIndex).list.at(editIndex);

			mainList.list.at(listIndex).addCheckedTodo({
				title: todo.title,
				description: todo.description,
				date: todo.date,
				priority: todo.priority,
			});

			setTimeout(() => {
				if (e.target.checked) {
					mainList.list.at(listIndex).removeTodo(editIndex);
					e.target.closest('.task-card').remove();

					let i = 0;

					mainList.list.at(listIndex).checkedList.forEach((e: Todo) => {
						taskContainer?.insertAdjacentHTML(
							'beforeend',
							`
					<div class="task-card checked" data-index=${i}>
						<h1>${e.title}</h1>
					</div>
					`
						);
						i++;
					});
				}
			}, 1000);
		}

		populateStorage();
	}
});

// Expand Card
taskContainer?.addEventListener('click', (e: any) => {
	if (e.target.closest('.task-card') && e.target.nodeName !== 'I' && e.target.nodeName !== 'INPUT') {
		if (e.target.closest('.task-card').classList.value.includes('expand')) {
			e.target.closest('.task-card').classList.toggle('expand');
		} else {
			document.querySelectorAll('.task-card:not(expand)').forEach((ele) => ele.classList.remove('expand'));
			e.target.closest('.task-card').classList.add('expand');
		}
	}
});

// // Undo button
// taskContainer?.addEventListener('click', (e: any) => {
// 	if (e.target.classList.includes('undo')) {
// 		mainList.list.at(listIndex).addCheckedToList();
// 	}
// });
