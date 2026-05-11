import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class GenerateDescriptionDTO {
  @ApiPropertyOptional({
    description: 'Custom prompt for LLM. If nothing provided, a default prompt is used.',
    example: 'Write a description for your page',
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  customPrompt?: string;
}
