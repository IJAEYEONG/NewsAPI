import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorites.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addFavorite(
    id: number,
    title: string,
    url: string,
    description: string,
  ): Promise<Favorite> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const favorite = this.favoriteRepository.create({
      title,
      url,
      description,
      user,
    });
    return this.favoriteRepository.save(favorite);
  }

  async getFavoritesByUser(id: number): Promise<Favorite[]> {
    return this.favoriteRepository.find({ where: { user: { id: id } } });
  }
}
