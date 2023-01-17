function projects(name: string) {
	const getName = () => name;

	let list: any[] = [{ title: 'pizza' }];
	const getList = () => list;

	function createObjects(
		title: string,
		description: string,
		date: Date,
		priority: 'urgent' | 'later'
	) {
		return {
			title,
			description,
			date,
			priority,
		};
	}

	function addToList(object: object) {
		list.push(object);
	}

	function addTodoToList(
		title: string,
		description: string,
		date: Date,
		priority: 'urgent' | 'later'
	) {
		addToList(createObjects(title, description, date, priority));
	}

	interface Todo {
		title: string;
		description: string;
		date: Date;
		priority: 'urgent' | 'later';
	}

	function removeTodoFromList(todo: string) {
		let index = list.findIndex((e: Todo) => e.title === todo);
		console.log(todo);
		console.log(index);
		list.splice(index, 1);
	}

	return {
		getName,
		getList,
		addTodoToList,
		removeTodoFromList,
	};
}

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
