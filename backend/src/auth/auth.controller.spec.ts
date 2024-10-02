import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { SignInDto } from './auth.dto';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            register: jest.fn(),
          },
        },
        AuthGuard, // Ensure AuthGuard is provided
      ],
      imports: [
        JwtModule.register({
          secret: 'test-secret', // Use a test secret
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token and username on successful login', async () => {
      const signInDto: SignInDto = { username: 'testuser' };
      const access_token = 'fake-jwt-token';

      jest.spyOn(authService, 'signIn').mockResolvedValue({
        access_token,
        username: signInDto.username,
      });

      const result = await authController.signIn(signInDto);

      expect(result).toEqual({
        access_token,
        username: signInDto.username,
      });

      expect(authService.signIn).toHaveBeenCalledWith(signInDto.username);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const signInDto: SignInDto = { username: 'newuser' };
      const user: User = {
        id: 1,
        username: 'newuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'register').mockResolvedValue(user);

      const result = await authController.register(signInDto);
      expect(result).toEqual(user);
      expect(authService.register).toHaveBeenCalledWith(signInDto.username);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', () => {
      const mockRequest = { user: { id: 1, username: 'testuser' } };
      const result = authController.getProfile(mockRequest);
      expect(result).toEqual(mockRequest.user);
    });
  });
});
