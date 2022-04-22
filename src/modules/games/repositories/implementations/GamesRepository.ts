import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { UsersRepository } from '../../../users/repositories/implementations/UsersRepository';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games')
      .where(`title ilike '%${param}%'`)
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const query = 'SELECT COUNT(1) FROM games';

    return await this.repository.query(query);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const query = await this.repository.createQueryBuilder('game')
      .innerJoin('game.users', 'user')
      .select(['game', 'user'])
      .where(`game.id = '${id}'`)

    const games = await query.getMany();

    let users: User[] = []
    games.forEach(game => {
      game.users.forEach(user => {
        if (!users.find(u => u.id == user.id)) {
          users.push(user);
        }
      });
    });

    return users;
  }
}
