import './style.scss';

const buttonNew = document.querySelector('.add-new');
const taskContainer = document.querySelector('.task-container');

interface Todo {
	title: string;
	description: string;
	date: Date;
	priority: 'urgent' | 'later';
}

function projects(name: string) {
	const getName = () => name;

	let list: any[] = [{ title: 'pizza' }];
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
	function updateList() {
		defaultList.getList().forEach((e: Todo) =>
			buttonNew?.insertAdjacentHTML(
				'beforebegin',
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
	};
})();

buttonNew?.addEventListener('click', () => {
	domHandler.updateList();
});

let defaultList = projects('default');
defaultList.addTodoToList(
	'Eat Paint',
	'Look at the paint',
	new Date(),
	'urgent'
);
console.log(defaultList.getList());

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
