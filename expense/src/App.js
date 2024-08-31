import logo from './logo.svg';
import './App.css';
import {BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom'
import AddCategory from './Pages/AddCategory/AddCategory';
import AddExpenses from './Pages/AddExpenses/AddExpenses';

const router = createBrowserRouter([
  {
    path: '/addCategory',
    element: <AddCategory/>
  },
  {
    path: '/addExpense',
    element: <AddExpenses/>
  },
])

function App() {
  return (
    <RouterProvider router = {router}/>
  );
}

export default App;
