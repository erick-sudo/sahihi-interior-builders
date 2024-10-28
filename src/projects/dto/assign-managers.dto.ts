import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class AssignManagersDto {
  @IsArray()
  @ArrayNotEmpty() // Ensures the array is not empty
  @IsUUID('4', { each: true }) // Validates each entry in the array is a UUID v4
  managers: string[];
}
