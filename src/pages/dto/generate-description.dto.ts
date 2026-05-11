import { ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateDescriptionDTO {
  @ApiPropertyOptional({
    description: 'Custom prompt for LLM. If nothing provided, a default prompt is used.',
    example: 'Write a description for your page',
  })
  customPrompt?: string;

  @ApiPropertyOptional({
    description: 'LLM provider to use',
    enum: ['openai', 'anthropic'],
    example: 'openai',
  })
  provider?: string;
}
