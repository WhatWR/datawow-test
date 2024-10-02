import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from './community.service';
import { PrismaService } from '../prisma.service';
import { Community } from '@prisma/client';

describe('CommunityService', () => {
  let communityService: CommunityService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        {
          provide: PrismaService,
          useValue: {
            community: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    communityService = moduleRef.get<CommunityService>(CommunityService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(communityService).toBeDefined();
  });

  describe('createCommunity', () => {
    it('should create a new community and return it', async () => {
      const communityData = { name: 'Test Community' };
      const createdCommunity: Community = {
        id: 1,
        name: 'Test Community',
      };

      jest
        .spyOn(prismaService.community, 'create')
        .mockResolvedValue(createdCommunity);

      const result = await communityService.createCommunity(communityData);

      expect(result).toEqual(createdCommunity);
      expect(prismaService.community.create).toHaveBeenCalledWith({
        data: communityData,
      });
    });
  });

  describe('getAllCommunities', () => {
    it('should return an array of communities', async () => {
      const communities: Community[] = [
        { id: 1, name: 'Community 1' },
        { id: 2, name: 'Community 2' },
      ];

      jest
        .spyOn(prismaService.community, 'findMany')
        .mockResolvedValue(communities);

      const result = await communityService.getAllCommunities();

      expect(result).toEqual(communities);
      expect(prismaService.community.findMany).toHaveBeenCalled();
    });
  });
});
