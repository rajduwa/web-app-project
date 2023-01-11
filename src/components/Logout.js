import supabase from '../supabase';
import { HStack, Text, IconButton, useToast } from '@chakra-ui/react';
import { FiUserMinus } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { throwable } from '../throwable';

export default function Logout() {
	const toast = useToast();
	const [email, setEmail] = useState('');
	let navigate = useNavigate();

	async function handleLogout() {
		try {
			await throwable(supabase.auth.signOut());
			navigate('/');
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
		(async () => {
			const data = await throwable(supabase.auth.getUser());
			setEmail(data.user.email);
			//console.log(data);
		})();
	}, [])

	return (
		<HStack my="5" h="6" p="2em">
			<IconButton isRound="true" icon={<FiUserMinus />} onClick={handleLogout} />
			<Text color="gray.400">{email}</Text>
		</HStack>
	)
}
