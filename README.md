<img width="406" alt="Screenshot 2024-09-28 at 09 54 59" src="https://github.com/user-attachments/assets/35e08865-a666-4266-bfae-6d5c0caceb94">                          

**User**:
    - Represents the individuals who interact with the platform.
    - A user can create **posts** and **comments**. This indicates a one-to-many relationship where a single user can have multiple posts and comments associated with them.
- **Post**:
    - Represents the content created by users.
    - Each post can belong to a **community** and can have multiple **comments**. This shows that a post can generate discussions and responses from other users.
    - The association with **Community** suggests that posts are categorized under specific groups or topics.
- **Comment**:
    - Represents the responses or discussions related to a specific post.
    - Comments are linked to both **Users** and **Posts**, indicating that comments are made by users on specific posts.
- **Community**:
    - Represents a group or category under which multiple posts can be organized.
    - Each community can contain multiple posts, indicating a one-to-many relationship.

<img width="714" alt="Screenshot 2024-09-28 at 09 56 12" src="https://github.com/user-attachments/assets/8760dc19-093d-41d5-a5c5-575922b00983">


- **PostModule**:
    - Responsible for handling all functionalities related to posts.
    - This module interacts with the `AuthGuard` to ensure that actions related to posts (like creating, editing, or deleting posts) are performed by authenticated users.
- **AuthGuard**:
    - Acts as a middleware that checks if a user is authenticated before allowing access to certain routes or functionalities.
    - It interacts with both the `Comment` and `Post` entities, meaning it ensures that only logged-in users can comment on or create posts.
- **AuthModule**:
    - Manages all authentication-related functionalities, such as user login, registration, and user session management.
    - This module is crucial for securing the application, ensuring that user credentials are validated and managed properly.
- **CommunityModule**:
    - Responsible for managing communities where posts are categorized.
    - This module will handle functionalities related to creating, editing, and deleting communities, as well as managing the relationships between posts and communities.
- **User**:
    - Represents the user entity, which interacts with the `AuthModule` for authentication and with the `Post` and `Comment` entities to create content.
    - This indicates that a user can create multiple posts and comments.
- **Post**:
    - Represents the post entity that users can create within communities.
    - Posts are associated with users and can have multiple comments.
- **Comment**:
    - Represents the comment entity where users can respond to posts.
    - Comments are tied to both users and posts.
- **Community**:
    - Represents the community entity under which posts can be organized.
    - Each community can have multiple posts associated with it.
