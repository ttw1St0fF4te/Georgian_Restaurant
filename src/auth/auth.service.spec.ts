import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { UserAddress } from '../entities/user-address.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let userRoleRepository: Repository<UserRole>;
  let jwtService: JwtService;

  const mockUser = {
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    password_hash: '$2b$12$hashedpassword',
    first_name: 'Test',
    last_name: 'User',
    phone: '+1234567890',
    role_id: 3,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: null,
  };

  const mockUserRole = {
    role_id: 3,
    role_name: 'user',
    role_description: 'Regular user',
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    query: jest.fn(),
  };

  const mockUserRoleRepository = {
    findOne: jest.fn(),
  };

  const mockUserAddressRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: mockUserRoleRepository,
        },
        {
          provide: getRepositoryToken(UserAddress),
          useValue: mockUserAddressRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userRoleRepository = module.get<Repository<UserRole>>(getRepositoryToken(UserRole));
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const mockUserWithRole = { ...mockUser, role: mockUserRole };
      mockUserRepository.findOne.mockResolvedValue(mockUserWithRole);
      
      // Mock bcrypt.compare to return true
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toBeDefined();
      expect(result.password_hash).toBeUndefined();
      expect(result.username).toBe('testuser');
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const mockUserWithRole = { ...mockUser, role: mockUserRole };
      mockUserRepository.findOne.mockResolvedValue(mockUserWithRole);
      
      // Mock bcrypt.compare to return false
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data on successful login', async () => {
      const mockUserWithRole = { ...mockUser, role: mockUserRole };
      mockUserRepository.findOne.mockResolvedValue(mockUserWithRole);
      mockUserRoleRepository.findOne.mockResolvedValue(mockUserRole);
      mockUserAddressRepository.findOne.mockResolvedValue(null);
      
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.login({
        usernameOrEmail: 'testuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('testuser');
      expect(result.access_token).toBe('mock.jwt.token');
      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({
          usernameOrEmail: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        first_name: 'New',
        last_name: 'User',
        phone: '+1234567890',
      };

      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      mockUserRoleRepository.findOne.mockResolvedValue(mockUserRole);
      
      const mockCreatedUser = {
        ...mockUser,
        ...registerDto,
        user_id: '123e4567-e89b-12d3-a456-426614174001',
      };
      
      mockUserRepository.create.mockReturnValue(mockCreatedUser);
      mockUserRepository.save.mockResolvedValue(mockCreatedUser);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('status', 'success');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('newuser');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when username already exists', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'new@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
      };

      mockUserRepository.findOne.mockResolvedValueOnce(mockUser); // Username exists

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email already exists', async () => {
      const registerDto = {
        username: 'newuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // Username doesn't exist
        .mockResolvedValueOnce(mockUser); // Email exists

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile data', async () => {
      const mockUserWithRole = { ...mockUser, role: mockUserRole };
      mockUserRepository.findOne.mockResolvedValue(mockUserWithRole);
      mockUserRoleRepository.findOne.mockResolvedValue(mockUserRole);
      mockUserAddressRepository.findOne.mockResolvedValue(null);

      const result = await service.getProfile(mockUser.user_id);

      expect(result).toBeDefined();
      expect(result.username).toBe('testuser');
      expect(result.role).toBe('user');
      expect(result).not.toHaveProperty('password_hash');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteUser(mockUser.user_id);

      expect(result).toHaveProperty('status', 'success');
      expect(result.deleted_user_id).toBe(mockUser.user_id);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUser.user_id);
    });

    it('should throw BadRequestException when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUser('nonexistent-id')).rejects.toThrow();
    });
  });
});
