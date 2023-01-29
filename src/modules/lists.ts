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

export { mainList, lists };
