import Colours from "../constants/AppColours"

/**
 * Componente simples de texto para padronizar a formatação
 * 
 * @param contrast - Aplica a cor alternativa de texto
 * @param heading - Aplica o nivel de heading especificado [`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `span`]
 * @param weight - Aplica o nivel de negrito especificado [`black`, `bold`, `regular`, `light`, `thin`]
 * @param style - Outras configurações de estilo para aplicar ao componente   **Ex :** `{ padding: '2px', margin: '3px' }`
 */
export default function Txt(props){
    let base = (
        <span 
            style={getStyle(props)}
            className={getClassName(props)}
            >
            {props.children}
        </span>
    )

    let component = 
         props.h1? (<h1> {base} </h1> )
        :props.h2? (<h2> {base} </h2> )
        :props.h3? (<h3> {base} </h3> )
        :props.h4? (<h4> {base} </h4> )
        :props.h5? (<h5> {base} </h5> )
        :props.h6? (<h6> {base} </h6> )
        :props.span? base
        : (<p> {base} </p> );


    return component;
}

const getStyle = (props) => {
    let colour = props.contrast? Colours.txtContrast : Colours.txt
    console.log("contrast : ", props.contrast)
    let size = props.size;
    return {
        display: 'inline',
        color : colour,
        fontSize: size,
        ...props.style
    }
}

const getClassName = (props) => {
    var weight = 
        props.black? 'black'
        :props.bold? 'bold'
        :props.b? 'bold'
        :props.regular? 'regular'
        :props.light? 'light'
        :props.thin? 'thin'
        : 'regular'

    var italic = props.italic || props.i? true : false

    return "lato-"+ weight + (italic? '-italic' : '');
}