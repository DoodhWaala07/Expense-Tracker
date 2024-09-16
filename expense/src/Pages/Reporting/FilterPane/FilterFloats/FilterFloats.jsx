import { useEffect } from 'react'
import './filterFloats.css'


export default function FilterFloats({onClose, name}) {

    return(
        <div className='filterFloatWrapper'>

            <div className='filterFloatName'>{name}</div>

            {/* <div onClick = {onClose} > */}
                <span class="material-symbols-outlined" style={{cursor: 'pointer', fontSize: '15px'}} onClick = {onClose}>
                    close
                </span>
            {/* </div> */}

        </div>
    )
}

export function FilterFloatsContainer({filterFloats, setFilterFloats, onClose}) {

    function close(filter){
        setFilterFloats(prev => {
            return prev.filter((f) => {
                return ((f.ID !== filter.ID) || (f !== filter))
            })
        })

        if(onClose){
            onClose(filter)
        }
    }

    // useEffect(() => {
    //     console.log(filterFloats)
    // }, [filterFloats])

    return(
        filterFloats?.length > 0 && <div className='filterFloatsContainer'>
            {filterFloats.map((filter, i) => {
                return <FilterFloats key = {i} name = {filter?.Name || filter} onClose = {() => close(filter)}/>
            })}
        </div>
    )
}