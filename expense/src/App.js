import logo from './logo.svg';
import './App.css';
import {BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom'
import AddCategory from './Pages/AddCategory/AddCategory';
import AddExpenses from './Pages/AddExpenses/AddExpenses';
import EditCategory from './Pages/EditCategory/EditCategory';
import Authentication from './Pages/Authentication/Authentication';
import ProtectedRoute from './Pages/Authentication/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><AddExpenses/></ProtectedRoute>
  },
  {
    path: '/addCategory',
    element: <ProtectedRoute><AddCategory/></ProtectedRoute>
  },
  {
    path: '/addExpenses',
    element: <ProtectedRoute><AddExpenses/></ProtectedRoute>
  },
  {
    path: '/editCategory',
    element: <ProtectedRoute><EditCategory/></ProtectedRoute>
  },
])

function App() {
  return (
    <RouterProvider router = {router}/>
  );
}

export default App;
