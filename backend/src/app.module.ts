import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [AuthModule, CommunityModule],
})
export class AppModule {}
