import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from './schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly siteModel: Model<SiteDocument>,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    const createdSite = new this.siteModel(createSiteDto);
    return createdSite.save();
  }

  async findAll(): Promise<Site[]> {
    return this.siteModel.find().exec();
  }

  async findByAccount(accountId: string): Promise<Site[]> {
    return this.siteModel.find({ accountId }).exec();
  }

  async findOne(id: string): Promise<SiteDocument> {
    const site = await this.siteModel.findById(id).exec();
    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site> {
    const updatedSite = await this.siteModel
      .findByIdAndUpdate(id, updateSiteDto, { new: true })
      .exec();
    if (!updatedSite) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
    return updatedSite;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.siteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
    return { message: `Site ${id} deleted successfully` };
  }
}
