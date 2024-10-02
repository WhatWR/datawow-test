import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      // Mock the $connect method
      const connectSpy = jest
        .spyOn(prismaService, '$connect')
        .mockResolvedValue(undefined);

      await prismaService.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
    });
  });
});
