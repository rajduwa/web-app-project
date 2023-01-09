import { VStack, StackDivider, HStack, Input, useToast } from '@chakra-ui/react';
import DeleteTask from './DeleteTask';
import ClearTasks from './ClearTasks';
import supabase from '../supabase';
import { useEffect, useState } from 'react';
import { throwable } from '../throwable';

export default function TaskList() {
	const toast = useToast();
	const [tasks, setTasks] = useState([]);

	async function fetchData() {
		try {
			const todos = await throwable(supabase.from('todos').select('*'));
			setTasks(todos);
			console.log(todos);
		} catch (error) {
			toast({
				title: error.message,
				status: 'error',
				isClosable: true,
				position: 'top',
				duration: 5000,
			})
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		const todos = supabase.channel('todos')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'todos' },
				(payload) => {
					if (payload.eventType === 'DELETE') {
						setTasks((tasks) => {
							return tasks.filter((task) => task.id !== payload.old.id);
						});
					} else if (payload.eventType === 'INSERT') {
						setTasks((tasks) => {
							return [...tasks, payload.new];
						});
					} else if (payload.eventType === 'UPDATE') {
						setTasks((tasks) => {
							for (const task of tasks) {
								if (task.id === payload.old.id) {
									task.text = payload.new.text;
								}
							}
							return [...tasks];
						});
					}
					console.log('Change received!', payload)
				}
			)
			.subscribe();
		return () => {
			todos.unsubscribe();
		};
	}, []);

	async function onTaskChange(event, task) {
		task.text = event.target.value;
		setTasks([...tasks]);
	}

	async function commitTask(task) {
		try {
			await throwable(supabase
				.from('todos')
				.update({ text: task.text })
				.eq('id', task.id));
		} catch (error) {
			toast({
				title: error.message,
				status: 'error',
				isClosable: true,
				position: 'top',
				duration: 5000,
			})
		}
	}

	if (!tasks.length) {
		return '';
	} else {
		return (
			<>
				<VStack
					divider={<StackDivider />}
					borderColor="gray.100"
					borderWidth="2px"
					p="5"
					borderRadius="lg"
					w="100%"
					maxW={{ base: '90vw', sm: '80vw', lg: '50vw', xl: '30vw' }}
					alignItems="stretch"
				>
					{tasks.map(task => (
						<HStack key={task.id}>
							<Input w="100%" p="8px" borderRadius="lg" value={task.text} onChange={(event) => onTaskChange(event, task)} onBlur={() => commitTask(task)} />
							<DeleteTask id={task.id} />
						</HStack>
					))}
				</VStack>
				<ClearTasks />
			</>
		)
	}
}
