import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntryEntity } from './models/blog-entry.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BlogService } from './services/blog/blog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntryEntity]),
    AuthModule,
    UserModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
