import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User, UserSchema } from 'src/schemas/user.schema';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      // secret: process.env.JWT_SECRET, // Replace with your own secret key
      secret: 'process.env.JWT_SECRET', // Replace with your own secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, BcryptService],
  exports: [UserService],
})
export class UserModule {}
