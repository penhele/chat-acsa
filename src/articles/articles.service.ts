import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Article } from './interfaces/article.interface';

@Injectable()
export class ArticlesService {
  async findAll(): Promise<Article[]> {
    const { data } = await axios.get(`${process.env.ACSA_API_URL}/articles`);

    return data;
  }
}
