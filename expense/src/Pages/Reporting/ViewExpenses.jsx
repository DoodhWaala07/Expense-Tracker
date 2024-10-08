import { createContext, useEffect, useState } from 'react'
import FilterPane from './FilterPane/FilterPane'
import './viewExpenses.css'
import ExpenseDisplayRow from './ExpenseDisplayRow/ExpenseDisplayRow'
import axios from 'axios'
import { timeZone } from '../../Global/Functions/date'
import PieChart from './PieChart/PieChart'

export const ViewExpensesContext = createContext()

export default function ViewExpenses() {

    //SET UP FOR FILTER PANE

    const [filterFloats, setFilterFloats] = useState([])
    const [subCatFilterFloats, setSubCatFilterFloats] = useState([])
    const [dateFilterFloats, setDateFilterFloats] = useState([])
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [sums, setSums] = useState([])

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
        'Time_Period': {value: {ID: 'curr_month', Name: 'This Month'}, placeholder: 'Choose Time Period', type: 'select', ref: {}, req: true,
        // list: ['', 'curr_day', 'last_day', 'curr_week', 'last_week', 'curr_month', 'last_month', 'curr_year', 'last_year', 'custom'],
        list: [
            // {ID: 'none', Name: ' '},
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

    const defaultNoteFields = {
        'Note': {value: '', placeholder: 'Notes', type: 'text', ref: {}, req: false},
    }

    const [categoryFields, setCategoryFields] = useState(defaultCategoryFields)
    const [dateFields, setDateFields] = useState(defaultDateFields)
    const [noteFields, setNoteFields] = useState(defaultNoteFields)

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

    useEffect(() => {
        getExpenses()
    }, [dateFields['Time_Period'].value, filterFloats, subCatFilterFloats, 
    dateFilterFloats, dateFields['From']?.value, dateFields['To']?.value, noteFields['Note']?.value])

    // useEffect(() => {
    //     // getExpenses()
    // }, dateFields['Time_Period'].value)

    //END SETUP FOR FILTER PANE

    //BEGIN FETCHING EXPENSES

    const [expenses, setExpenses] = useState([])

    function getExpenses() {
        axios.get('/api/expenses', {
            params: {
                categoryFilters: filterFloats, 
                dateFilters: dateFilterFloats, 
                subCatFilters: subCatFilterFloats,
                timeZone: timeZone(),
                timePeriod: dateFields['Time_Period'].value.ID,
                specificDates: dateFilterFloats,
                range: {from: dateFields['From']?.value, to: dateFields['To']?.value},
                note: noteFields['Note'].value,
            }})
       .then(res => {
           console.log(res.data)
           setExpenses(res.data.expenses)
           setSums(res.data.sums)
       })
       .catch(err => {
           console.log(err)
       })
    }

    function clearFilters() {
        setFilterFloats([])
        setSubCatFilterFloats([])
        setDateFilterFloats([])
        setDateFields(defaultDateFields)
        setNoteFields(defaultNoteFields)
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            console.log('WINDOW RESIZE: ' + window.innerWidth)
            setWindowWidth(window.innerWidth)
        })

        return () => {
            window.removeEventListener('resize', () => {
                setWindowWidth(window.innerWidth)
            })
        }
    }, [])

    
    return(
        <>
        <ViewExpensesContext.Provider value={{
            categoryFields, setCategoryFields, filterFloats, 
            setFilterFloats, subCatFilterFloats, setSubCatFilterFloats,
            dateFields, setDateFields, defaultDateFields, dateFilterFloats, setDateFilterFloats, 
            windowWidth, getExpenses, setWindowWidth, noteFields, setNoteFields,
        }}
        >
         <div className='ve-main'>
            <h1>View Expenses</h1>
            <PieChart data={sums} title = {dateFields['Time_Period'].value.Name}/>
            <ExpenseDisplayRow expense = {expenseHeadings} heading = {true}/>
            {expenses.map((expense, i) => {
                return (
                    <ExpenseDisplayRow expense = {expense} key = {i}/>
                )
            })}
            <div>{timeZone()}</div>
        </div>
        <FilterPane clearFilters = {clearFilters}/>
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