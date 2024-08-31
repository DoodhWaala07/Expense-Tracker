import './addCategory.css'
// import InputField from '../../Global/SelectField'
import MyForm from '../../Global/Form/MyForm'
import { useEffect, useState, createContext, useRef } from 'react'
import SelectField from '../../Global/SelectField'


const FormContext = createContext()

function getRandomColor() {
    // Generate a random hex color
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

export default function AddCategory() {
    // const [categoryFields, setCategoryFields] = useState({
    //     'Category': {value: '', placeholder: '', type: 'text'},
    //     'Sub-Category': {value: '', placeholder: '', type: 'search'},
    // })

    const categoryFields = useRef({
        'Category': {value: '', placeholder: '', type: 'text', ref : {}},
        'Sub-Category': {value: '', placeholder: '', type: 'search', ref: {}},
    })

    return (
        <div className = 'addCatMain'>
            <MyForm fields = {categoryFields}>
               {Object.entries(categoryFields.current).map(([label, field], i) => (
                   <SelectField key = {i} label = {label || field.label} placeholder = {label || field.placeholder} type = {field.type} ref = {field.ref} />
               ))}
            </MyForm>
            <button className='btn'>Add Category</button>
        </div>
    )
}