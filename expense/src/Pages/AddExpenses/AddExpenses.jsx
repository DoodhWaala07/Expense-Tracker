import axios from 'axios'
import { DialogBoxContext } from '../../Global/DialogBox'
import axiosError, { axiosLoading } from '../../Global/Functions/axiosError'
import './addExpenses.css'
import ExpenseRow from './ExpenseRow'
import { useState, createContext, useEffect, useContext, useRef } from 'react'
import MyForm from '../../Global/Form/MyForm'
import InputField from '../../Global/InputField'
import formatData from '../../Global/Functions/formatData'
import { validateEmptyFields } from '../../Global/Functions/validation'
import Tesseract from 'tesseract.js'
import bus from './busticket.png'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

import test from './test.jpg'
import card from './card.png'
export const RowsContext = createContext()

  
let apiKey = process.env.REACT_APP_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(`${apiKey}`);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function ocr(){
    let response = await Tesseract.recognize(
        // 'https://tesseract.projectnaptha.com/img/eng_bw.png',
        bus,
        'eng',
        // { logger: m => console.log(m) }
    )
    return response.data.text
}

async function getCategories(){
    let response = await axios.get('/api/category', {withCredentials: true})
    return response.data
}
  
async function getSubCategories(category){
    let response = await axios.get('/api/subcategory', {params: {metadata: category}}, {withCredentials: true})
    return response.data
}


export default function AddExpenses() {
    const count = useRef(0)
    const [rows, setRows] = useState([count.current])
    // const [errors, setErrors] = useState({})
    const {setDialogBox, resetDialogBox} = useContext(DialogBoxContext)
    const rowRefs = useRef({})

    const [globalFields, setGlobalFields] = useState({
        'Note': {value: '', placeholder: 'Transaction_Note', type: 'text', ref: {}, req: true},
    })

    function addRow() {
        count.current++
        setRows(prev => [...prev, count.current])
    }

    function confirm(){
        setRows([''])
        resetDialogBox()
    }

    async function getAnswer() {
        let categories = getCategories()
        let context = ''
        context = ocr()
        Promise.all([categories, context])
        .then(async ([categories, context]) => {
            // console.log(context)
            // categories = ['Grocery', 'Furniture', 'Transport', 'Utilities', 'Entertainment']
            // categories = [ `{ ID: 1, Category: 'Grocery' }`, `{ ID: 2, Category: 'Furniture' }` ] 
    
            categories = JSON.stringify(categories)
    
            // let question = `${context}\nDepending on the data provided from a receipt which category does this expense fit into
            //  from the following list ${categories}? Only return the JSON Object, nothing else.
            //  But if it does not fit into any of the categories, return a response as a string 'Not Found' and not a JSON object.`
    
            let question = `${context}\nDepending on the data provided from a receipt which category does this expense fit into
             from the following list ${categories}? Only return the JSON Object, nothing else.
             But if it does not fit into any of the categories, return a response as a string 'Not Found' and not a JSON object.
             Don't return anything else.
             `
    
            // question = `What are the names of the categories listed in the following list ${categories}?`
    
            console.log(question)
    
            const chatSession = model.startChat({
                generationConfig,
                history: [
                  
                ],
              });
            
              const result = await chatSession.sendMessage(question);
    
              if(result.response.text() != 'Not Found'){
                let category = JSON.parse(result.response.text())
                category = {ID: category.ID, Name: category.Category}
                console.log(category)
    
                let subcategories = await getSubCategories(category)
                subcategories = JSON.stringify(subcategories)
    
                let subcatQ = `Which subcategory does this expense fit into from the following list, ${subcategories}?`
    
                let subCat = await chatSession.sendMessage(subcatQ)
    
                subCat = JSON.parse(subCat.response.text())
                console.log(subCat)
                subCat = {ID: subCat.ID, Name: subCat.SubCategory}
                let amountQ = `How much does this expense cost? Just give a number without the currency symbol.`
                let amount = await chatSession.sendMessage(amountQ)
                console.log(amount.response.text())
                amount = amount.response.text()
                // amount = parseInt(amount.response.text())
                
                count.current++
                setRows(prev => [...prev, count.current])
                setTimeout(() => {
                    rowRefs.current[count.current].setExpenseFields(prev => {
                        return {...prev, 
                        'Category': {...prev['Category'], 'value': category}, 
                        'Amount': {...prev['Amount'], 'value': amount}}
                    })
                }, 0)
                setTimeout(() => {
                    rowRefs.current[count.current].setExpenseFields(prev => {
                        return {...prev, 
                        'Sub_Category': {...prev['Sub_Category'], 'value': subCat}}
                    })
                }, 100)
              }
        })
    }

    function addExpenses(){
        if(rows.length === 0){
            return null
        }
        let rowsRaw = rowRefs.current
        console.log(rowsRaw)
        let errors = []
        let rowsData = Object.values(rowsRaw).map((row, index) => {
            let errorsObj = validateEmptyFields(row.expenseFields, row.setExpenseFields)
            if(Object.values(errorsObj).length > 0){
                errors.push(errorsObj)
            }
            return formatData(row.expenseFields)
        })

        if(errors.length){
            return null
        }

        // console.log(rowsData)
        axios.post('/api/expenses', {rows: rowsData, globalFields: formatData(globalFields)})
        .then(res => {
            let msg = 'Expenses added successfully.'
            count.current = 0
            setRows([count.current])
            setDialogBox(prev => ({msg, confirm: confirm, close: null, show: true}))
        })
        .catch(error => {
            console.log(error)
            axiosError({error, setDialogBox, resetDialogBox})
        })
        axiosLoading({setDialogBox})
        
        // rowRefs.current[0].setExpenseFields(prev => {
        //     return {
        //         ...prev,
        //         ['Category']: {value: 'The', placeholder: 'CATEGORY', type: 'text', ref: {}, req: true, error: 'This is an error.'},
        //     }
        // })
    }

    useEffect(() => {
        // console.log(rowRefs.current)
        console.log(rows)
        const filteredObject = Object.fromEntries(
            Object.entries(rowRefs.current).filter(([key, value]) => {
                console.log(key)
                console.log(rows.includes(parseInt(key)))
                return rows.includes(parseInt(key))
    })
        );
        rowRefs.current = filteredObject
        console.log(rowRefs.current)
    }, [rows])

    return (
        <RowsContext.Provider value={{rows: rows, setRows: setRows, rowRefs: rowRefs}}>
        <div className='addExpenses-main'>
            <h1>Add Expenses</h1>
            <button onClick={getAnswer}>OCR</button>
            <div className='addExpenses-globalDetails'>
                <h2>Global Details</h2>
                <MyForm fields={globalFields} setFields={setGlobalFields}>
                    {Object.entries(globalFields).map(([key, field], i) => (
                        <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} 
                        type = {field.type} ref = {field.ref} error={field.error} className={field.className}/>
                    ))}
                </MyForm>
            </div>
            <h2 style={{alignSelf: 'flex-start', marginLeft: '15px'}}>Expenses</h2>
            {/* {console.log(rows)}
            {console.log(rowRefs.current)} */}
            {rows.map((row, index) => <ExpenseRow key={row} index={row} ref={(el) => rowRefs.current[row] = el}/>)}
            {/* {setTimeout(() => {console.log(rowRefs.current); console.log(rows)}, 1000)} */}
            <p className='addExpenseRowBtn' onClick={addRow}>Add new</p>
            <p className='btn' style={{width: '50%'}} onClick={addExpenses}>Add Expenses</p>
        </div>
        </RowsContext.Provider> 
    )
}