import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Comment, Post, Prisma } from '@prisma/client';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { CommentDto } from './comment.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
      include: {
        author: true,
        community: true,
        comments: true,
      },
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        author: true,
        community: true,
        comments: true,
      },
    });
  }

  async createPost(data: {
    createPostDto: CreatePostDto;
    authorId: number;
  }): Promise<Post> {
    try {
      return this.prisma.post.create({
        data: {
          title: data.createPostDto.title,
          content: data.createPostDto.content,
          author: {
            connect: { id: data.authorId },
          },
          community: {
            connect: { id: data.createPostDto.communityId },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Author or community not found.');
        }
        if (error.code === 'P2016') {
          throw new NotFoundException('Related record not found.');
        }
      }
      // For any other errors, return an internal server error
      throw new InternalServerErrorException(
        'An error occurred while creating the posts.',
      );
    }
  }

  async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          community: data.communityId
            ? { connect: { id: data.communityId } }
            : undefined,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Post not found.');
        }
      }
      throw new InternalServerErrorException(
        'An error occurred while updating the posts.',
      );
    }
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    try {
      return await this.prisma.post.delete({
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Post not found.');
        }
      }
      throw new InternalServerErrorException(
        'An error occurred while deleting the posts.',
      );
    }
  }

  async createComment(
    postId: number,
    userId: number,
    commentDto: CommentDto,
  ): Promise<Comment> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const { text } = commentDto;

    return this.prisma.comment.create({
      data: {
        text,
        post: {
          connect: { id: postId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async updateComment(
    commentId: number,
    userId: number,
    commentDto: CommentDto,
  ): Promise<Comment> {
    const { text } = commentDto;

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new Error('You do not have permission to update this comment');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { text },
      include: { user: true, post: true },
    });
  }

  async deleteComment(commentId: number, userId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new Error('You do not have permission to update this comment');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
      include: { user: true, post: true },
    });
  }
}
