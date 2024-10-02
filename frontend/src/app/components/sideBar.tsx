import React from 'react';
import Image from 'next/image';
import styles from '@/app/components/styles/sideBar.module.css';
import HomeIcon from '@/app/(images)/home.png';
import OurBlogIcon from '@/app/(images)/our-blog.png';

const Sidebar: React.FC = () => {
    return (
        <div className={styles.menu}>
            <ul className={styles.menuItems}>
                <li className={styles.menuItem}>
                    <Image className={styles.menuIcon} src={HomeIcon} alt="home"/> <span>Home</span>
                </li>
                <li className={styles.menuItem}>
                    <Image className={styles.menuIcon} src={OurBlogIcon} alt="home"/> <span>Our Blog</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
