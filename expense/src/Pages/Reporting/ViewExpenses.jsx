import { createContext, useEffect, useState } from 'react'
import FilterPane from './FilterPane/FilterPane'
import './viewExpenses.css'
import ExpenseDisplayRow from './ExpenseDisplayRow/ExpenseDisplayRow'
import axios from 'axios'

export const ViewExpensesContext = createContext()

export default function ViewExpenses() {

    //SET UP FOR FILTER PANE

    const [filterFloats, setFilterFloats] = useState([])
    const [subCatFilterFloats, setSubCatFilterFloats] = useState([])
    const [dateFilterFloats, setDateFilterFloats] = useState([])

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

    const defaultDateFields = {
        'Time_Period': {value: '', placeholder: 'Choose Time Period', type: 'select', ref: {}, req: true,
        // list: ['', 'curr_day', 'last_day', 'curr_week', 'last_week', 'curr_month', 'last_month', 'curr_year', 'last_year', 'custom'],
        list: [
            {ID: 'none', Name: ' '},
            {ID: 'curr_day', Name: 'Today'},
            {ID: 'last_day', Name: 'Yesterday'},
            {ID: 'curr_week', Name: 'This Week'},
            {ID: 'last_week', Name: 'Last Week'},
            {ID: 'curr_month', Name: 'This Month'},
            {ID: 'last_month', Name: 'Last Month'},
            {ID: 'curr_year', Name: 'This Year'},
            {ID: 'last_year', Name: 'Last Year'},
            {ID: 'specific', Name: 'Specific Dates'},
            {ID: 'range', Name: 'Range'},
        ]
     },
    //  'Specific_Date': {value: '', placeholder: 'Date', type: 'date', ref: {}, req: true, api: '/api/category', floats: dateFilterFloats, setFloats: setDateFilterFloats},
    }

    const [categoryFields, setCategoryFields] = useState(defaultCategoryFields)
    const [dateFields, setDateFields] = useState(defaultDateFields)

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
            getExpenses()
        // }
    }, [filterFloats, subCatFilterFloats])

    //END SETUP FOR FILTER PANE

    //BEGIN FETCHING EXPENSES

    const [expenses, setExpenses] = useState([])

    function getExpenses() {
        axios.get('/api/expenses', {params: {categoryFilters: filterFloats, dateFilters: dateFilterFloats, subCatFilters: subCatFilterFloats}})
       .then(res => {
           console.log(res.data)
           setExpenses(res.data)
       })
       .catch(err => {
           console.log(err)
       })
    }

    useEffect(() => {
       
    }, [])
    
    return(
        <>
        <ViewExpensesContext.Provider value={{
            categoryFields, setCategoryFields, filterFloats, 
            setFilterFloats, subCatFilterFloats, setSubCatFilterFloats,
            dateFields, setDateFields, defaultDateFields, dateFilterFloats, setDateFilterFloats
        }}
        >
         <div className='ve-main'>
            <h1>View Expenses</h1>
            <ExpenseDisplayRow expense = {expenseHeadings} heading = {true}/>
            {expenses.map((expense, i) => {
                return (
                    <ExpenseDisplayRow expense = {expense} key = {i}/>
                )
            })}
        </div>
        <FilterPane/>
        </ViewExpensesContext.Provider>
        </>
        
    )
}

const testExpense = {
    'Category': 'Food',
    'Sub_Category': 'Dinner',
    'Quantity': 1,
    'Amount': 100,
    'Description': 'Dinner with friends.',
    'Date': '2021-11-23',
}

const expenseHeadings = {
    'Category': 'Category',
    'Sub_Category': 'Sub-Cat',
    // 'Quantity': 'Quantity',
    'Amount': 'Amount',
    // 'Description': 'Description',
    'Date': 'Date',
}