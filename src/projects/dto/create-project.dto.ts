import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'project name is required' })
  name: string;

  @IsNotEmpty({ message: 'project description is required' })
  @MaxLength(75, { message: 'use at most 500 characters' })
  description: string | null;
}
