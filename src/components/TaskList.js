import { VStack, StackDivider, HStack, Input, useToast, Checkbox } from '@chakra-ui/react';
import DeleteTask from './DeleteTask';
import ClearTasks from './ClearTasks';
import supabase from '../supabase';
import { useCallback, useEffect, useState } from 'react';
import { throwable } from '../throwable';

export default function TaskList() {
	const toast = useToast();
	const [tasks, setTasks] = useState([]);

	const fetchData = useCallback(async function fetchData() {
		try {
			const todos = await throwable(supabase.from('todos').select('*').order('id'));
			setTasks(todos);
			console.log('todos', todos);
		} catch (error) {
			toast({
				title: error.message,
				status: 'error',
				isClosable: true,
				position: 'top',
				duration: 5000,
			})
		}
	}, [toast]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

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
									task.done = payload.new.done;
									break;
								}
							}
							return [...tasks];
						});
					}
					//console.log('Change received!', payload);
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

	async function commitDone(event, task) {
		task.done = event.target.checked;
		setTasks([...tasks]);
		try {
			await throwable(supabase
				.from('todos')
				.update({ done: task.done })
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
					borderWidth="0.15em"
					p="5"
					borderRadius="lg"
					w="100%"
					maxW={{ base: '90vw', sm: '80vw', lg: '50vw', xl: '30vw' }}
					alignItems="stretch"
				>
					{tasks.map(task => (
						<HStack key={task.id}>
							<Checkbox size="lg" isChecked={task.done} onChange={(event) => commitDone(event, task)} />
							<Input w="100%" p="0.5em" borderRadius="lg" value={task.text} onChange={(event) => onTaskChange(event, task)} onBlur={() => commitTask(task)} />
							<DeleteTask id={task.id} />
						</HStack>
					))}
				</VStack>
				<ClearTasks />
			</>
		)
	}
}
