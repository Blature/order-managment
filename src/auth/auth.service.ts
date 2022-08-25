import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsSignInDto } from './dto/auth-credentials-signin.dto';
import { AuthCredentialsSignUpDto } from './dto/auth-credentials-signup.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('AuthService');

  signUp(authCredentials: AuthCredentialsSignUpDto): Promise<void> {
    return this.usersRepository.createUser(authCredentials);
  }

  async signIn(
    authCredentials: AuthCredentialsSignInDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentials;

    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      this.logger.verbose(`"${username}" Logged In !`);
      return { accessToken };
    } else {
      this.logger.error(
        `a User with Username => "${username}" try to SignIn But Failed `,
      );
      throw new UnauthorizedException('Please check your login credentials !');
    }
  }
}
