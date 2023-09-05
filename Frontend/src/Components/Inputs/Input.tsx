import './Input.css'

interface InputI {
    type: string;
    name?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
}

const Input = ({ type, name, placeholder, value, onChange }: InputI) => {
    return (
        <div className="input-group">
            <label className="input-label">{name}</label>
            <input className="input" type={type} placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange} />
        </div>
    );


};

Input.displayName = 'Input'


export default Input