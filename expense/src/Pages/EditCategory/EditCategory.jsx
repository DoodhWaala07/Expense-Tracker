import MyForm from '../../Global/Form/MyForm'
import '../../Global/inputFields.css'
import './editCategory.css'
import InputField from '../../Global/InputField'
import { useContext, useState } from 'react'
import search, { getCategories } from '../../Global/Functions/search'
import {SubCategories} from '../AddCategory/AddCategory'
import axios from 'axios'
import { DialogBoxContext } from '../../Global/DialogBox'




const list = ['Grocery', 'Transport', 'Rent', 'Gas', 'Electricity', 'Water', 'Misc.', 'Transportation', 'Grocers', 'Rental']

export default function EditCategory() {
    const defaultCategoryFields = {
        // 'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, error: '', search: ({input, setState}) => search({api: '/category', input, setState})},
        // 'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, error: '', search: ({input, setState}) => search({api: '/category', input, setState})},
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, error: '', api: '/category'},
        'Sub-Category': {value: '', placeholder: '', label: 'Sub-Category', type: 'text', ref: {}, req: true},
    }
    const [categoryFields, setCategoryFields] = useState(defaultCategoryFields)

    const [subCategories, setSubCategories] = useState({})

    const {dialogBox, setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

    function confirmAddSubCategory(){
        setCategoryFields(prev => {
            return {...defaultCategoryFields}
        })
        setSubCategories(prev => {
            return {}
        })
        resetDialogBox()
    }

    function addSubCategory(e){
        e.preventDefault()
        
            axios.post('/subcategory', {
                subcategory: [categoryFields['Sub-Category'].value.trim(), ...Object.values(subCategories).map(subcategory => subcategory.value)],
                category: categoryFields['Category'].value
            }).then(res => {
                let msg = res.data
                setSubCategories({})
                setDialogBox(prev => ({msg, confirm: confirmAddSubCategory, close: null, show: true}))
            })
        .catch(error => {
            let msg
            if (error.response) {
                // The server responded with a status other than 200 range
                console.error('Error Status:', error.response.status);  // 409
                console.error('Error Message:', error.response.data);  // 'Error Handled'
                msg = error.response.data
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                msg = 'No response received'
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error in request setup:', error.message);
                msg = error.message
            }
            setDialogBox(prev => ({msg, confirm: resetDialogBox, close: null, show: true}))
        })
    }
    

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

            <button className='btn editCategoryBtn' onClick={(e) => addSubCategory(e)}>Add Category</button>
        </div>
    )
}