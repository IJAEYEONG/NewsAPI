import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':userId')
  async addFavorite(
    @Param('userId', ParseIntPipe) id: number, // ParseIntPipe로 숫자 변환
    @Body() body: { title: string; url: string; description: string },
  ) {
    console.log('userId:', id); // userId가 제대로 전달되는지 확인
    return this.favoritesService.addFavorite(
      id,
      body.title,
      body.url,
      body.description,
    );
  }

  @Get(':userId')
  async getFavorites(@Param('userId', ParseIntPipe) userId: number) {
    // ParseIntPipe로 숫자 변환
    console.log('Fetching favorites for userId:', userId); // userId 확인
    return this.favoritesService.getFavoritesByUser(userId);
  }
}
