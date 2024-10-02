import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/auth.guard';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { CommentDto } from './comment.dto';
// import { CommentDto } from './comment.dto';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  const mockPostsService = {
    createPost: jest.fn(),
    post: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    posts: jest.fn(),
    createComment: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
  };

  const mockRequest = {
    user: {
      sub: 1, // mock user ID
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true }) // mock AuthGuard to always return true
      .compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
        communityId: 1,
      };
      mockPostsService.createPost.mockResolvedValue({
        id: 1,
        ...createPostDto,
        authorId: 1,
      });

      const result = await postsController.createPost(
        mockRequest,
        createPostDto,
      );
      expect(result).toEqual({ id: 1, ...createPostDto, authorId: 1 });
      expect(mockPostsService.createPost).toHaveBeenCalledWith({
        createPostDto,
        authorId: mockRequest.user.sub,
      });
    });

    it('should handle service errors and throw InternalServerErrorException', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
        communityId: 1,
      };
      mockPostsService.createPost.mockImplementation(() => {
        throw new Error();
      });

      await expect(
        postsController.createPost(mockRequest, createPostDto),
      ).rejects.toThrow('Failed to create posts.');
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = { title: 'Updated Post' };
      const mockPost = {
        id: 1,
        title: 'Test Post',
        authorId: 1,
        communityId: 1,
      };

      mockPostsService.post.mockResolvedValue(mockPost);
      mockPostsService.updatePost.mockResolvedValue({
        ...mockPost,
        ...updatePostDto,
      });

      const result = await postsController.updatePost(
        '1',
        updatePostDto,
        mockRequest,
      );
      expect(result).toEqual({ ...mockPost, ...updatePostDto });
      expect(mockPostsService.updatePost).toHaveBeenCalledWith(
        1,
        updatePostDto,
      );
    });

    // it('should throw ForbiddenException if user is not the author', async () => {
    //   const mockPost = {
    //     id: 1,
    //     title: 'Test Post',
    //     authorId: 2,
    //     communityId: 1,
    //   }; // Different authorId
    //
    //   mockPostsService.post.mockResolvedValue(mockPost);
    //
    //   await expect(
    //     postsController.updatePost('1', { title: 'Updated Post' }, mockRequest),
    //   ).rejects.toThrow(ForbiddenException);
    // });

    it('should throw NotFoundException if post is not found', async () => {
      mockPostsService.post.mockResolvedValue(null);

      await expect(
        postsController.updatePost('1', { title: 'Updated Post' }, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        authorId: 1,
        communityId: 1,
      };

      mockPostsService.post.mockResolvedValue(mockPost);
      mockPostsService.deletePost.mockResolvedValue(mockPost);

      const result = await postsController.deletePost('1', mockRequest);
      expect(result).toEqual(mockPost);
      expect(mockPostsService.deletePost).toHaveBeenCalledWith({ id: 1 });
    });

    // it('should throw ForbiddenException if user is not the author', async () => {
    //   const mockPost = {
    //     id: 1,
    //     title: 'Test Post',
    //     authorId: 2,
    //     communityId: 1,
    //   }; // Different authorId
    //
    //   mockPostsService.post.mockResolvedValue(mockPost);
    //
    //   await expect(
    //     postsController.deletePost('1', mockRequest),
    //   ).rejects.toThrow(ForbiddenException);
    // });

    it('should throw NotFoundException if post is not found', async () => {
      mockPostsService.post.mockResolvedValue(null);

      await expect(
        postsController.deletePost('1', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        authorId: 1,
        communityId: 1,
      };
      mockPostsService.post.mockResolvedValue(mockPost);

      const result = await postsController.getPostById('1');
      expect(result).toEqual(mockPost);
      expect(mockPostsService.post).toHaveBeenCalledWith({ id: 1 });
    });

    // it('should throw NotFoundException if post is not found', async () => {
    //   mockPostsService.post.mockResolvedValue(null);
    //
    //   await expect(postsController.getPostById('1')).rejects.toThrow(
    //     NotFoundException,
    //   );
    // });
  });

  describe('createComment', () => {
    it('should create a comment on a post', async () => {
      const commentDto: CommentDto = { text: 'Test Comment' };
      const mockComment = {
        id: 1,
        text: 'Test Comment',
        postId: 1,
        authorId: 1,
      };

      mockPostsService.createComment.mockResolvedValue(mockComment);

      const result = await postsController.createComment(
        '1',
        mockRequest,
        commentDto,
      );
      expect(result).toEqual(mockComment);
      expect(mockPostsService.createComment).toHaveBeenCalledWith(
        1,
        mockRequest.user.sub,
        commentDto,
      );
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const commentDto: CommentDto = { text: 'Updated Comment' };
      const mockComment = {
        id: 1,
        text: 'Test Comment',
        postId: 1,
        authorId: 1,
      };

      mockPostsService.updateComment.mockResolvedValue({
        ...mockComment,
        ...commentDto,
      });

      const result = await postsController.updateComment(
        '1',
        mockRequest,
        commentDto,
      );
      expect(result).toEqual({ ...mockComment, ...commentDto });
      expect(mockPostsService.updateComment).toHaveBeenCalledWith(
        1,
        mockRequest.user.sub,
        commentDto,
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const mockComment = {
        id: 1,
        text: 'Test Comment',
        postId: 1,
        authorId: 1,
      };

      mockPostsService.deleteComment.mockResolvedValue(mockComment);

      const result = await postsController.deleteComment('1', mockRequest);
      expect(result).toEqual(mockComment);
      expect(mockPostsService.deleteComment).toHaveBeenCalledWith(
        1,
        mockRequest.user.sub,
      );
    });
  });
});
