import { ApiProperty } from '@nestjs/swagger';

export class ApplyDescriptionDTO {
  @ApiProperty({
    description: 'Page-level access token from Meta',
    example: 'EAABsbCS...',
  })
  pageAccessToken!: string;
}
