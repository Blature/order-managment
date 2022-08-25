import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsSignUpDto } from './dto/auth-credentials-signup.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger(`UsersRepository`);
  async createUser(authCredentials: AuthCredentialsSignUpDto): Promise<void> {
    const { firstName, lastName, age, username, password } = authCredentials;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      firstName,
      lastName,
      age,
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
      this.logger.verbose(
        `User With ID => ${user.id} and Name => "${firstName} ${lastName}" just Created !`,
      );
    } catch (err) {
      if (err.code === '23505') {
        this.logger.error(`"${username}" already Exist!`);
        throw new ConflictException(`"${username}" already Exist!`);
      }
      this.logger.error(`Something Went Wrong! (Error => ${err.message})`);
      throw new InternalServerErrorException(`Something Went Wrong!)`);
    }
  }
}
