import { Test, TestingModule } from '@nestjs/testing';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Community } from '@prisma/client';

describe('CommunityController', () => {
  let communityController: CommunityController;
  let communityService: CommunityService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CommunityController],
      providers: [
        {
          provide: CommunityService,
          useValue: {
            createCommunity: jest.fn(),
            getAllCommunities: jest.fn(), // Add the missing mock for getAllCommunities
          },
        },
      ],
    }).compile();

    communityController =
      moduleRef.get<CommunityController>(CommunityController);
    communityService = moduleRef.get<CommunityService>(CommunityService);
  });

  it('should be defined', () => {
    expect(communityController).toBeDefined();
  });

  describe('createCommunity', () => {
    it('should create a new community and return it', async () => {
      const communityData = { name: 'Test Community' };
      const createdCommunity: Community = {
        id: 1,
        name: 'Test Community',
      };

      jest
        .spyOn(communityService, 'createCommunity')
        .mockResolvedValue(createdCommunity);

      const result = await communityController.createCommunity(communityData);

      expect(result).toEqual(createdCommunity);
      expect(communityService.createCommunity).toHaveBeenCalledWith(
        communityData,
      );
    });
  });

  describe('getAllCommunity', () => {
    it('should return an array of communities', async () => {
      const communities: Community[] = [
        { id: 1, name: 'Community 1' },
        { id: 2, name: 'Community 2' },
      ];

      // Mocking the service method
      jest
        .spyOn(communityService, 'getAllCommunities')
        .mockResolvedValue(communities);

      const result = await communityController.getAllCommunity();

      expect(result).toEqual(communities);
      expect(communityService.getAllCommunities).toHaveBeenCalled();
    });
  });
});
