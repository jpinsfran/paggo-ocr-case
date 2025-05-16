import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(email: string, password: string) {
    return prisma.user.create({ data: { email, password } });
  }
}
