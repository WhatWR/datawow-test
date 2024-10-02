"use client";
import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import BlogCard from "@/app/components/blogCard";
import CommunityDropdown from "@/app/components/communityDropdown";
import CreatePostForm from "@/app/components/createPostForm";
import { Post } from "@/app/types";
import { debounce } from "@/app/lib/debounce";
import styles from "./home.module.css";

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsLoggedIn(true);
        }
        // Fetch posts on component mount
        fetchPosts();
    }, []);

    const fetchPosts = async (search = "", communityId: string | null = null) => {
        try {
            const params: { search?: string; community?: string } = {};
            if (search) params.search = search;
            if (communityId) params.community = communityId;

            const response = await axiosInstance.get<Post[]>("/posts", { params });
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const debouncedFetchPosts = useCallback(
        debounce((search: string, communityId: string | null) => {
            fetchPosts(search, communityId);
        }, 300),
        [] // Dependencies array
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 2) {
            debouncedFetchPosts(value, selectedCommunity?.toString() ?? null);
        } else if (value.length === 0) {
            fetchPosts();
        }
    };

    const handleCommunitySelect = (id: number) => {
        setSelectedCommunity(id);
        fetchPosts(searchTerm, id.toString());
    };

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

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <input
                        type="text"
                        className={styles.searchBar}
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <CommunityDropdown
                        selectedCommunity={selectedCommunity}
                        onSelectCommunity={handleCommunitySelect}
                    />
                    <button className={styles.createButton} onClick={handleCreateClick}>Create +</button>
                </div>

                <div className={styles.blogCards}>
                    {posts.map(post => (
                        <BlogCard
                            key={post.id}
                            username={post.author.username}
                            category={post.community.name}
                            title={post.title}
                            description={post.content || ""}
                            commentsCount={post.comments.length}
                        />
                    ))}
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
