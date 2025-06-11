import React from "react";
import { Link, useLocation } from "react-router-dom";

import styles from './Sidebar.module.css';
import Txt from '../../baseComponents/Txt.jsx';

import { Avatar } from "@mui/material";

import PersonIcon from '@mui/icons-material/Person';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LogoutIcon from '@mui/icons-material/Logout';
import TableRowsIcon from '@mui/icons-material/TableRows';
import PeopleIcon from '@mui/icons-material/People';

const Sidebar: React.FC = () => {
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("serviceToken");
        localStorage.removeItem("name");
        window.location.pathname = "/login";
    }

    function stringAvatar(name: string) {
        const nameParts = name.split(' ');
        return {
            children: nameParts.length > 1 
                ? `${nameParts[0][0]}${nameParts[1][0]}`
                : nameParts[0][0],
        };
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.personalInfo}>
                <Avatar
                    //src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    {...stringAvatar(localStorage.getItem("name") || '')} 
                    sx={{ width: "3.5rem", height: "3.5rem" }}
                />
                <div className={styles.greetings}>
                    <Txt>Bem vindo (a)</Txt>
                    <strong>{localStorage.getItem("name")}</strong>
                </div>
            </div>
            <hr />
            <div className={styles.mainOptions}>
                <ul>
                    <li>
                        <Link
                            to="/profile"
                            className={location.pathname === "/profile" ? styles.active : ""}
                        >
                            <PersonIcon sx={{ fontSize: "1.8rem" }} />
                            <Txt>Perfil</Txt>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/tickets"
                            className={location.pathname === "/tickets" ? styles.active : ""}
                        >
                            <HeadsetMicIcon sx={{ fontSize: "1.8rem" }} />
                            <Txt>Chamados</Txt>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/tables"
                            className={location.pathname === "/tables" ? styles.active : ""}
                        >
                            <TableRowsIcon sx={{ fontSize: "1.8rem" }} />
                            <Txt>Tabelas</Txt>
                        </Link>
                    </li>
                </ul>
            </div>
            <hr />
            <div className={styles.mainOptions}>
                <ul>
                    <li>
                        <Link
                            to="/users"
                            className={location.pathname === "/users" ? styles.active : ""}
                        >
                             <PeopleIcon sx={{ fontSize: "1.8rem" }} />
                             <Txt>Usuários</Txt>
                        </Link>
                    </li>
                </ul>
            </div>
            <hr />
            <div className={styles.mainOptions}>
                <ul>
                    <li>
                        <Link
                            to="#"
                            onClick={logout} 
                            className={location.pathname === "#" ? styles.active : ""}
                        >
                            <LogoutIcon sx={{ fontSize: "1.8rem" }} />
                            <Txt>Sair</Txt>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;