import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { SitesModule } from '../sites/sites.module';
import { SnapshotsModule } from '../snapshots/snapshots.module';

@Module({
  imports: [AccountsModule, SitesModule, SnapshotsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
