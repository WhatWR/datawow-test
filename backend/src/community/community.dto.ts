import { ApiProperty } from '@nestjs/swagger';

export class CreateCommunityDto {
  @ApiProperty()
  name: string;
}
