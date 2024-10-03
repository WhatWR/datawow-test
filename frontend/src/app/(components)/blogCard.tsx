import React from 'react';
import styles from '@/app/(components)/styles/blogCard.module.css';
import Image from 'next/image';
import Avatar from '@/app/(images)/avatar.png';
import Comment from '@/app/(images)/comment.png';
import EditIcon from '@/app/(images)/edit-pen.png';
import DeleteIcon from '@/app/(images)/trash.png';

interface BlogCardProps {
    username: string;
    category: string;
    title: string;
    description: string;
    commentsCount: number;
    onClick: () => void;
    onEdit?: () => void;  // Optional, if not all blog cards have an edit button
    onDelete?: () => void; // Optional, if not all blog cards have a delete button
    isOwner: boolean;  // Whether the current user owns the post
}

const BlogCard: React.FC<BlogCardProps> = ({
                                               username,
                                               category,
                                               title,
                                               description,
                                               commentsCount,
                                               onClick,
                                               onEdit,
                                               onDelete,
                                               isOwner,
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
                <div className={styles.category}>{category}</div>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
            </div>

            {/* Footer Section */}
            <div className={styles.footer}>
                <Image className={styles.commentIcon} src={Comment} alt="comment" />
                <span className={styles.comments}>{commentsCount} Comments</span>

                {/* Show Edit and Delete icons only if the user is the owner */}
                {isOwner && (
                    <div className={styles.actions}>
                        {onEdit && (
                            <Image
                                src={EditIcon}
                                alt="Edit"
                                className={styles.actionIcon}
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent card click
                                    onEdit();  // Trigger the edit function
                                }}
                            />
                        )}
                        {onDelete && (
                            <Image
                                src={DeleteIcon}
                                alt="Delete"
                                className={styles.actionIcon}
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent card click
                                    onDelete();  // Trigger the delete function
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogCard;
