import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { NewsService } from './news.service';
import { Article } from './news.service'; // Ensure Article is imported correctly

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNewsByTopic(@Query('topic') topic: string): Promise<Article[]> { // Specify return type
    if (!topic) {
      throw new HttpException('Topic query parameter is required', HttpStatus.BAD_REQUEST); // HttpStatus.BAD_REQUEST is more descriptive
    }
    return this.newsService.getNewsByTopic(topic);
  }
}
