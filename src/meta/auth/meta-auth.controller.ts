import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetaAuthService } from './meta-auth.service';
import { OAuthCallbackDTO, OAuthInitResponseDTO } from './dto/oauth-callback.dto';

import type { Response } from 'express';

@ApiTags('Meta Auth')
@Controller('auth/meta')
export class MetaAuthController {
  constructor(private readonly authService: MetaAuthService) {}

  @Get('init')
  @ApiOperation({ summary: 'Initiate Meta OAuth flow' })
  @ApiResponse({ status: 200, type: OAuthInitResponseDTO })
  initiateOAuth(): OAuthInitResponseDTO {
    return this.authService.initiateOAuth();
  }

  @Get('callback')
  @ApiOperation({ summary: 'Handle Meta OAuth callback' })
  @ApiQuery({ name: 'code', required: true })
  @ApiQuery({ name: 'state', required: true })
  async handleCallback(@Query() query: OAuthCallbackDTO, @Res() res: Response): Promise<void> {
    const { accessToken } = await this.authService.handleCallback(query.code, query.state);

    res.redirect(`/?access_token=${accessToken}`);
  }
}
