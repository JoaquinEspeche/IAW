import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { SitesModule } from '../sites/sites.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [AccountsModule, SitesModule, DocumentsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
