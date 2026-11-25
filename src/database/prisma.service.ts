import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// [LOCAL] Conexão com o banco SQLite (arquivo dev.db) através do Prisma
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? 'file:./dev.db',
    });
    super({ adapter });
  }
}
