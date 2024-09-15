import { useEffect, useState, useContext } from 'react'
import {FilterPaneElement} from './FilterPane'
import MyForm from '../../../Global/Form/MyForm'
import InputField from '../../../Global/InputField'
import FilterFloats, { FilterFloatsContainer } from './FilterFloats/FilterFloats'
import {ViewExpensesContext} from '../ViewExpenses'

export default function CategoryFilter() {

    const {categoryFields, setCategoryFields, filterFloats, setFilterFloats, subCatFilterFloats, setSubCatFilterFloats} = useContext(ViewExpensesContext)

    useEffect(() => {
        let category = categoryFields['Category'].value
        console.log(filterFloats)
        console.log(category)
        if(category  && !filterFloats.find(filter => (filter.ID === category.ID) || (filter === category))){
            setFilterFloats(prev => [...prev, category])
        }
        if(category){
            setCategoryFields(prev => {
                return {...prev, ['Category']: {...prev['Category'], value : ''}}
            })
        }
    }, [categoryFields['Category'].value])

    useEffect(() => {
        let subCategory = categoryFields['Sub_Category'].value
        if(subCategory && !subCatFilterFloats.find(filter => (filter.ID === subCategory.ID) || (filter === subCategory))){
            setSubCatFilterFloats(prev => [...prev, subCategory])
        }
        if(subCategory){
            setCategoryFields(prev => {
                return {...prev, ['Sub_Category']: {...prev['Sub_Category'], value : ''}}
            })
        }
    }, [categoryFields['Sub_Category'].value])

    useEffect(() => {
        console.log(filterFloats)
        console.log(subCatFilterFloats)
    }, [filterFloats])

    return (
        <FilterPaneElement url = '/addCategory' text = 'Category'>
            <MyForm fields = {categoryFields} setFields = {setCategoryFields}>
                {Object.entries(categoryFields).map(([key, field], i) => {
                    return (
                    <>
                        <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} 
                        type = {field.type} ref = {field.ref} error={field.error} className={field.className}/>
                        <FilterFloatsContainer filterFloats = {field.floats} setFilterFloats = {field.setFloats} onClose = {field.onClose || null}/>
                    </>
                    )
                })}
            </MyForm>
            {/* <FilterFloats name = 'Category'/> */}
        </FilterPaneElement>
        // <div></div>
    )
}