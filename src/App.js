import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Todo from './pages/Todo';
import supabase from './supabase';

function App() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])
	//console.log(session);

	return (
		<Routes>
			<Route path={'/'} element={<Login />} />
			<Route path={'/signup'} element={<SignUp />} />
			{session && <Route path={'/todo'} element={<Todo session={session} />} />}
		</Routes>
	)
}

export default App;
