"use client";
import React, { useEffect, useState } from "react";
import BlogCard from "@/app/components/blogCard";
import CommunityDropdown from "@/app/components/communityDropdown";
import styles from "./home.module.css";
import CreatePostForm from "@/app/components/createPostForm";

export default function Home() {
    const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state for success pop-up
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }
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
        // Simulate successful post submission
        console.log("Post submitted:", postData);
        setShowCreateForm(false);
        setShowSuccessMessage(true); // Show success message

        // Hide success message after 3 seconds
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    // Search

    // fectch post

    return (
        <div className={styles.container}>

            {/* Main Content */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <input type="text" className={styles.searchBar} placeholder="Search" />
                    <CommunityDropdown
                        selectedCommunity={selectedCommunity}
                        onSelectCommunity={(id) => setSelectedCommunity(id)}
                    />
                    <button className={styles.createButton} onClick={handleCreateClick}>Create +</button>
                </div>

                {/* Blog Cards */}
                <div className={styles.blogCards}>
                    <BlogCard
                        username="Wittawat"
                        category="History"
                        title="The Beginning of the End of the World"
                        description="The afterlife sitcom The Good Place comes to its culmination, the show’s two protagonists, Eleanor and Chidi, contemplate their future..dfjsdsdkvfkdbmdfbmsobmsfokmbvdfomvdofmvsomvkvdafjbndfobndobidbiodn."
                        commentsCount={32}
                    />
                    <BlogCard
                        username="Zach"
                        category="History"
                        title="The Big Short War"
                        description="Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate..."
                        commentsCount={4}
                    />
                    <BlogCard
                        username="Nicholas"
                        category="Exercise"
                        title="The Mental Health Benefits of Exercise"
                        description="You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression..."
                        commentsCount={32}
                    />
                    <BlogCard
                        username="Carl"
                        category="History"
                        title="What Makes a Man Betray His Country?"
                        description="The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy..."
                        commentsCount={10}
                    />
                </div>

                {/* Conditional Rendering of the Create Post Form */}
                {showCreateForm && (
                    <div className={styles.modalOverlay}>
                        <CreatePostForm
                            onPost={handlePost}
                            onCancel={handleCancel}
                        />
                    </div>
                )}

                {/* Success Message Pop-Up */}
                {showSuccessMessage && (
                    <div className={styles.successMessage}>
                        Post created successfully!
                    </div>
                )}
            </div>
        </div>
    );
}
