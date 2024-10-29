import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class AssignProjectRolessDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  users: string[];

  @IsUUID('4')
  role: string;
}