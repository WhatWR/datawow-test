"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/(lib)/axiosInstance";
import BlogCard from "@/app/(components)/blogCard";
import CommunityDropdown from "@/app/(components)/communityDropdown";
import CreatePostForm from "@/app/(components)/createPostForm";
import { Post } from "@/app/types";
import styles from "./home.module.css";

export default function Home() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [community, setCommunity] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: { community?: string } = {};
            if (community) params.community = community;

            const response = await axiosInstance.get<Post[]>("/posts", { params });
            setPosts(response.data);
        } catch (err) {
            console.log(err)
            setError("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [community]);

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

        fetchPosts();
    };

    const handleCommunitySelect = (id: number) => {
        setCommunity(id.toString());
    };

    const navigateToPost = (id: number) => {
        router.push(`/post/${id}`);
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <input
                        type="text"
                        className={styles.searchBar}
                        placeholder="Search"
                        // defaultValue={search || ""}
                        // onChange={handleSearch}
                    />
                    <CommunityDropdown
                        selectedCommunity={community ? parseInt(community) : null}
                        onSelectCommunity={handleCommunitySelect} // Handle community selection
                    />
                    <button className={styles.createButton} onClick={handleCreateClick}>Create +</button>
                </div>

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
                            />
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
            </div>
        </div>
    );
}
