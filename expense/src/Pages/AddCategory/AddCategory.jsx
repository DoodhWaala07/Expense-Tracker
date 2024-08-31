import './addCategory.css'
import InputField from '../../Global/SelectField'
import MyForm from '../../Global/Form/MyForm'
const FormContext = createContext()

export default function AddCategory() {
    const [categoryFields, setCategoryFields] = useState({
        'Category': {value: '', placeholder: '', type: 'text'},
        'Sub-Category': {value: '', placeholder: '', type: 'search'},
    })
    return (
        <div classname = 'addCat-main'>
            <MyForm fields={categoryFields} setFields={setCategoryFields}>
                {/* <InputField label='Category' placeholder='Category'/> */}
                {Object.entries(categoryFields).map(([key, value], i) => {
                    return <InputField key={i} label={value.label || key} placeholder={value.placeholder || key} type={value.type}/>
                }
                )}
            </MyForm>
        </div>
    )
}