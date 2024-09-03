import MyForm from '../../Global/Form/MyForm'
import './editCategory.css'
import InputField from '../../Global/InputField'
import { useState } from 'react'
import { getCategories } from '../../Global/Functions/search'

export default function EditCategory() {
    const defaultCategoryFields = {
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, error: ''},
        'Sub-Category': {value: '', placeholder: '', label: 'Sub-Category', type: 'text', ref: {}, req: true},
    }
    const [categoryFields, setCategoryFields] = useState(defaultCategoryFields)
    return (
        <div className='editCategory-main'>
            <h1>Edit Category</h1>
            <MyForm fields={categoryFields} setFields={setCategoryFields}>
            {Object.entries(categoryFields).map(([key, field], i) => {
                 return ((field.label === 'Sub-Category' && categoryFields['Category'].value) || field.label !== 'Sub-Category') &&  
                 <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} 
                 type = {field.type} ref = {field.ref} error={field.error}/>
            })}
                {/* {categoryFields['Category'] && <InputField label='Category' placeholder='Category Name' id='categoryName' type='select'/>} */}
                {/* {categoryFields['Category'].value && <InputField label='Sub-Category' placeholder='Sub-Category Name' id='subCategoryName' type='text'/>} */}
            </MyForm>
        </div>
    )
}