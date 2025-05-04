import React, { ReactNode } from 'react';
import styles from './LoginLayout.module.css';

interface HomePageLayoutProps {
  children: ReactNode;
}

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <div className={styles.home}>
        
        <div className={styles.form_login}>
            <img src="./HelpifyLogoIcon.png" style={{ width: '20%' }} alt="Helpify Logo" />
            <div className={styles.form}>{children}</div>
        </div>

        <div className={styles.decoration} >
            <div className={styles.title}>
            <img src="./HelpifyLogo.png" style={{ width: '30%' }} alt="Helpify Logo" />
        </div>
        <img src="./HelpifyLoginImage.png" style={{ width: '50%' }} alt="Ilustração de Login" />
      </div>
    </div>
  );
};

export default HomePageLayout;
