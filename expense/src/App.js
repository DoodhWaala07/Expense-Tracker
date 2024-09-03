import logo from './logo.svg';
import './App.css';
import {BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom'
import AddCategory from './Pages/AddCategory/AddCategory';
import AddExpenses from './Pages/AddExpenses/AddExpenses';
import EditCategory from './Pages/EditCategory/EditCategory';

const router = createBrowserRouter([
  {
    path: '/addCategory',
    element: <AddCategory/>
  },
  {
    path: '/addExpense',
    element: <AddExpenses/>
  },
  {
    path: '/editCategory',
    element: <EditCategory/>
  }
])

function App() {
  return (
    <RouterProvider router = {router}/>
  );
}

export default App;
