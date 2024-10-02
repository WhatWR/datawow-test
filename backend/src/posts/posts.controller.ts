import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  Post as PostModel,
  Prisma,
  Comment as CommentModel,
} from '@prisma/client';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CommentDto } from './comment.dto';

@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createPost(
    @Request() req,
    @Body()
    createPostDto: CreatePostDto,
  ): Promise<PostModel> {
    const userId = req.user.sub;
    try {
      return this.postService.createPost({
        createPostDto,
        authorId: userId,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create posts.');
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ): Promise<PostModel> {
    const userId = req.user.sub;
    try {
      const post = await this.postService.post({ id: Number(id) });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.authorId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to update this posts.',
        );
      }

      return await this.postService.updatePost(Number(id), updatePostDto);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update post.');
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deletePost(
    @Param('id') id: string,
    @Request() req,
  ): Promise<PostModel> {
    const userId = req.user.sub;
    try {
      const post = await this.postService.post({ id: Number(id) });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.authorId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to delete this posts.',
        );
      }

      return await this.postService.deletePost({ id: Number(id) });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete post.');
    }
  }

  @Get()
  async getAllPosts(
    @Param()
    param: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.PostOrderByWithRelationInput;
    },
  ): Promise<PostModel[]> {
    const orderBy = param.orderBy || { createdAt: 'desc' };

    return this.postService.posts({
      ...param,
      orderBy,
    });
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    try {
      const post = await this.postService.post({ id: Number(id) });
      if (!post) throw new NotFoundException('Post not found');
      return post;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve post.');
    }
  }

  //BUG Community
  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'community', required: false })
  async getFilteredPosts(
    @Query('search') search?: string,
    @Query('community') community?: string,
  ): Promise<PostModel[]> {
    const where: Prisma.PostWhereInput = {
      OR: [{ title: { contains: search } }, { content: { contains: search } }],
      ...(community ? { community: { is: { name: community } } } : {}),
    };

    return this.postService.posts({ where });
  }

  @UseGuards(AuthGuard)
  @Post('/:postId/comment')
  async createComment(
    @Param('postId') postId: string,
    @Request() req,
    @Body() commentDto: CommentDto,
  ): Promise<CommentModel> {
    const userId = req.user.sub;
    return this.postService.createComment(Number(postId), userId, commentDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/:postId/comment/:commentId')
  async updateComment(
    @Param('commentId')
    commentId: string,
    @Request() req,
    @Body()
    commentDto: CommentDto,
  ): Promise<CommentModel> {
    const userId = req.user.sub; // Getting user ID from JWT
    return this.postService.updateComment(
      Number(commentId),
      userId,
      commentDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/:postId/comment/:commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Request() req, // Assuming the user info is attached to the request
  ): Promise<CommentModel> {
    const userId = req.user.sub; // Assuming req.user.sub holds the user's ID
    return this.postService.deleteComment(Number(commentId), userId);
  }
}

// posts?search=kul&community=history
// /posts?search=kul&community=history
