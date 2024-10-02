"use client";
import React, { useState } from 'react';
import CommunityDropdown from './communityDropdown';
import styles from '@/app/(components)/styles/createPostForm.module.css';
import axiosInstance from '@/app/(lib)/axiosInstance';

interface CreatePostFormProps {
    onPost: (postData: { title: string; content: string; communityId: number }) => void;
    onCancel: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPost, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [communityId, setCommunityId] = useState<number | null>(null); // Manage communityId
    const [error, setError] = useState<string | null>(null);

    const handlePost = async () => {
        if (title.trim() && communityId !== null) {
            try {
                const response = await axiosInstance.post('/posts', {
                    title,
                    content,
                    communityId,
                });

                if (response.status === 201) {
                    onPost({ title, content, communityId });
                    setTitle('');
                    setContent('');
                    setCommunityId(null);
                } else {
                    // Handle unexpected status codes
                    setError('Unexpected error occurred. Please try again.');
                }
            } catch (err) {
                // Handle errors during the POST request
                setError('Failed to create the post. Please try again.');
                console.error(err);
            }
        }
    };

    return (
        <div className={styles.postForm}>
            <div className={styles.header}>
                <h2>Create Post</h2>
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
                <button className={styles.postButton} onClick={handlePost} disabled={!title.trim() || !communityId}>
                    Post
                </button>
            </div>
        </div>
    );
};

export default CreatePostForm;
