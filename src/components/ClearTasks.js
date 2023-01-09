import { Flex, Button, useToast } from '@chakra-ui/react';
import supabase from '../supabase';
import { throwable } from '../throwable';

export default function ClearTasks() {
    const toast = useToast();
    
    async function handleClear() {
        try {
            await throwable(supabase.from('todos').delete().not("id", "is", null));
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
        <Flex>
            <Button colorScheme="gray" px="8" h="45" color="gray.500" mt="10" onClick={handleClear}>
                Clear Tasks
            </Button>
        </Flex>
    );
}