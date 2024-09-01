import SelectField from "./SelectField";
import TextField from "./TextField";
import SearchField from "./SearchField";
   
export default function InputField({label, placeholder, id, type}){
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
        <ComponentToRender label={label} placeholder={placeholder} id={id}/>
    )
}
