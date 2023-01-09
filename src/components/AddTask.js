import { Button, HStack, Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import supabase from '../supabase';
import { throwable } from '../throwable';

export default function AddTask({ session }) {
	const toast = useToast();

	async function handleInsert(event) {
		try {
			await throwable(supabase.from('todos').insert(
				[{ text, user_id: session.user.id },
				]))
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

	const [text, setText] = useState('');
	return (
		<HStack my="4" h="45">
			<Input id="input_id" h="100%" variant="filled" placeholder="Do the laundry" onChange={(e) => setText(e.target.value)} value={text} />
			<Button colorScheme="blue" px="10" h="100%" onClick={handleInsert}>
				Add
			</Button>
		</HStack>
	);
}
