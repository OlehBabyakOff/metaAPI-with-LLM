import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { GenerateDescriptionDTO } from './dto/generate-description.dto';
import { ApplyDescriptionDTO } from './dto/apply-description.dto';

@ApiTags('Pages')
@Controller('api/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all pages from database' })
  @ApiResponse({ status: 200, description: 'List of all pages' })
  getPages() {
    return this.pagesService.getPages();
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync pages from Meta Graph API to database' })
  @ApiQuery({ name: 'accessToken', required: true, description: 'Meta user access token' })
  @ApiResponse({ status: 200, description: 'Synced pages' })
  syncPages(@Query('accessToken') accessToken: string) {
    return this.pagesService.syncPages(accessToken);
  }

  @Get(':pageId')
  @ApiOperation({ summary: 'Get single page by ID' })
  @ApiParam({ name: 'pageId', description: 'Meta page ID' })
  getPage(@Param('pageId') pageId: string) {
    return this.pagesService.getPageById(pageId);
  }

  @Post(':pageId/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate page description using LLM' })
  @ApiParam({ name: 'pageId', description: 'Meta page ID' })
  @ApiBody({ type: GenerateDescriptionDTO })
  @ApiResponse({ status: 200, description: 'Generated description string' })
  generate(@Param('pageId') pageId: string, @Body() dto: GenerateDescriptionDTO) {
    return this.pagesService.generateDescription(pageId, dto);
  }

  @Post(':pageId/apply')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apply generated description to Meta page' })
  @ApiParam({ name: 'pageId', description: 'Meta page ID' })
  @ApiBody({ type: ApplyDescriptionDTO })
  @ApiResponse({ status: 200, description: 'Updated page object' })
  apply(@Param('pageId') pageId: string, @Body() dto: ApplyDescriptionDTO) {
    return this.pagesService.applyDescription(pageId, dto.pageAccessToken);
  }
}
