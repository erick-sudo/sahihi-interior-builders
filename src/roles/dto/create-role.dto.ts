import { IsUppercase, Matches, MinLength } from 'class-validator';

export class CreateRoleDto {
  @MinLength(6)
  @IsUppercase()
  @Matches(/^ROLE_/, { message: 'Field must start with ROLE_ prefix' })
  name: string;
}
