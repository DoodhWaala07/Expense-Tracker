import { createContext, useEffect, useState } from 'react'
import FilterPane from './FilterPane/FilterPane'
import './viewExpenses.css'

export const ViewExpensesContext = createContext()

export default function ViewExpenses() {

    const [filterFloats, setFilterFloats] = useState([])
    const [subCatFilterFloats, setSubCatFilterFloats] = useState([])

    function onRemoveCategory(category){
        console.log('ON REMOVE CATEGORY')
        console.log(category)
        setSubCatFilterFloats(prev => {
            // let obj = prev.filter(f => (f.Category !== category.ID))
            return prev.filter((f) => {
                console.log(f)
                return ((f.Category !== category.ID))
            })
        })
    }

    const defaultCategoryFields = {
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true,
         api: '/api/category', floats: filterFloats, setFloats: setFilterFloats, onClose: onRemoveCategory},
        'Sub_Category': {
            value: '', placeholder: 'Sub-Category', type: 'select', ref: {}, req: true, disabled: true, 
            api: '/api/filter/subcategory', metadata: filterFloats, floats: subCatFilterFloats, setFloats: setSubCatFilterFloats
        },
    }

    const [categoryFields, setCategoryFields] = useState(defaultCategoryFields)

    useEffect(() => {
        // if(filterFloats.length){
            setCategoryFields(prev => {
                return {
                    ...prev, 
                    ['Sub_Category']: {
                        ...prev['Sub_Category'], disabled: filterFloats.length ? false : true, metadata: filterFloats,
                         floats: subCatFilterFloats, setFloats: setSubCatFilterFloats
                    },
                    ['Category']: {...prev['Category'], floats: filterFloats, setFloats: setFilterFloats}
                }
            })
        // }
    }, [filterFloats, subCatFilterFloats])
    
    return(
        <>
        <ViewExpensesContext.Provider value={{categoryFields, setCategoryFields, filterFloats, setFilterFloats, subCatFilterFloats, setSubCatFilterFloats}}>
         <div className='ve-main'>
            <h1>View Expenses</h1>

        </div>
        <FilterPane/>
        </ViewExpensesContext.Provider>
        </>
        
    )
}