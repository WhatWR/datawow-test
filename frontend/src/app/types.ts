export interface User {
    id: number;
    username: string;

}

export interface Community {
    id: number;
    name: string;
}

export interface Comment {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    postId: number;
    userId: number;
    text: string;
}

export interface Post {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content?: string | null;
    authorId: number;
    communityId: number;
    author: User;
    community: Community;
    comments: Comment[];
}
