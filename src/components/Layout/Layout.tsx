import React from "react";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

import styles from "./Layout.module.css";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <Sidebar />
                <main className={styles.main}>
                    <div className={styles.card}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
