"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/(lib)/axiosInstance";
import BlogCard from "@/app/(components)/blogCard";
import CommunityDropdown from "@/app/(components)/communityDropdown";
import CreatePostForm from "@/app/(components)/createPostForm";
import ConfirmDelete from "@/app/(components)/confirmDelete";
// import EditPostModal from "@/app/(components)/editPost";
import styles from "./ourblog.module.css";
import { Post } from "@/app/types";

export default function Ourblog() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [community, setCommunity] = useState<string | null>(null);
    const [postToDelete, setPostToDelete] = useState<number | null>(null); // Track which post to delete
    const [postToEdit, setPostToEdit] = useState<Post | null>(null); // Track which post to edit
    const loggedInUsername = localStorage.getItem('username');

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const fetchMyPosts = async () => {
        try {
            const username = localStorage.getItem("username");
            const response = await axiosInstance.get<Post[]>("/posts", {
                params: {
                    username: username,
                },
            });
            setPosts(response.data);
        } catch (err) {
            console.log(err);
            setError("Failed to fetch your posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const handleCreateClick = () => {
        if (isLoggedIn) {
            setShowCreateForm(true);
        } else {
            alert("You need to log in to create a post!");
        }
    };

    const handleCancel = () => {
        setShowCreateForm(false);
    };

    const handlePost = (postData: { title: string; content: string; communityId: number }) => {
        console.log("Post submitted:", postData);
        setShowCreateForm(false);
        setShowSuccessMessage(true);

        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);

        fetchMyPosts();
    };

    const navigateToPost = (id: number) => {
        router.push(`/post/${id}`);
    };

    const handleEdit = (post: Post) => {
        setPostToEdit(post); // Set the post to be edited and open the modal
    };

    const handleDelete = (postId: number) => {
        setPostToDelete(postId); // Set the post to delete and show confirmation
    };

    const confirmDelete = async () => {
        if (postToDelete !== null) {
            try {
                await axiosInstance.delete(`/posts/${postToDelete}`);
                setPosts(posts.filter(post => post.id !== postToDelete)); // Remove the deleted post from UI
                setPostToDelete(null); // Hide the delete confirmation modal
            } catch (error) {
                console.log("Failed to delete post:", error);
            }
        }
    };

    const cancelDelete = () => {
        setPostToDelete(null); // Close the confirmation modal without deleting
    };

    // const saveEditedPost = async (updatedPost: { title: string; content: string }) => {
    //     if (postToEdit) {
    //         try {
    //             const response = await axiosInstance.patch(`/posts/${postToEdit.id}`, updatedPost);
    //             setPosts(posts.map(post => (post.id === postToEdit.id ? response.data : post))); // Update the post in the list
    //             setPostToEdit(null); // Close the edit modal
    //         } catch (error) {
    //             console.log("Failed to edit post:", error);
    //         }
    //     }
    // };
    //
    // const cancelEdit = () => {
    //     setPostToEdit(null); // Close the edit modal without saving
    // };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    console.log(postToEdit)

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <input
                        type="text"
                        className={styles.searchBar}
                        placeholder="Search"
                    />
                    <CommunityDropdown
                        selectedCommunity={community ? parseInt(community) : null}
                        onSelectCommunity={(id) => setCommunity(id.toString())} // Handle community selection
                    />
                    <button className={styles.createButton} onClick={handleCreateClick}>Create +</button>
                </div>

                {/* Render Blog Cards */}
                <div className={styles.blogCards}>
                    {posts.length ? (
                        posts.map(post => (
                            <BlogCard
                                key={post.id}
                                username={post.author.username}
                                category={post.community.name}
                                title={post.title}
                                description={post.content || ""}
                                commentsCount={post.comments.length}
                                onClick={() => navigateToPost(post.id)}
                                onEdit={() => handleEdit(post)} // Pass full post to edit handler
                                onDelete={() => handleDelete(post.id)}
                                isOwner={post.author.username === loggedInUsername} />
                        ))
                    ) : (
                        <p>No posts found</p>
                    )}
                </div>

                {showCreateForm && (
                    <div className={styles.modalOverlay}>
                        <CreatePostForm onPost={handlePost} onCancel={handleCancel} />
                    </div>
                )}

                {showSuccessMessage && (
                    <div className={styles.successMessage}>
                        Post created successfully!
                    </div>
                )}

                {/* Confirmation Delete Modal */}
                {postToDelete !== null && (
                    <ConfirmDelete onDelete={confirmDelete} onCancel={cancelDelete} />
                )}

                {/* Edit Post Modal */}
                {/*{postToEdit && (*/}
                {/*    <EditPostModal*/}
                {/*        initialPostData={{ title: postToEdit.title, content: (postToEdit.content || "") , communityId: 1, id: postToEdit.id }}*/}
                {/*        onCancel={cancelEdit}*/}
                {/*    />*/}
                {/*)}*/}
            </div>
        </div>
    );
}
