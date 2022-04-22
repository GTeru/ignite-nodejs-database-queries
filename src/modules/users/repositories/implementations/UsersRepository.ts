import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const users = await this.repository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.games", "games")
      .select(['user', 'games.title'])
      .where("user.id = :id", { id: user_id })
      .getOneOrFail();
    console.log(users);
    return users;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY first_name';
    return this.repository.query(query); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    first_name = this.trataFormatacaoNome(first_name);
    last_name = this.trataFormatacaoNome(last_name);

    const query = `
      SELECT * FROM users 
      WHERE first_name = '${first_name}' 
      AND last_name = '${last_name}'`;
    return this.repository.query(query); // Complete usando raw query
  }

  private trataFormatacaoNome = (name: string) => {
    const nome = name.toLowerCase();

    return nome[0].toUpperCase() + nome.substring(1);

  }
}
