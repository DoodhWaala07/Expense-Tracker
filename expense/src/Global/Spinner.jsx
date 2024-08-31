import './ui.css'

export default function Spinner({size, thickness}){
    // let border = thickness
    return(
        <div className='spinner' style={{width: size, height: size, borderWidth: thickness}}></div>
    )
}