import { Link } from 'react-router-dom';
import Colours from "../../constants/AppColours.jsx";
import styles from "./NotFound.module.css";
import { Typography } from '@mui/material';

interface NotFoundProps {
}

const NotFound: React.FC<NotFoundProps> = () => {
    return (
        <div style={{height:'100vh', backgroundColor: Colours.dark}}>
            <div style={styles.mainContainer}>
                <div style={{width:'60%', textAlign:'center'}}>
                    <Typography variant='h1' color={Colours.txtContrast}> 404 Pagina não encontrada </Typography>
                    <Typography variant='h3' color={Colours.txtContrast}> 
                        O url que você acessou não corresponde a nenhuma pagina.  
                        <Link to="/login"> Retorne a pagina principal </Link> 
                        e continue navegando por nossa plataforma.
                
                    </Typography>
                </div>

                <img src='./HelpifyLogo.png' style={{width:'15%'}}/>
            </div>
        </div>
    )
}

export default NotFound;