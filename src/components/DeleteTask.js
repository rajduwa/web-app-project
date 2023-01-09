import { IconButton, useToast } from '@chakra-ui/react';
import { FiTrash2 } from "react-icons/fi";
import supabase from '../supabase';
import { throwable } from '../throwable';

export default function DeleteTask({ id }) {
	const toast = useToast();

	async function handleDelete() {
		try {
			await throwable(supabase.from('todos').delete().eq('id', id));
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

	return (
		<IconButton isRound="true" icon={<FiTrash2 />} onClick={handleDelete} />
	);
}
