import logo from './logo.svg';
import './App.css';
import {BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom'
import AddCategory from './Pages/AddCategory/AddCategory';
import AddExpenses from './Pages/AddExpenses/AddExpenses';
import EditCategory from './Pages/EditCategory/EditCategory';
import Authentication from './Pages/Authentication/Authentication';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AddExpenses/>
  },
  {
    path: '/addCategory',
    element: <AddCategory/>
  },
  {
    path: '/addExpenses',
    element: <AddExpenses/>
  },
  {
    path: '/editCategory',
    element: <EditCategory/>
  },
  {
    path: '/authentication',
    element: <Authentication/>
  }
])

function App() {
  return (
    <RouterProvider router = {router}/>
  );
}

export default App;
