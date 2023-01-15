import { VStack, StackDivider, HStack, Input, useToast, Checkbox, Button } from '@chakra-ui/react';
import DeleteTask from './DeleteTask';
import supabase from '../supabase';
import { useCallback, useEffect, useState, useRef } from 'react';
import { throwable } from '../throwable';

export default function TaskList() {
	const toast = useToast();

	const [tasks, setTasks] = useState([]);
	const [date, setDate] = useState([]);
	const [isDone, setDone] = useState(false);

	const def = ["Easy", "Med", "Hard"];
	const colors = ["green", "orange", "red"];

	const form = useRef();
	const [difficulties, setDifficulties] = useState(def);

	const fetchData = useCallback(async function fetchData() {
		try {
			const todos = await throwable(supabase.from('todos').select('*').in('difficulty', difficulties).eq('done', isDone).order('id'));
			setTasks(todos);
			//console.log(difficulties);
			//console.log('todos', todos);
		} catch (error) {
			toast({
				title: error.message,
				status: 'error',
				isClosable: true,
				position: 'top',
				duration: 5000,
			})
		}
	}, [toast, difficulties, isDone]);

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
									task.date = payload.new.date;
									break;
								}
							}
							return [...tasks];
						});
					}
					setTasks((tasks) => {
						//console.log(tasks);
						return tasks.filter((task) => (difficulties.includes(task.difficulty) && isDone === task.done));
					});
					//console.log('Change received!', payload);
				}
			)
			.subscribe();
		return () => {
			todos.unsubscribe();
		};
	}, [difficulties, isDone]);

	async function onTaskChange(event, task) {
		task.text = event.target.value;
		setTasks([...tasks]);
	}

	async function onDateChange(event, task) {
		task.date = event.target.value;
		setDate([...date]);
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

	async function commitDate(task) {
		setTasks([...tasks]);
		try {
			await throwable(supabase
				.from('todos')
				.update({ date: task.date })
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

	async function commitDifficulty(task) {
		task.difficulty = difficulties[(difficulties.indexOf(task.difficulty) + 1) % difficulties.length];
		setTasks([...tasks]);
		try {
			await throwable(supabase
				.from('todos')
				.update({ difficulty: task.difficulty })
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

	useEffect(() => {
		fetchData();
		//console.log('supabase update', difficulties);
	}, [difficulties, fetchData]);

	const onChange = () => {
		const checkboxes = [...form.current.elements.difficulty];
		const checked = checkboxes.filter(x => x.checked).map(x => x.value);

		setDifficulties(checked.length === 0 ? def : checked);
	}

	return (
		<>
			<form onChange={onChange} ref={form}>
				<HStack>
					<Checkbox name="difficulty" value="Easy" size="md">Easy</Checkbox>
					<Checkbox name="difficulty" value="Med" size="md">Med</Checkbox>
					<Checkbox name="difficulty" value="Hard" size="md">Hard</Checkbox>
					<Checkbox size="md" isChecked={isDone} onChange={() => { setDone(!isDone) }}>Done</Checkbox>
				</HStack>
			</form>
			<VStack
				divider={<StackDivider />}
				borderColor="gray.100"
				borderWidth="0.15em"
				p="5"
				hidden={tasks.length === 0}
				borderRadius="lg"
				maxW={{ base: '90vw', sm: '80vw', lg: '50vw', xl: '30vw' }}
				alignItems="stretch"
			>
				{tasks.map(task => (
					<VStack alignItems="stretch" key={task.id}>
						<HStack>
							<Checkbox size="lg" isChecked={task.done} onChange={(event) => commitDone(event, task)} />
							<Input w="100%" p="0.5em" borderRadius="lg" value={task.text} onChange={(event) => onTaskChange(event, task)} onBlur={() => commitTask(task)} />
							<DeleteTask id={task.id} />
						</HStack>
						<HStack w="100%">
							<Input type="date" value={task.date} onChange={(event) => onDateChange(event, task)} onBlur={() => commitDate(task)} />
							<Button colorScheme={colors[def.indexOf(task.difficulty)]} w="8em" h="2.5em" onClick={() => commitDifficulty(task)}>{task.difficulty}</Button>
						</HStack>
					</VStack>
				))}
			</VStack>
		</>
	)
}
