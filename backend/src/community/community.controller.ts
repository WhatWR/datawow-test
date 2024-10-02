import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommunityService } from './community.service';
import { Community as CommunityModel } from '@prisma/client';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  async createCommunity(
    @Body() communityData: { name: string },
  ): Promise<CommunityModel> {
    return this.communityService.createCommunity(communityData);
  }

  @Get()
  async getAllCommunity(): Promise<CommunityModel[]> {
    return this.communityService.getAllCommunities();
  }

  // @Get('/:communityId')
  // async getPostsByCommunity(
  //   @Param('communityId') communityId: number,
  // ): Promise<CommunityModel[]> {
  //   return this.communityService.posts({
  //     where: { id: { equals: communityId } },
  //   });
  // }

  // Get all community
}
