import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ArticlesService {
  async findAll() {
    const { data } = await axios.get(`${process.env.ACSA_API_URL}/articles`);

    return data;
  }
}
