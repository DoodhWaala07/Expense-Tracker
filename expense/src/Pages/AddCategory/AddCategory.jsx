import './addCategory.css'
import '../../Global/inputFields.css'
// import InputField from '../../Global/SelectField'
import MyForm from '../../Global/Form/MyForm'
import { useEffect, useState, createContext, useRef } from 'react'
import SelectField from '../../Global/SelectField'
import InputField from '../../Global/InputField'


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
    const [categoryFields, setCategoryFields] = useState({
        'Search_Category': {value: '', placeholder: '', type: 'search', ref: {}},
        'Sub-Category': {value: '', placeholder: '', type: 'select', ref: {}},
    })
    const count = useRef(0)

    const [subCategories, setSubCategories] = useState({})

    // const categoryFields = useRef({
    //     'Category': {value: '', placeholder: '', type: 'text', ref : {}},
    //     'Sub-Category': {value: '', placeholder: '', type: 'search', ref: {}},
    // })

    function addSubCategory(e) {
        e.preventDefault()
        setSubCategories(prev => {
            count.current += 1
            return {
                ...prev,
                [`Sub-Category_${count.current}`]:  {label: `Sub-Category`, value: '', placeholder: '', type: 'text', ref: {}}
            }
        })
    }

    function removeSubCategory(e, id) {
        e.preventDefault()
        setSubCategories(prev => {
            delete prev[id]
            return {...prev}
        })
    }

    useEffect(() => {
        console.log(categoryFields)
        console.log(subCategories)
    }, [subCategories])

    return (
        <div className = 'addCatMain'>
            <MyForm fields = {categoryFields} setFields={setCategoryFields}>
               {Object.entries(categoryFields).map(([key, field], i) => (
                <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} type = {field.type} ref = {field.ref} />

               ))}
               
            </MyForm>
            <MyForm fields = {subCategories} setFields={setSubCategories}>
                {Object.entries(subCategories).map(([key, field], i) => (
                    <div className='subCatWrapper'>
                        <button className='removeFieldBtn btn' onClick={(e) => removeSubCategory(e, key)}>X</button>
                        <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} type = {field.type} ref = {field.ref} />
                    </div>
               ))}
            </MyForm>
            <p className='addCat-new-p' onClick={(e) => addSubCategory(e)}>Add new</p>
            <button className='btn'>Add Category</button>
        </div>
    )
}