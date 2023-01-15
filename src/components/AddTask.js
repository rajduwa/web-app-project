import { Button, HStack, Input, useToast, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import supabase from '../supabase';
import { throwable } from '../throwable';

export default function AddTask({ session }) {
	const toast = useToast();

	const [text, setText] = useState('');
	const [date, setDate] = useState('');
	const [counter, setCounter] = useState(0);

	async function handleInsert(event) {
		event.preventDefault();
		try {
			await throwable(supabase.from('todos').insert(
				[{ text, user_id: session.user.id, done: false, date: date, difficulty: difficulties[counter] },
				]))
			setText('');
			setDate('');
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

	const difficulties = ["Easy", "Med", "Hard"];
	const colors = ["green", "orange", "red"];

	async function changeDifficulty() {
		const localCounter = (counter + 1) % 3;
		setCounter(localCounter);
		//console.log(localCounter);
	}

	return (
		<form onSubmit={handleInsert}>
			<VStack
				maxW={{ base: '90vw', sm: '80vw', lg: '50vw', xl: '30vw' }}
				alignItems="stretch"
			>
				<Input h="2.75em" variant="filled" placeholder="Mathematics" onChange={(e) => setText(e.target.value)} value={text} required />
				<HStack h="2.75em">
					<Input h="100%" type="date" bg="gray.100" onChange={(e) => setDate(e.target.value)} value={date} required/>
					<Button colorScheme={colors[counter]} w="6em" h="100%" onClick={changeDifficulty}>
						{difficulties[counter]}
					</Button>
					<Button colorScheme="blue" w="6em" h="100%" type="submit">
						Add
					</Button>
				</HStack>
			</VStack>
		</form>
	);
}
