import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const existing = await this.accountModel.findOne({ email: createAccountDto.email });
    if (existing) {
      throw new ConflictException(`Account with email ${createAccountDto.email} already exists`);
    }

    const apiKey = randomUUID();
    const createdAccount = new this.accountModel({
      ...createAccountDto,
      apiKey,
    });
    return createdAccount.save();
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async findByApiKey(apiKey: string): Promise<AccountDocument | null> {
    return this.accountModel.findOne({ apiKey }).exec();
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true })
      .exec();
    if (!updatedAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return updatedAccount;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.accountModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return { message: `Account ${id} deleted successfully` };
  }

  async regenerateApiKey(id: string): Promise<Account> {
    const newApiKey = randomUUID();
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(id, { apiKey: newApiKey }, { new: true })
      .exec();
    if (!updatedAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return updatedAccount;
  }
}
