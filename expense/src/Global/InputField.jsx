import SelectField from "./SelectField";
import TextField from "./TextField";
import SearchField from "./SearchField";
import Error from "./Error";
   
export default function InputField({label, placeholder, id, type, error, search}){
    let ComponentToRender;
  
    switch (type) {
      case 'text':
        ComponentToRender = TextField;
        break;
      case 'select':
        ComponentToRender = SelectField;
        break;
      case 'search':
        ComponentToRender = SearchField;
        break;
      default:
        ComponentToRender = TextField;
    }
    return(
        <div className='inputFieldWrapper'>
          <ComponentToRender label={label} placeholder={placeholder} id={id} search={search}/>
          <Error msg={error}/>
        </div>
    )
}
