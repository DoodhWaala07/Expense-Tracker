import '../../Global/inputFields.css'
import './addCategory.css'
// import InputField from '../../Global/SelectField'
import MyForm from '../../Global/Form/MyForm'
import { useEffect, useState, createContext, useRef, useContext } from 'react'
import SelectField from '../../Global/SelectField'
import InputField from '../../Global/InputField'
import axios from 'axios'
import formatData, { removeSpaces } from '../../Global/Functions/formatData'
import { DialogBoxContext } from '../../Global/DialogBox'
import { validateEmptyFields } from '../../Global/Functions/validation'

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
    const defaultCategoryFields = {
        'Category': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: ''},
        'Sub-Category': {value: '', placeholder: '', type: 'text', ref: {}, req: true},
        // 'Select': {value: '', placeholder: '', type: 'select', ref: {}},
    }
    const [categoryFields, setCategoryFields] = useState(defaultCategoryFields)
    const count = useRef(0)

    const [subCategories, setSubCategories] = useState({})

    const {dialogBox, setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

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

    function confirmAddCategory(){
        setCategoryFields(prev => {
            return {...defaultCategoryFields}
        })
        resetDialogBox()
    }

    function submitCategory(e){
        if(Object.keys(validateEmptyFields(categoryFields, setCategoryFields)).length > 0 ){
            return null
        }
        axios.post('/category', {category: categoryFields['Category'].value.trim(), subCategories: [categoryFields['Sub-Category'].value.trim(), ...Object.values(subCategories).map(sub => sub.value.trim())]})
        .then(res => {
            let msg = res.data
            setDialogBox(prev => ({msg, confirm: confirmAddCategory, close: null, show: true}))
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

    useEffect(() => {
        console.log(categoryFields)
        console.log(subCategories)
    }, [subCategories])

    useEffect(() => {
        console.log(categoryFields)
        // console.log(subCategories)
    }, [categoryFields])

    return (
        <div className = 'addCatMain'>
            <MyForm fields = {categoryFields} setFields={setCategoryFields}>
               {Object.entries(categoryFields).map(([key, field], i) => (
                <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} type = {field.type} ref = {field.ref} error={field.error}/>

               ))}
               
            </MyForm>
           
            <SubCategories subCategories = {subCategories} setSubCategories = {setSubCategories}/>
            <button className='btn addCategoryBtn' onClick={(e) => submitCategory(e)}>Add Category</button>
        </div>
    )
}

export function SubCategories({subCategories, setSubCategories}) {

    const count = useRef(0)

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

    return(
        <>
        <MyForm fields = {subCategories} setFields={setSubCategories}>
                {Object.entries(subCategories).map(([key, field], i) => (
                    <div className='subCatWrapper'>
                        <button className='btn removeFieldBtn' onClick={(e) => removeSubCategory(e, key)}>X</button>
                        <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} type = {field.type} ref = {field.ref} error={field.error}/>
                    </div>
               ))}
        </MyForm>
        <p className='addCat-new-p' onClick={(e) => addSubCategory(e)}>Add new</p>
        </>
    )
}