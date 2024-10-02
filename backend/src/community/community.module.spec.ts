import { Test, TestingModule } from '@nestjs/testing';
import { CommunityModule } from './community.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { PrismaService } from '../prisma.service';

describe('CommunityModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CommunityModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have CommunityService as a provider', () => {
    const communityService = module.get<CommunityService>(CommunityService);
    expect(communityService).toBeDefined();
  });

  it('should have PrismaService as a provider', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should have CommunityController as a controller', () => {
    const communityController =
      module.get<CommunityController>(CommunityController);
    expect(communityController).toBeDefined();
  });
});
