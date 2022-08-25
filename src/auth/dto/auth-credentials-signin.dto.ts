import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsSignInDto {
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MinLength(8)
  @MaxLength(32)
  @IsString()
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too Weak, Try again with Stronger one !',
  })
  password: string;
}
