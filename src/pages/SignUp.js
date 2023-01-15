import { Button, HStack, VStack, Input, Text, Heading, Link, useToast } from '@chakra-ui/react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import { throwable } from '../throwable';

export default function Account() {
	let navigate = useNavigate();
	const toast = useToast();

	const [userData, setUserData] = useState({
		email: '',
		password: ''
	});

	//console.log(userData);

	function handleChange(event) {
		setUserData((prevUserData) => {
			return {
				...prevUserData, [event.target.name]: event.target.value
			}
		})
	}

	async function handleSubmit(event) {
		event.preventDefault();
		try {
			await throwable(supabase.auth.signUp({
				email: userData.email,
				password: userData.password
			}))
			toast({
				title: 'Successfully registered!',
				status: 'success',
				isClosable: true,
				position: 'top',
				duration: 5000,
			})
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

	return (
		<VStack p="4" mt="70">
			<Heading
				fontWeight="extrabold"
				size="3xl"
				fontSize="6xl"
				bgGradient="linear(to-l, teal.300, blue.500)"
				bgClip="text"
			>
				Exams
			</Heading>
			<Text
				fontSize="4xl"
				p="0"
				fontWeight="extrabold"
				bgGradient="linear(to-l, teal.300, blue.500)"
				bgClip="text"
			>
				Register
			</Text>
			<form onSubmit={handleSubmit}>
				<VStack my="5" h="6">
					<Input name="email" type="email" variant="filled" placeholder="E-mail" p="1em" w="20em" onChange={handleChange} />
					<Input name="password" type="password" variant="filled" placeholder="Password" p="1em" w="20em" onChange={handleChange} />
					<HStack>
						<Button type="submit" colorScheme="gray" p="1em" w="10em" color="gray.500">
							Register
						</Button>
					</HStack>
					<Text p="1em">
						Already have an account? <Link href='/' color="blue.400">Log in</Link>
					</Text>
				</VStack>
			</form>
		</VStack>
	);
}
