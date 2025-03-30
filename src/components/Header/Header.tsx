import React from "react";
import styles from './Header.module.css';
import helpifyLogo from '../../../public/HelpifyLogo.png'

const Header: React.FC = () => {
    return(
        <header className={styles.header}>
            <img src={helpifyLogo} alt="Logotipo Helpify" />
        </header>
    );
};

export default Header;