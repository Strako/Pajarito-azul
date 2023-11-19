import { Input } from 'antd';
import { maxLength, rowsLength } from '../../Constants/Constants';

const inputWithSize = (handlerInput: React.ChangeEventHandler<HTMLTextAreaElement>, rows:number) =>{

const { TextArea } = Input;
return (<>
<TextArea style={{ marginBottom: "10px" }} rows={rows} placeholder={"Max length is " + maxLength} maxLength={maxLength} onChange={handlerInput} showCount={true} />
</>
)
}

export default inputWithSize;