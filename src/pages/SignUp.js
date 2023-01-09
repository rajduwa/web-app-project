import { Button, HStack, VStack, Input, Text, Heading, Link, useToast } from '@chakra-ui/react';
import { useState } from 'react'
import supabase from '../supabase';
import { throwable } from '../throwable';

export default function Account() {
    const toast = useToast();

    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    console.log(userData);

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
                Register
            </Heading>
            <VStack my="5" h="6">
                <Input name="email" type="email" h="100%" variant="filled" placeholder="E-mail" onChange={handleChange} />
                <Input name="password" type="password" h="100%" variant="filled" placeholder="Password" onChange={handleChange} />
                <HStack>
                    <Button colorScheme="gray" px="8" h="35" color="gray.500" onClick={handleSubmit}>
                        Register
                    </Button>
                </HStack>
                <Text>
                    Already have an account? <Link href='/'>Login</Link>
                </Text>
            </VStack>
        </VStack>
    );
}
