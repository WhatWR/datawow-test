import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const userData = { username: 'testuser' };
      const createdUser: User = {
        id: 1,
        username: 'testuser',
        createAt: new Date(),
        updateAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      const result = await usersService.createUser(userData);

      expect(result).toEqual(createdUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const username = 'testuser';
      const user: User = {
        id: 1,
        username: 'testuser',
        createAt: new Date(),
        updateAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await usersService.findOne(username);

      expect(result).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
    });

    it('should return undefined if user is not found', async () => {
      const username = 'unknownuser';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await usersService.findOne(username);

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });
});
