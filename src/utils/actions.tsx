const handleInputChange = <Type extends Record<string, any>>
(
    field: keyof Type, 
    value: Type[keyof Type], 
    data: Type, 
    setData:React.Dispatch<React.SetStateAction<Type>>
) => {
    setData({...data, [field]: value});
}

export {handleInputChange};