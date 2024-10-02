import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommunityModule } from './community/community.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [AuthModule, CommunityModule, PostsModule],
})
export class AppModule {}
