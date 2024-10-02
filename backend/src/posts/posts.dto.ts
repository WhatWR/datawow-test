import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  communityId: number;
}

export class UpdatePostDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  communityId?: number;
}
