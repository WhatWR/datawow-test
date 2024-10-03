"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/app/(components)/styles/sideBar.module.css';
import HomeIcon from '@/app/(images)/home.png';
import OurBlogIcon from '@/app/(images)/our-blog.png';
import Link from "next/link";
import { useRouter } from 'next/navigation';

const Sidebar: React.FC = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // State for sidebar visibility

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleProtectedRoute = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!isLoggedIn) {
            e.preventDefault(); // Prevent navigation
            alert("You need to log in to access this page!");
        } else {
            router.push(href); // Allow navigation if logged in
        }
    };

    return (
        <div className={isOpen ? `${styles.menu} ${styles.active}` : styles.menu}>
            <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Close' : 'Open'} Menu
            </button>
            <ul className={styles.menuItems}>
                <Link href={"/"}>
                    <li className={styles.menuItem}>
                        <Image className={styles.menuIcon} src={HomeIcon} alt="home" /> <span>Home</span>
                    </li>
                </Link>
                <a href="/ourblog" onClick={(e) => handleProtectedRoute(e, "/ourblog")}>
                    <li className={styles.menuItem}>
                        <Image className={styles.menuIcon} src={OurBlogIcon} alt="Our Blog" /> <span>Our Blog</span>
                    </li>
                </a>
            </ul>
        </div>
    );
};

export default Sidebar;
