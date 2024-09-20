import { useEffect, useState, useContext } from 'react'
import {FilterPaneElement} from '../FilterPane'
import MyForm from '../../../../Global/Form/MyForm'
import InputField from '../../../../Global/InputField'
import FilterFloats, { FilterFloatsContainer } from '../FilterFloats/FilterFloats'
import {ViewExpensesContext} from '../../ViewExpenses'

export default function DateFilter() {

    const {dateFields, setDateFields, defaultDateFields, dateFilterFloats, setDateFilterFloats, getExpenses} = useContext(ViewExpensesContext)
    const additionalDateFields = {
        // 'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true,
        //  api: '/api/category', floats: filterFloats, setFloats: setFilterFloats, onClose: onRemoveCategory},
         'From': {value: '', placeholder: 'From', type: 'date', ref: {}, req: true},
         'To': {value: '', placeholder: 'To', type: 'date', ref: {}, req: true},
    }

    const specificDateFields = {
        'Specific_Date': {value: '', placeholder: 'Date', type: 'date', ref: {}, req: true, floats: dateFilterFloats, setFloats: setDateFilterFloats},
    }

    useEffect(() => {
        let timePeriod = dateFields['Time_Period'].value

        switch (timePeriod.ID) {
            case 'none':
                setDateFields(prev => {
                    return {...prev, ['Time_Period']: {...prev['Time_Period'], value : ''}}
                })
                break;

            case 'range':
                setDateFields(prev => {
                    return {...defaultDateFields, 'Time_Period': {...prev['Time_Period']} , ...additionalDateFields}
                })
                break;

            case 'specific':
                setDateFields(prev => {
                    return {...defaultDateFields, 'Time_Period': {...prev['Time_Period']}, ...specificDateFields}
                })
                break;
            default:
                setDateFields(prev => {
                    return {...defaultDateFields, 'Time_Period': {...prev['Time_Period']}}
                })
                break;
        }
    }, [dateFields['Time_Period'].value])

    useEffect(() => {
        let specificDate = dateFields['Specific_Date']?.value
        if(specificDate && !dateFilterFloats.includes(specificDate)){
            setDateFilterFloats(prev => [...prev, specificDate])
        }
        if(specificDate){
            setDateFields(prev => {
                return {...prev, ['Specific_Date']: {...prev['Specific_Date'], value : ''}}
            })
        }
    }, [dateFields['Specific_Date']?.value])

    useEffect(() => {
        console.log(dateFilterFloats)
        if(dateFields['Specific_Date']){
        setDateFields(prev => {
            return {...prev, ['Specific_Date']: {...prev['Specific_Date'], floats: dateFilterFloats, setFloats: setDateFilterFloats}}
        })
        }
    }, [dateFilterFloats])

    return (
        <FilterPaneElement url = '/addCategory' text = 'Date'>
            <MyForm fields = {dateFields} setFields = {setDateFields}>
                {Object.entries(dateFields).map(([key, field], i) => {
                    return (
                    <>
                        <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} 
                        type = {field.type} ref = {field.ref} error={field.error} className={field.className}/>
                        <FilterFloatsContainer filterFloats = {field.floats} setFilterFloats = {field.setFloats} onClose = {field.onClose || null}/>
                    </>
                    )
                })}
            </MyForm>
        </FilterPaneElement>
    )
}