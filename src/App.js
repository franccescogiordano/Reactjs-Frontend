import React, { createContext, useContext, useEffect, useReducer,useRef, useState } from 'react';


const HOST_API = "http://localhost:8080/api"

const initialState = {
	list: []
};
const Store = createContext(initialState);
const Form = () => {
 
 const formRef = useRef(null);
  const [dispatch] = useContext(Store);
  const [state,setState]=useState();

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      isComplete: false,
    };

    fetch(HOST_API + "/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: ""});
        formRef.current.reset();
      });
  };

  return (
    <form ref={formRef}>
      <input type="text" name="name"
        onChange={(event) =>
          setState({ ...state, name: event.target.value })}
      />
      <button onClick={onAdd}>Agregar</button>

    </form>
  );

}

const List = () => { //para listar toda la informacion
  const { state, dispatch } = useContext(Store);
 // const [ dispatch, state ] = useContext(Store); //creo store como contexto
  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list })
      })
  }, [state.list.length, dispatch]);




  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Nombre</td>
          <td>¿Esta Completado?</td>
        </tr>
      </thead>
      <tbody>
        {state.list.map((todo) => {
          return <tr key={todo.id}>
            <td>{todo.id}</td>
            <td>{todo.name}</td>
            <td>{todo.isComplete}</td>
          </tr>
        })}
      </tbody>
    </table>
  );
}
function reducer(state, action) {
  switch (action.type) {
    case 'update-list':
      return { ...state, list: action.list }
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList }
    default:
      return state;
  }
}
const StoreProvider = ({ children }) => {
 
  const [state ,dispatch] = useReducer(reducer, initialState); //creo store como contexto

	return (
		<Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
	);
}

function App() {
  return (
    <StoreProvider>
      <Form />
      <List />
    </StoreProvider>
  );
}

export default App;