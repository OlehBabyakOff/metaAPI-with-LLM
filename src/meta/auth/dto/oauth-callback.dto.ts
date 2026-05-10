import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class OAuthCallbackDTO {
  @ApiProperty({ description: 'Authorization code from Meta' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ description: 'State parameter for CSRF protection' })
  @IsString()
  @Length(32, 32)
  state!: string;
}

export class OAuthInitResponseDTO {
  @ApiProperty({ description: 'Redirect URL to Meta OAuth page' })
  url!: string;

  @ApiProperty({ description: 'State token for CSRF protection' })
  state!: string;
}

export class TokenResponseDTO {
  @ApiProperty({ description: 'Meta access token' })
  accessToken!: string;

  @ApiProperty({ description: 'Token type' })
  tokenType!: string;
}
