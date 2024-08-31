import logo from './logo.svg';
import './App.css';
import {BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom'
import AddCategory from './Pages/AddCategory/AddCategory';


const router = createBrowserRouter([
  {
    path: '/addCategory',
    element: <AddCategory/>
  },
])

function App() {
  return (
    <RouterProvider router = {router}/>
  );
}

export default App;
