import { Button, HStack, VStack, Input, Text, Heading, Link, useToast, FormControl } from '@chakra-ui/react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import { throwable } from '../throwable';


export default function Login() {
	const toast = useToast();
	let navigate = useNavigate();

	const [userData, setUserData] = useState({
		email: '',
		password: ''
	});

	console.log(userData);

	function handleChange(event) {
		setUserData((prevUserData) => {
			return {
				...prevUserData,
				[event.target.name]: event.target.value
			}
		})
	}

	async function handleSubmit(event) {
		console.log('cokolwiek');
		event.preventDefault();
		try {
			const data = await throwable(supabase.auth.signInWithPassword({
				email: userData.email,
				password: userData.password,
			}))
			console.log(data);
			navigate('/todo');
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
		<VStack p={4} minH="100vh">
			<Heading
				mt="20"
				p="5"
				fontWeight="extrabold"
				size="xl"
				bgGradient="linear(to-l, teal.300, blue.500)"
				bgClip="text"
			>
				Login
			</Heading>
			<form onSubmit={handleSubmit}>
				<VStack my="5" h="6">
					<Input name="email" type="email" h="100%" variant="filled" placeholder="E-mail" onChange={handleChange} />
					<Input name="password" type="password" h="100%" variant="filled" placeholder="Password" onChange={handleChange} />
					<HStack>
						<Button type="submit" colorScheme="gray" px="8" h="35" color="gray.500">
							Login
						</Button>
					</HStack>
					<Text>
						Don't have an account? <Link href='/signup'>Sign Up</Link>
					</Text>
				</VStack>
			</form>
		</VStack>
	);
}
