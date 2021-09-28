import {
  useQuery, useMutation, useQueryClient
} from 'react-query';
import './App.css';

// must return promise or react-query won't like it.
const fetchUsers = async () => {
  const response = await fetch('https://reqres.in/api/users');
  if (!response.ok) {
    throw new Error('Something went wrong!');
  }
  return response.json();
};

const addUser = async user => {
  const response = await fetch('https://reqres.in/api/users', {
    method: 'POST',
    body: JSON.stringify({
      first_name: user.first_name,
      last_name: user.last_name
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  return response.json();
};

function App() {
  const queryClient = useQueryClient()
  // get lots of users
  const { data: userData, isLoading, error } = useQuery('users', fetchUsers)
  // addUset mutation
  const { mutate, mutateAsync, isLoading: isLoadingAddUser, error: errorAddUser, } = useMutation(addUser);
  const handleAddUser = async () => {
    const newUser = await mutateAsync({ first_name: "react-query", last_name: "rulz" });
    console.log(`async mutation`)
    console.log(`newUser`, newUser)
    // invalidate + refecth - wont work on fake api
    // queryClient.invalidateQueries('users');
    //  update cached data
    queryClient.setQueryData('users', oldData => ({
      ...oldData,
      data: [newUser, ...oldData.data]
    }));
  }

  if (isLoading) return <p> Loading... </p>
  if (error || errorAddUser) return <p> Something went wrong. </p>
  // console.log(`userData`, userData)
  return (
    <div className="App">
      <h1>react-query experiments with resres.in</h1>
      <p> Here's some info: </p> <a href="https://reqres.in/" className="outbound"> reqres.in</a>

      <button onClick={() => handleAddUser()} className="button">
        add user
      </button>

      {isLoadingAddUser ? <p>Adding user...</p> : null}
      {
        userData.data.map(({ id, first_name, last_name }) => {
          return <p key={id}> {first_name + " " + last_name} </p>
        })
      }
    </div>
  );
}

export default App;
