import React from 'react';
import styles from '@/app/components/styles/blogCard.module.css';
import Image from 'next/image';
import Avatar from '@/app/(images)/avatar.png';
import Comment from '@/app/(images)/comment.png'

// Define the type for the BlogCard props
interface BlogCardProps {
    username: string;
    category: string;
    title: string;
    description: string;
    commentsCount: number;
    onClick: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
       username,
       category,
       title,
       description,
       commentsCount, onClick
   }) => {
    return (
        <div className={styles.cardContainer} onClick={onClick}>
            {/* Header Section */}
            <div className={styles.header}>
                <Image src={Avatar} alt={`${username}'s Avatar`} className={styles.avatar} width={30} height={30}/>
                <h4 className={styles.username}>{username}</h4>
            </div>

            {/* Body Section */}
            <div className={styles.body}>
                <div className={styles.category}>
                    {category}
                </div>
                {/*<span ></span>*/}
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
            </div>

            {/* Footer Section */}
            <div className={styles.footer}>
                <Image className={styles.commentIcon} src={Comment} alt="comment" />
                <span className={styles.comments}>{commentsCount} Comments</span>
            </div>
        </div>
    );
};

export default BlogCard;
