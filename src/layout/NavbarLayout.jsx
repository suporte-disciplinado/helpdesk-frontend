import Txt from '../baseComponents/Txt'

export default function NavbarLayout(props){
    return (
        <div style={pageStyle}>
            <Navbar/>
            <div style={mainStyle}>

            </div>
        </div>
    )
}

const pageStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
}
const mainStyle = {
    width: '66%',
    minHeight: '100%'
}
