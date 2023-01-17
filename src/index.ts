import './style.scss';
import format from 'date-fns/format';

const buttonNew = document.querySelector('.add-new');
const buttonSumbit = document.querySelector('.submit-todo');
const buttonExit = document.querySelector('.exit-modal');
const taskContainer = document.querySelector('.task-container');
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal-overlay');
const title = document.querySelector('.title') as HTMLInputElement;

interface Todo {
	title: string;
	description: string;
	date: Date;
	priority: 'urgent' | 'later';
}

function projects(name: string) {
	const getName = () => name;

	let list: any[] = [];
	const getList = () => list;

	function addToList(object: object) {
		list.push(object);
	}

	function addTodoToList(
		title: string,
		description: string,
		date: Date,
		priority: 'urgent' | 'later'
	) {
		addToList({
			title,
			description,
			date,
			priority,
		});
	}

	function removeTodoFromList(todo: string) {
		let index = list.findIndex((e: Todo) => e.title === todo);

		list.splice(index, 1);
	}

	return {
		getName,
		getList,
		addTodoToList,
		removeTodoFromList,
	};
}

const domHandler = (() => {
	function clearList() {
		taskContainer?.replaceChildren();
	}

	function updateList() {
		defaultList.getList().forEach((e: Todo) =>
			taskContainer?.insertAdjacentHTML(
				'beforeend',
				`
	<div class="task-card">
	<input type="checkbox" />
	<h2>${e.title}</h2>
	<h3>${e.date}</h3>
</div>
	`
			)
		);
	}

	return {
		updateList,
		clearList,
	};
})();

// Clicking on add brings up modal form
buttonNew?.addEventListener('click', () => {
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
	// domHandler.updateList();
});

// Exit button on modal form
buttonExit?.addEventListener('click', () => {
	console.log(1234);
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

let defaultList = projects('default');
// defaultList.addTodoToList(
// 	'Eat Paint',
// 	'Look at the paint',
// 	new Date(),
// 	'urgent'
// );
// console.log(defaultList.getList());

buttonSumbit?.addEventListener('click', (e) => {
	// e.preventDefault();
	// console.log(124);
	defaultList.addTodoToList(title.value, 'pizza', new Date(), 'urgent');
	domHandler.clearList();
	domHandler.updateList();
	modal?.classList.toggle('closed');
	modalOverlay?.classList.toggle('closed');
});

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
