import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GenerateDescriptionDTO {
  @ApiPropertyOptional({
    description: 'Custom prompt for LLM. If nothing provided, a default prompt is used.',
    example: 'Write a description for your page',
  })
  @IsOptional()
  @IsString()
  customPrompt?: string;
}
