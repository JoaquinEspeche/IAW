import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import {
  ExtractedDocument,
  ExtractedDocumentSchema,
} from './schemas/extracted-document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExtractedDocument.name, schema: ExtractedDocumentSchema },
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
