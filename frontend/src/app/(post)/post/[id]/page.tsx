"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import axiosInstance from "@/app/(lib)/axiosInstance"; // Import the axios instance
import styles from "./post.module.css";
import Image from "next/image";
import Avatar from "@/app/(images)/avatar.png";
import Comment from '@/app/(images)/comment.png';
import CommentCard from "@/app/(components)/commentCard";
import CommentForm from "@/app/(components)/commentForm";

interface User {
    username: string;
}
interface Comment {
    user: User;
    createdAt: Date;
    text: string;
}

interface Community {
    name: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: User;
    community: Community;
    comments: Comment[];
}

const fetchPostData = async (id: string): Promise<Post | null> => {
    try {
        const response = await axiosInstance.get<Post>(`/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post data:", error);
        return null; // Return null if there's an error or the post isn't found
    }
};

export default function PostPage({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // For success message

    // Fetch post data on mount
    useEffect(() => {
        const loadPost = async () => {
            const postData = await fetchPostData(params.id);
            if (!postData) {
                notFound();
            } else {
                setPost(postData);
            }
        };

        loadPost();
    }, [params.id]);

    // Check if user is logged in (replace this with actual login logic)
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Function to handle adding a comment
    const handleAddCommentClick = () => {
        if (isLoggedIn) {
            setShowCommentForm(true);
        } else {
            alert('You need to log in to add a comment!');
        }
    };

    // Function to handle comment post
    const handlePostComment = async (comment: string) => {
        try {
            const response = await axiosInstance.post(`/posts/${post?.id}/comment`, { text: comment });

            if (response.status === 201) {
                console.log('Comment posted:', response.data);
                setShowCommentForm(false);
                setShowSuccessMessage(true);

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

    // Function to handle comment form cancel
    const handleCancel = () => {
        setShowCommentForm(false);
    };

    if (!post) {
        return <div>loading ...</div>; // Handle loading state while the post is being fetched
    }

    return (
        <div className={styles.container}>
            <div className={styles.backButton}>
                <button onClick={() => history.back()}>&larr; Back</button>
            </div>

            <div className={styles.postHeader}>
                <Image
                    src={Avatar}
                    alt="User"
                    width={50}
                    height={50}
                    className={styles.profilePic}
                />
                <div className={styles.headerContent}>
                    <p className={styles.username}>{post.author.username}</p>
                    <p className={styles.timeAgo}>5mo. ago</p>
                </div>
            </div>

            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.postDescription}>{post.content}</p>

            <div className={styles.footer}>
                <Image className={styles.commentIcon} src={Comment} alt="comment" />
                <p className={styles.commentsCount}>{post.comments.length} Comments</p>
            </div>

            <button className={styles.addCommentButton} onClick={handleAddCommentClick}>Add Comments</button>

            {showCommentForm && (
                <div className={styles.modalOverlay}>
                    <CommentForm onPost={handlePostComment} onCancel={handleCancel} />
                </div>
            )}

            {/* Success Message Pop-Up */}
            {showSuccessMessage && (
                <div className={styles.successMessage}>
                    Comment posted successfully!
                </div>
            )}

            <div className={styles.commentsSection}>
                {post.comments.map((comment, index) => (
                    <CommentCard
                        key={index}
                        username={comment.user.username}
                        createdAt={comment.createdAt}
                        text={comment.text}
                        avatarUrl={Avatar}
                    />
                ))}
            </div>
        </div>
    );
}
