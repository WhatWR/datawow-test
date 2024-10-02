"use client";
import React, { useState } from 'react';
import styles from '@/app/(components)/styles/commentForm.module.css';

interface CommentFormProps {
    onPost: (comment: string) => void;
    onCancel: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onPost, onCancel }) => {
    const [comment, setComment] = useState('');

    const handlePost = () => {
        if (comment.trim()) {
            onPost(comment);
            setComment('');
        }
    };

    return (
        <div className={styles.commentForm}>
            <div className={styles.header}>
                <h2>Post a Comment</h2>
                <button onClick={onCancel} className={styles.closeButton}>✖</button>
            </div>

            <textarea
                className={styles.textarea}
                placeholder="What’s on your mind..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <div className={styles.buttonContainer}>
                <button className={styles.cancelButton} onClick={onCancel}>
                    Cancel
                </button>
                <button className={styles.postButton} onClick={handlePost} disabled={!comment.trim()}>
                    Post
                </button>
            </div>
        </div>
    );
};

export default CommentForm;
