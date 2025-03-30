import React from "react";
import { Link, useLocation } from "react-router-dom";

import styles from './Sidebar.module.css';
import Txt from '../../baseComponents/Txt.jsx';

import { Avatar } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.personalInfo}>
                <Avatar
                    src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    sx={{ width: "3.5rem", height: "3.5rem" }}
                />
                <div className={styles.greetings}>
                    <Txt>Bem vindo (a)</Txt>
                    <strong>Victor H. Watanabe</strong>
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
                            to="/notifications"
                            className={location.pathname === "/notifications" ? styles.active : ""}
                        >
                            <NotificationsIcon sx={{ fontSize: "1.8rem" }} />
                            <Txt>Notificações</Txt>
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
                            className={location.pathname === "#" ? styles.active : ""}
                        >
                            <ToggleOffOutlinedIcon sx={{ fontSize: "1.8rem" }} />
                            <Txt>Tema escuro</Txt>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/login"
                            className={location.pathname === "/notifications" ? styles.active : ""}
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