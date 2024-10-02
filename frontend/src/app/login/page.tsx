"use client"
import React, {FormEvent, useState} from 'react';
import styles from '@/app/login//login.module.css';
import Image from 'next/image';
import Logo from '@/app/(images)/logo.png';
import { useRouter } from 'next/navigation'
import axios from 'axios';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);

        const formData = new FormData(event.currentTarget);
        const username = formData.get('username');
        console.log(username);
        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                username,
            });

            if (response.status === 200) {
                localStorage.setItem('accessToken', response.data.access_token);
                localStorage.setItem('username', response.data.username);
                router.push('/');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data.message || 'Login failed. Please try again.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2 className={styles.title}>Sign in</h2>

                    {/* Display error message if any */}
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}

                    <input
                        type="text"
                        name="username"
                        required
                        className={styles.input}
                        placeholder="Username"
                    />
                    <button type="submit" className={styles.button}>
                        Sign In
                    </button>
                </form>
            </div>

            <div className={styles.logoContainer}>
                <Image className={styles.logo} src={Logo} alt="logo" />
                <div className={styles.board}>
                    <h1 className={styles.boardTitle}>a Board</h1>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
