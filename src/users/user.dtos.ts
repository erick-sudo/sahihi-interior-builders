import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsMatching } from 'src/validators/ismatching.validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'first name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'last name is required' })
  lastName: string;

  @IsPhoneNumber('KE', { message: 'a valid phone number is required' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'address is required' })
  address: string;

  @IsEmail({}, { message: 'invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'KRA pin is required' })
  kraPin: string;

  kraAttachment: string | null;

  @IsStrongPassword({ minLength: 8 }, { message: 'weak password' })
  password: string;

  @ValidateIf((o, v) => !!o.password && !!o.confirmPassword)
  @IsMatching('password', { message: 'passwords do not match' })
  confirmPassword: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'confirmPassword', 'email'] as const),
) {}

export class SignInDto {
  @IsEmail({}, { message: 'invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'a password is required' })
  password: string;
}
