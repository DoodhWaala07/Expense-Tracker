import './noteFilter.css'
import { useEffect, useState, useContext } from 'react'
import {FilterPaneElement} from '../FilterPane'
import MyForm from '../../../../Global/Form/MyForm'
import InputField from '../../../../Global/InputField'
import FilterFloats, { FilterFloatsContainer } from '../FilterFloats/FilterFloats'
import {ViewExpensesContext} from '../../ViewExpenses'

export default function NoteFilter() {
    const {noteFields, setNoteFields, filterFloats, setFilterFloats, subCatFilterFloats, setSubCatFilterFloats} = useContext(ViewExpensesContext)

    return (
        <FilterPaneElement url = '/addCategory' text = 'Description'>
            <MyForm fields = {noteFields} setFields = {setNoteFields}>
                {Object.entries(noteFields).map(([key, field], i) => {
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