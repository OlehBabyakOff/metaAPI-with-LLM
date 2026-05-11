import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApplyDescriptionDTO {
  @ApiProperty({
    description: 'Page-level access token from Meta',
    example: 'EAABsbCS...',
  })
  @IsOptional()
  @IsString()
  pageAccessToken!: string;
}
