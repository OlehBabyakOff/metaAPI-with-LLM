import { Controller, Get, Query, Res } from '@nestjs/common';
import { MetaAuthService } from './meta-auth.service';
import { OAuthCallbackDTO, OAuthInitResponseDTO } from './dto/oauth-callback.dto';

import type { Response } from 'express';

@Controller('auth/meta')
export class MetaAuthController {
  constructor(private readonly authService: MetaAuthService) {}

  @Get('init')
  initiateOAuth(): OAuthInitResponseDTO {
    return this.authService.initiateOAuth();
  }

  @Get('callback')
  async handleCallback(@Query() query: OAuthCallbackDTO, @Res() res: Response): Promise<void> {
    const { accessToken } = await this.authService.handleCallback(query.code, query.state);

    res.redirect(`/?access_token=${accessToken}`);
  }
}
