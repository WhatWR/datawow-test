import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma.service';
import { PostsModule } from './posts.module';

describe('PostsModule', () => {
  let postsModule: TestingModule;

  beforeEach(async () => {
    postsModule = await Test.createTestingModule({
      imports: [PostsModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(postsModule).toBeDefined();
  });

  it('should provide PostsService and PrismaService', () => {
    const postsService = postsModule.get<PostsService>(PostsService);
    const prismaService = postsModule.get<PrismaService>(PrismaService);
    expect(postsService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should have PostsController', () => {
    const postsController = postsModule.get<PostsController>(PostsController);
    expect(postsController).toBeDefined();
  });
});
