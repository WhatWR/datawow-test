"use client";
import React, { useState, useEffect } from 'react';
import CommunityDropdown from './communityDropdown';
import styles from '@/app/(components)/styles/createPostForm.module.css';
import axiosInstance from '@/app/(lib)/axiosInstance';

interface EditPostFormProps {
    initialPostData: { id: number, title: string; content: string; communityId: number };
    onUpdate: (postData: { title: string; content: string; communityId: number }) => void;
    onCancel: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ initialPostData, onUpdate, onCancel }) => {
    const [title, setTitle] = useState(initialPostData.title);
    const [content, setContent] = useState(initialPostData.content);
    const [communityId, setCommunityId] = useState<number | null>(initialPostData.communityId);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTitle(initialPostData.title);
        setContent(initialPostData.content);
        setCommunityId(initialPostData.communityId);
    }, [initialPostData]);

    const handleUpdate = async () => {
        if (title.trim() && communityId !== null) {
            try {
                const response = await axiosInstance.patch(`/posts/${initialPostData.id}`, {
                    title,
                    content,
                    communityId,
                });

                if (response.status === 200) {
                    onUpdate({ title, content, communityId });
                    setTitle('');
                    setContent('');
                    setCommunityId(null);
                } else {
                    setError('Unexpected error occurred. Please try again.');
                }
            } catch (err) {
                setError('Failed to update the post. Please try again.');
                console.error(err);
            }
        }
    };

    return (
        <div className={styles.postForm}>
            <div className={styles.header}>
                <h2>Edit Post</h2>
                <button onClick={onCancel} className={styles.closeButton}>✖</button>
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <CommunityDropdown
                selectedCommunity={communityId}
                onSelectCommunity={(id: number) => setCommunityId(id)}
            />

            <input
                type="text"
                className={styles.titleInput}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className={styles.textarea}
                placeholder="What’s on your mind..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className={styles.buttonContainer}>
                <button className={styles.cancelButton} onClick={onCancel}>
                    Cancel
                </button>
                <button className={styles.postButton} onClick={handleUpdate} disabled={!title.trim() || !communityId}>
                    Update
                </button>
            </div>
        </div>
    );
};

export default EditPostForm;
