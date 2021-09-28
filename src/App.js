import { useQuery, useMutation } from 'react-query';
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
  // get lots of users
  const { data: userData, isLoading, error, refetch } = useQuery('users', fetchUsers)
  // addUset mutation
  const { mutate, mutateAsync, isLoading: isLoadingAddUser, error: errorAddUser, } = useMutation(addUser, {
    onSuccess: (data, variables, ctx) => {
      console.log(`data`, data)


      // this won't work with this fake api!!!
      // refetch();
    }
  });

  if (isLoading) return <p> Loading... </p>
  if (error || errorAddUser) return <p> Something went wrong. </p>
  // console.log(`userData`, userData)
  return (
    <div className="App">
      <h1>react-query experiments with resres.in</h1>
      <p> Here's some info: </p> <a href="https://reqres.in/" className="outbound"> reqres.in</a>

      <button onClick={() => mutate({ first_name: "react-query", last_name: "rulz" })} className="button">
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
