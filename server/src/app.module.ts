import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsController } from './news/news.controller';
import { NewsService } from './news/news.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { FavoritesModule } from './favorites/favorites.module'; // FavoritesModule import
import { Favorite } from './favorites/favorites.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '0000',
      database: 'news',
      entities: [User, Favorite],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    FavoritesModule, // 즐겨찾기 모듈 추가
  ],
  controllers: [AppController, NewsController],
  providers: [AppService, NewsService],
})
export class AppModule {}
