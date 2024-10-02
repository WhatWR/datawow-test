import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Post, Comment } from '@prisma/client';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            comment: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('post', () => {
    it('should return a post if it exists', async () => {
      const post = { id: 1 } as Post;
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(post);

      const result = await service.post({ id: 1 });
      expect(result).toEqual(post);
    });

    it('should return null if post does not exist', async () => {
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      const result = await service.post({ id: 1 });
      expect(result).toBeNull();
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const post = { id: 1, title: 'Test', content: 'Content' } as Post;
      jest.spyOn(prismaService.post, 'create').mockResolvedValue(post);

      const result = await service.createPost({
        createPostDto: { title: 'Test', content: 'Content', communityId: 1 },
        authorId: 1,
      });

      expect(result).toEqual(post);
    });

    describe('updatePost', () => {
      it('should update a post', async () => {
        const post = { id: 1, title: 'Updated Title' } as Post;
        jest.spyOn(prismaService.post, 'update').mockResolvedValue(post);

        const result = await service.updatePost(1, {
          title: 'Updated Title',
          content: 'Updated Content',
        });

        expect(result).toEqual(post);
      });

      it('should throw InternalServerErrorException for unknown errors', async () => {
        jest.spyOn(prismaService.post, 'update').mockRejectedValue(new Error());

        await expect(
          service.updatePost(1, {
            title: 'Updated Title',
            content: 'Updated Content',
          }),
        ).rejects.toThrow(InternalServerErrorException);
      });
    });

    describe('deletePost', () => {
      it('should delete a post', async () => {
        const post = { id: 1, title: 'Test' } as Post;
        jest.spyOn(prismaService.post, 'delete').mockResolvedValue(post);

        const result = await service.deletePost({ id: 1 });
        expect(result).toEqual(post);
      });

      it('should throw InternalServerErrorException for unknown errors', async () => {
        jest.spyOn(prismaService.post, 'delete').mockRejectedValue(new Error());

        await expect(service.deletePost({ id: 1 })).rejects.toThrow(
          InternalServerErrorException,
        );
      });
    });

    describe('createComment', () => {
      it('should create a comment if post exists', async () => {
        const post = { id: 1 } as Post;
        const comment = { id: 1, text: 'Nice post' } as Comment;
        jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(post);
        jest.spyOn(prismaService.comment, 'create').mockResolvedValue(comment);

        const result = await service.createComment(1, 1, { text: 'Nice post' });
        expect(result).toEqual(comment);
      });

      it('should throw NotFoundException if post does not exist', async () => {
        jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

        await expect(
          service.createComment(1, 1, { text: 'Nice post' }),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
});
