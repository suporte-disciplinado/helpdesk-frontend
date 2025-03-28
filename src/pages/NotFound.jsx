import Txt from '../baseComponents/Txt'
import { Link } from 'react-router-dom'
import Colours from '../constants/AppColours'

export default function NotFound(props){
    return (
        <div style={{height:'100vh', backgroundColor: Colours.dark}}>

            <div style={pageStyle}>
                <div style={{width:'60%', textAlign:'center'}}>
                    <Txt h1 contrast> 404 Pagina não encontrada </Txt>
                    <Txt h3 contrast> 
                        O url que você acessou não corresponde a nenhuma pagina.  
                        <Link to="/login"> Retorne a pagina principal </Link> 
                        e continue navegando por nossa plataforma.
                
                    </Txt>
                </div>

                <img src='./HelpifyLogo.png' style={{width:'15%'}}/>
            </div>
        </div>
    )
}

const pageStyle = {
    height: '80%',
    padding: '40px',
    paddingBottom: '0px',

    display:'flex', 
    flexDirection:'column', 
    alignItems:'center',
    justifyContent: 'space-between', 
}