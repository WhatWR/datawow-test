import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  username: string;
}
