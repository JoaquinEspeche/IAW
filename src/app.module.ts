import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AccountsModule } from './accounts/accounts.module';
import { SitesModule } from './sites/sites.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { DocumentsModule } from './documents/documents.module';
import { SearchModule } from './search/search.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AccountsModule,
    SitesModule,
    SnapshotsModule,
    DocumentsModule,
    SearchModule,
    SeedModule,
  ],
})
export class AppModule {}
