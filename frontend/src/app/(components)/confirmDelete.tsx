"use client";

import React from 'react';
import styles from '@/app/(components)/styles/confirmDelete.module.css';

interface ConfirmDeleteProps {
    onDelete: () => void;
    onCancel: () => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onDelete, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Please confirm if you wish to delete the post</h2>
                <p>Are you sure you want to delete the post? Once deleted, it cannot be recovered.</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                    <button className={styles.deleteButton} onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;
