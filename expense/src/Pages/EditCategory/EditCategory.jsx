import MyForm from '../../Global/Form/MyForm'
import './editCategory.css'
import InputField from '../../Global/InputField'
import { useState } from 'react'
import search, { getCategories } from '../../Global/Functions/search'
import {SubCategories} from '../AddCategory/AddCategory'


const list = ['Grocery', 'Transport', 'Rent', 'Gas', 'Electricity', 'Water', 'Misc.', 'Transportation', 'Grocers', 'Rental']

export default function EditCategory() {
    const defaultCategoryFields = {
        // 'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, error: '', search: ({input, setState}) => search({api: '/category', input, setState})},
        // 'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, error: '', search: ({input, setState}) => search({api: '/category', input, setState})},
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, error: '', api: '/category'},
        'Test': {value: '', placeholder: '', type: 'select', ref: {}, req: true, error: '', list: list},
        'Sub-Category': {value: '', placeholder: '', label: 'Sub-Category', type: 'text', ref: {}, req: true},
    }
    const [categoryFields, setCategoryFields] = useState(defaultCategoryFields)

    const [subCategories, setSubCategories] = useState({})

    return (
        <div className='editCategory-main'>
            <h1>Edit Category</h1>
            <MyForm fields={categoryFields} setFields={setCategoryFields}>
            {Object.entries(categoryFields).map(([key, field], i) => {
                 return ((field.label === 'Sub-Category' && categoryFields['Category'].value) || field.label !== 'Sub-Category') &&  
                 <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} 
                 type = {field.type} ref = {field.ref} error={field.error} search={field.search || null}/>
            })}
                {/* {categoryFields['Category'] && <InputField label='Category' placeholder='Category Name' id='categoryName' type='select'/>} */}
                {/* {categoryFields['Category'].value && <InputField label='Sub-Category' placeholder='Sub-Category Name' id='subCategoryName' type='text'/>} */}
            </MyForm>
            {categoryFields['Category'].value && <SubCategories subCategories = {subCategories} setSubCategories = {setSubCategories}/>}
        </div>
    )
}