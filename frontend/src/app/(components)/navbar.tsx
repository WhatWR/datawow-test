"use client"
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/app/(lib)/axiosInstance';
import styles from '@/app/(components)/styles/navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Avatar from '@/app/(images)/avatar.png';

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/auth/profile');
                setUsername(response.data.username);
                setIsLoggedIn(true);
            } catch (error) {
                console.log(error);
                setIsLoggedIn(false); // Handle error (e.g., user not logged in)
            }
        };

        fetchUserData();
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <span>a Board</span>
            </div>

            <div className={styles.userSection}>
                {isLoggedIn ? (
                    <div className={styles.userInfo}>
                        <span className={styles.username}>{username}</span>
                        <Image className={styles.avatar} src={Avatar} alt="User Avatar" width={40} height={40} />
                    </div>
                ) : (
                    <div className={styles.signInContainer}>
                        <Link href="/login">
                            <button className={styles.signInButton}>Sign In</button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
