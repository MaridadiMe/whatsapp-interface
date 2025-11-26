import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Business } from '../entities/business.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class BusinessRepository extends BaseRepository<Business> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource, Business);
  }
}
