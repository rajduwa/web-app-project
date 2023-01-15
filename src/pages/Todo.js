import { Heading, VStack } from '@chakra-ui/react';
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';
import Logout from '../components/Logout';

export default function Todo({ session }) {
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
			<Logout />
			<AddTask session={session} />
			<TaskList />
		</VStack >
	)
}
