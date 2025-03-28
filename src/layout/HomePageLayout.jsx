import Txt from '../baseComponents/Txt'
import Colours from '../constants/AppColours'

export default function HomePageLayout(props){
    return (
        <div style={homeStyle}>
            <div style={formStyle}>
                {props.children}
            </div>

            <div style={decorationStyle}>

                <div style={titleStyle}>
                    <img src='./HelpifyLogo.png' style={{width:'30%'}}/>

                    <Txt h2 light contrast>
                        Todas as 
                        <Txt span style={{color: Colours.highlight}}> soluções </Txt>
                        em um só lugar.
                    </Txt>
                </div>

                <img src='./HelpifyLoginImage.png' style={{width:'60%'}}/>
            </div>

        </div>
    )
}

const homeStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
}

const formStyle = {
    width: '33vw',
    minWidth: '450px',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}

const decorationStyle = {
    backgroundColor: Colours.dark,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    
    height: '100vh',
    overflow: 'hidden',

}

const titleStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    
    marginBottom: '30px',
    marginTop: '15px',
}