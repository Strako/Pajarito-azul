
import { Input } from 'antd';


export const inputOneLine = (margin:string, maxLength: number, handler: React.ChangeEventHandler<HTMLInputElement>, value: string) => {

    return (
        <>     <Input style={{ marginBottom: margin }} showCount maxLength={maxLength} onChange={handler} defaultValue={value} />
        </>
    )
}