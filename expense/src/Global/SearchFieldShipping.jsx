import { createContext, useContext, useState } from 'react'
import './inputFields.css'
import { FieldsContext } from './SearchForm'
import Spinner from './Spinner'


const ValueContext = createContext()

export default function SearchField({label, placeholder, searchFunction}){
    const [results, setResults] = useState()
    const [value, setValue] = useState()
    let fieldValues = useContext(FieldsContext)

    function changeInput(input){
        if(!input){
            updateFieldValues(fieldValues.current, label, '')
        }
        searchFunction(input, label, setResults)
    }
    return(
        <ValueContext.Provider value = {[setResults, setValue]}>
        <div className='searchFieldWrapper'>
            <label className='fieldLabel'>{label}</label><br />
            <input type="text"
             className="inputField" 
            //  onKeyUp={(e) => search(e.target.value)} 
             value={value} onClick={()=> setValue()} 
             placeholder={placeholder}
             onChange={(e)=>changeInput(e.target.value)}
            />
            <SearchResults results={results} label={label}/>
        </div>
        </ValueContext.Provider>
    )
}

function SearchResults({results, label}){

    let [setResults, setValue] = useContext(ValueContext)
    let fieldValues = useContext(FieldsContext)

    function selectItem(item){
        updateFieldValues(fieldValues.current, label, item)
        setValue(item.Name)
        setResults()
    }
    if(results == undefined){
        return console.log('Hello')
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
        console.log('Hello2')
        return(
            <div className='searchResultDiv'>
                {results.map(result => {
                    //Replace result.clientName with Generic Thing
                    return <div className='searchItem' onClick={(e) => {selectItem(result)}}>{result.Name || result}</div>
                })}
            </div>
        )
    } else if(results.length == 0){
        console.log('Hello3')
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
    console.log(fieldValues)
}