import React from 'react';
import styles from '@/app/(components)/styles/commentCard.module.css';
import Image from "next/image";
import {StaticImport} from "next/dist/shared/lib/get-img-props";
import { timeAgo} from "@/app/(utill)/Date";

interface Comment {
    username: string;
    avatarUrl?: StaticImport;
    createdAt: Date;
    text: string;
}

const CommentCard: React.FC<Comment> = ({ username, avatarUrl, createdAt, text }) => {
    return (
        <div className={styles.commentCard}>
            {/* Avatar Section */}
            <div className={styles.avatar}>
                {avatarUrl ? (
                    <Image src={avatarUrl} alt={`${username}'s avatar`} className="avatar-img" />
                ) : (
                    <div className={styles.defaultAvatar}>
                        <i className="fas fa-user" />
                    </div>
                )}
            </div>

            {/* Comment Content Section */}
            <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                    <span className={styles.username}>{username}</span>
                    <span className={styles.timeAgo}>{timeAgo(createdAt)}</span>
                </div>

                <p className={styles.commentText}>{text}</p>
            </div>
        </div>
    );
};

export default CommentCard;
