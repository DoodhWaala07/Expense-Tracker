import { createContext, useContext, useState, useRef, useEffect } from 'react'
import './inputFields.css'
import { FieldsContext } from './SearchForm'
import Spinner from './Spinner'
import { FormContext } from './Form/MyForm'
import CoreField from './CoreField'
import search, { filterList } from './Functions/search'

const list = ['Grocery', 'Transport', 'Rent', 'Gas', 'Electricity', 'Water', 'Misc.']

const ValueContext = createContext()

export default function SelectField({label, placeholder, type, id, api, list}){
    const {fields, setFields} = useContext(FormContext)
    const [listToggle, setListToggle] = useState(false)
    const [value, setValue] = useState(fields[id].value)
    const [fieldValue, setFieldValue] = useState()
    const parentRef = useRef()

    //results = {laoding: true, data: ['test', 'test2']}
    const [results, setResults] = useState({
        loading: false,
        data: undefined
    })

    // const [results, setResults] = useState()

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

    useEffect(() => {
        setValue(fields[id].value)
        setValue()
    }, [fields])

    function clickFunction(e){
        // e.preventDefault()
        // console.log(results)
        
        setFields(prev => {
            return {...prev, [id]: {...prev[id], error: ''}}
        })
        if(results.data === undefined){
            console.log('test')
            showResults(e)
            // e.target.removeAttribute('readonly')
        } else if (results.data !== undefined){
            console.log('test2')
            e.target.removeAttribute('readonly')
        }
    }

    function showResults(e){
        // console.log('Hello')
        search({input: e.target.value, setState: setResults, api: fields[id].api, list: fields[id].list})
        // setResults(prev => [...list])
    }
    
    function hideResults(){
        // console.log(document.activeElement)
        setTimeout(() => {
            if(!parentRef.current.contains(document.activeElement)){
                setValue(prev => {
                    // let fieldValue = fields.current[label].value
                    let fieldValue = fields[id].value
                    console.log(fieldValue)
                    console.log(fields)

                    if(fieldValue){
                        // console.log(fieldValue)
                        // console.log(fields)
                        return fieldValue
                    } else {
                        // console.log(fields)
                        return ''
                    }
                })
                console.log(document.activeElement)
                setResults({
                    loading: false,
                    data: undefined
                })
                console.log('Hide')
            } 
        }, 0) 
        // setResults()
    }

    function onBlur(e){
        e.target.setAttribute('readonly', true)
        hideResults()
    }

    function onChange(e){   
        // setValue(e.target.value)
        let value = e.target.value
        if(fields[id].list){
            setResults(prev => {
                // console.log(filterList({list: results.data, input: value}))
                return {...prev, data: value ? filterList({list: fields[id].list, input: value}) : undefined}
            })
        }
    }
    return(
        <ValueContext.Provider value = {{setResults, setValue, setFieldValue, setFields, fields, value, search}}>    
        <div className='searchFieldWrapper' ref={parentRef} >
            {/* <label className='fieldLabel'>{label.replaceAll('_', ' ')}</label><br /> */}
            {/* <input className='inputField' placeholder={placeholder.replaceAll('_', ' ')} 
            style={{cursor: 'pointer', border: fields[id].error ? '1px solid red' : ''}} 
            onClick={(e) => clickFunction(e)} 
            onFocus={null}  onBlur={onBlur} 
            value={value}
            ref={fields[id].ref}
            readOnly/> */}

            <CoreField label={label} placeholder={placeholder} id={id} type={type} onClick={clickFunction} onBlur={onBlur} onFocus={null} onChange={onChange} value={value}/>
            {/* <CoreField label={label} placeholder={placeholder} id={id} type={'text'} onClick={onClick} onChange={onChange} onBlur={onBlur} value={fields[id].value} /> */}

            {<SearchResults results={results} label={label} id={id}/>}
            {/* <div onClick={() => console.log(results)}>Test</div> */}
        </div>
        </ValueContext.Provider>
    )
}


function SearchResults({results, label, id}){

    //results = {laoding: true, data: ['test', 'test2']}
    let {setResults, setValue, setFieldValue, setFields, fields, search, value} = useContext(ValueContext)
    let fieldValues = useContext(FieldsContext)
    let resultDiv = useRef()

    // useEffect(() => {
    //     console.log('Changing value')
        
    // }, [value])

    // const [page, setPage] = useState(1)
    const page = useRef(1)

    function selectItem(e, item){
        // updateFieldValues(fieldValues.current, label, item)
        // console.log('HelloYYYY')
        // console.log(item)
        e.target.focus()
        setValue(prev => {
        //    setFieldValue(prev => {
        //     return item.Name || item
        //  })
           setFields(prev => {
            //    let field = prev[label] 
               return {...prev, [id]: {...prev[id], value: item.Name || item}}
           }) 
        //    fields.current[label].value = item.Name || item
           return item.Name || item
        })
        console.log(fields)
        setResults({loading : false, data: undefined})
        // setResults()
    }

    function handleScroll(e){
        if(e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight){
            console.log('Pagination')
            page.current = page.current + 1
            search({input: value, setState: setResults, api: fields[id].api, list: fields[id].list, page: page.current})
        }
    }

    return (
        <>
        {!(results.loading === false && (results.data === undefined || results.data === null)) &&
            <div className='searchResultDiv' ref={resultDiv} onScroll={handleScroll}>
                {results.data?.length === 0 && <div className='noResult'>No results matched your search.</div>}
                {results.data?.map((result, i) => {
                    return (
                    <>
                        <div key={i} tabIndex={0} className='searchItem' onClick={(e) => {selectItem(e, result)}} onTouchStart={(e) => (e.target.focus())} >{result.Name || result}</div>
                    </>
                    )
                })
                }
                {results.loading &&
                    <div className='spinnerContainer'>
                        <Spinner size={'20px'} thickness={'5px'}/>
                    </div>
                }
            </div>
        }


        </>
    )

    if(results == undefined){
        // return console.log('Hello')
    }
    else if(results == 'loading'){
        return(
            //class in spinner
            <div className='searchResultDiv' ref={resultDiv}>
                <div className='spinnerContainer'>
                    <Spinner size={'20px'} thickness={'5px'}/>
                </div>
            </div>
        )
    }
    else if(results.length){
        // console.log('Hello2')
        return(
            <div className='searchResultDiv' ref={resultDiv}>
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
        <div className='searchResultDiv' ref={resultDiv}>
            <div className='noResult'>No results matched your search.</div>
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