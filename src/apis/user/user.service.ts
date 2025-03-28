import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(
    email: string,
    password: string,
    phone: string,
  ): Promise<User> {
    const newUser = this.userRepository.create({ email, password, phone });
    return await this.userRepository.save(newUser);
  }
}
