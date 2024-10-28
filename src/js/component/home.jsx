import React, { useEffect, useState } from "react";
import TaskList from './taskList';

const Home = () =>{

	const [users, setUsers] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [input, setInput] = useState('');

	function FetchUsers() {
		fetch('https://playground.4geeks.com/todo/users/', {
		method: "GET",
		})
		.then((response) => response.json())
		.then((json) => {
		setUsers(json.users);
		})
		.catch(error => {
			console.error(error);
		});
	}

	async function FetchTasks() {
		let userName = '';
		let task = '';
		let taskId = 0;
		let taskArray = [];
		let arrayOfArrays = [];
		async function fetchTasksForUser(userIndex) {
			const user = users[userIndex];
			const response = await fetch('https://playground.4geeks.com/todo/users/' + user.name);
			const json = await response.json();
			
			let arrayOfTasks = [];
			for(let j=0; j < json.todos.length; j++){
				task = json.todos[j].label;
				taskId = json.todos[j].id;
				taskArray = [task, taskId];
				arrayOfTasks.push(taskArray);
			}
			arrayOfArrays.push(arrayOfTasks);
			
			if (userIndex < users.length - 1) {
				await fetchTasksForUser(userIndex + 1);
			} else {
				setTasks(arrayOfArrays);
			}
		}
		
		if (users.length > 0) {
			await fetchTasksForUser(0);
		}
		
	}

	function CreateUser(){
		fetch('https://playground.4geeks.com/todo/users/' + input, {
			method: 'POST'
		})
		.then(response => {
			if (response.ok) {
				FetchUsers();
			}
			else{
				throw new Error('Failed to crate user');
			}
		})
		.catch(error => {
			console.error(error);
		});
	}

	const handleKeyPress = (e) =>{
		if (e.keyCode === 13){
			CreateUser();
		}
	}

	useEffect(() => {
		FetchUsers();
	}, [])

	useEffect(() => {
		if (users.length > 0){
			FetchTasks();
		}
	}, [users]);

	return (
		<div className='full-page'>
			<p className='title'>todos</p>
			<div className='create-user-box'>
				<input className='input' type='text' placeholder='username' onKeyDown={handleKeyPress} onChange={(e) => setInput(e.target.value)}/>
				<button className='add-button' onClick={CreateUser}>Create User</button>
			</div>
			<br/>
			{users.map((user, index) => (
				<TaskList key={index} user={user} tasksFromFetch={tasks[index]} updateUsers={FetchUsers} updateTasks={FetchTasks}/>
			))}
		</div>
	) 
}

 export default Home;