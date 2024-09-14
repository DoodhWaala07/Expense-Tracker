import logo from './logo.svg';
import './App.css';
import {BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom'
import AddCategory from './Pages/AddCategory/AddCategory';
import AddExpenses from './Pages/AddExpenses/AddExpenses';
import EditCategory from './Pages/EditCategory/EditCategory';
import Authentication from './Pages/Authentication/Authentication';
import ProtectedRoute, { InversePrtoectedRoute } from './Pages/Authentication/ProtectedRoute';
import Test from './Pages/Test';
import SidePane from './Global/SidePane/SidePane';
import ViewExpenses from './Pages/Reporting/ViewExpenses';
import FilterPane from './Pages/Reporting/FilterPane/FilterPane';

const router = createBrowserRouter([
  {
    path: "/",
    element: <SidePane/>,
    children: [
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
      {
        path: '/viewExpenses',
        element: <FilterPane/>,
        children: [
          {
            path: '/viewExpenses',
            element: <ViewExpenses/>
          }
        ]
      },
      // {
      //   path: '/authentication',
      //   element: <Authentication/>
      // },
      {
        path: 'test',
        element: <Test/>
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router = {router}/>
  );
}

export default App;
