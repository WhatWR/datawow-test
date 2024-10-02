import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Community, Prisma } from '@prisma/client';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async createCommunity(data: Prisma.CommunityCreateInput): Promise<Community> {
    return this.prisma.community.create({
      data,
    });
  }

  // async posts(params: {
  //   where?: Prisma.CommunityWhereInput;
  // }): Promise<Community[]> {
  //   const { where } = params;
  //   // return this.prisma.community.findMany({
  //   //   where,
  //   // });
  //   return this.prisma.community.findMany({
  //     include: {
  //       posts: true,
  //     },
  //     where,
  //   });
  // }
}
