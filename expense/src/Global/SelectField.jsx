import { createContext, useContext, useState, useRef, useEffect } from 'react'
import './inputFields.css'
import { FieldsContext } from './SearchForm'
import Spinner from './Spinner'
import { FormContext } from './Form/MyForm'

const list = ['Grocery', 'Transport', 'Rent', 'Gas', 'Electricity', 'Water', 'Misc.']

const ValueContext = createContext()

export default function SelectField({label, placeholder, type}){

    const [listToggle, setListToggle] = useState(false)
    const [value, setValue] = useState()
    const [fieldValue, setFieldValue] = useState()
    const parentRef = useRef()

    const [results, setResults] = useState()

    function focusOut(){
        console.log('Focus Out')
    }

    useEffect(() => {
        const handleTouchStart = (e) => {
            // Check if the element is meant to receive focus
            if (e.target.classList.contains('focusable')) {
                // Explicitly set focus to the element
                e.target.focus();
            }
        };
    
        document.addEventListener('touchstart', handleTouchStart);
    
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
        };
    }, []);

    function clickFunction(e){
        // e.preventDefault()
        // console.log(results)
        
        setValue()
        if(results === undefined){
            // console.log('test')
            showResults()
            // e.target.removeAttribute('readonly')
        } else if (results !== undefined){
            e.target.removeAttribute('readonly')
        }
    }

    function showResults(){
        setResults(prev => [...list])
    }
    
    function hideResults(){
        // console.log(document.activeElement)
        setTimeout(() => {
            if(!parentRef.current.contains(document.activeElement)){
                setValue(prev => {
                    if(fieldValue){
                        console.log(fieldValue)
                        return fieldValue
                    } else {
                        return ''
                    }
                })
                console.log(document.activeElement)
                setResults()
                console.log('Hide')
            } 
        }, 0) 
        // setResults()
    }

    function onBlur(e){
        e.target.setAttribute('readonly', true)
        hideResults()
    }
    return(
        <ValueContext.Provider value = {[setResults, setValue, setFieldValue]}>    
        <div className='searchFieldWrapper' ref={parentRef} >
            {/* <label className='fieldLabel'>{label}</label><br /> */}
            <input className='inputField' placeholder={placeholder} style={{cursor: 'pointer'}} onClick={(e) => clickFunction(e)} onFocus={null}  onBlur={onBlur} 
            value={value} 
            readOnly/>
            <SearchResults results={results} label={label}/>
            {/* <div onClick={() => console.log(results)}>Test</div> */}
        </div>
        </ValueContext.Provider>
    )
}


function SearchResults({results, label}){

    let [setResults, setValue, setFieldValue] = useContext(ValueContext)
    let fieldValues = useContext(FieldsContext)

    function selectItem(e, item){
        // updateFieldValues(fieldValues.current, label, item)
        // console.log('HelloYYYY')
        // console.log(item)
        e.target.focus()
        setValue(prev => {
           setFieldValue(prev => {
            return item.Name || item
         }) 
           return item.Name || item
        })
        setResults()
        // setResults()
    }
    if(results == undefined){
        // return console.log('Hello')
    }
    else if(results == 'loading'){
        return(
            //class in spinner
            <div className='searchResultDiv'>
            <div className='spinnerContainer'>
            <Spinner size={'20px'} thickness={'5px'}/>
            </div>
            </div>
        )
    }
    else if(results.length){
        // console.log('Hello2')
        return(
            <div className='searchResultDiv'>
                {results.map((result, i) => {
                    //Replace result.clientName with Generic Thing
                    return <>
                    <div key={i} tabIndex={0} className='searchItem' onClick={(e) => {selectItem(e, result)}} onTouchStart={(e) => (e.target.focus())} >{result.Name || result}</div>
                    {/* <div className='divider'></div> */}
                    </>
                })}
            </div>
        )
    } else if(results.length == 0){
        // console.log('Hello3')
        return(
        <div className='searchResultDiv'>
            <div className='noResult'>No results matched your search.</div>
            {/* <div className='spinnerContainer'>
            <Spinner size={'20px'} thickness={'5px'}/>
            </div> */}
            {/* <Spinner size={'20px'} thickness={'5px'}/> */}
            {/* <Button variant="primary">Primary</Button>{' '} */}
        </div>
        )
    }
}


function updateFieldValues(fieldValues, label, newValue){
    let valuesObject = fieldValues
    valuesObject[label] = newValue
    fieldValues = valuesObject
    // console.log(fieldValues)
}