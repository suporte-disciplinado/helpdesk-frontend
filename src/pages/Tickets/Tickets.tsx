import React from "react";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import styles from './Tickets.module.css';

const Tickets: React.FC = () => {
    return(
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <Sidebar />
            </div>
        </div>
    );
};

export default Tickets;