import { Heading, VStack } from '@chakra-ui/react';
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';
import Logout from '../components/Logout';

export default function Todo({ session }) {
    return (
        <VStack p={4} minH="100vh">
			<Logout />
            <Heading
                mt="20"
                p="5"
                fontWeight="extrabold"
                size="xl"
                bgGradient="linear(to-l, teal.300, blue.500)"
                bgClip="text"
            >
                Todo List
            </Heading>
            <AddTask session={session} />
            <TaskList />
        </VStack>
    )
}
