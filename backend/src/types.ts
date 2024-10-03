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
  createdAt: string;
  text: string;
  user: User;
}

export interface Post {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  author: User;
  community: Community;
  comments: Comment[];
}
