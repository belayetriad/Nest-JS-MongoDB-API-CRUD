import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto } from 'src/dto/user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { BcryptService } from 'src/services/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const user = new this.userModel(createUserDto);
    const hashedPassword = await this.bcryptService.hashPassword(password);
    user.password = hashedPassword;
    return await user.save();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }
  async findOneById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordMatch = await this.bcryptService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string): Promise<User> {
    return this.userModel.findOne({ user: userId }).exec();
  }
}
