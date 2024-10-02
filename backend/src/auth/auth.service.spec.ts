import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a valid access token', async () => {
      const username = 'testuser';
      const user: User = {
        id: 1,
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the user found by the service
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      // Mock the JWT signing
      const access_token = 'fake-jwt-token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(access_token);

      const result = await authService.signIn(username);

      expect(result).toEqual({ access_token, username: user.username });
      expect(usersService.findOne).toHaveBeenCalledWith(username);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      });
    });

    it('should throw an error if user is not found', async () => {
      const username = 'unknownuser';

      // Mock the user not found scenario
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(authService.signIn(username)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(username);
    });
  });

  describe('register', () => {
    it('should create a new user and return it', async () => {
      const username = 'newuser';
      const user: User = {
        id: 2,
        username: 'newuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'createUser').mockResolvedValue(user);

      const result = await authService.register(username);

      expect(result).toEqual(user);
      expect(usersService.createUser).toHaveBeenCalledWith({ username });
    });
  });
});
