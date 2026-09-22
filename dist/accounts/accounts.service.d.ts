import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
export declare class AccountsService {
    private readonly accountModel;
    constructor(accountModel: Model<AccountDocument>);
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    findAll(): Promise<Account[]>;
    findOne(id: string): Promise<Account>;
    findByApiKey(apiKey: string): Promise<AccountDocument | null>;
    update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account>;
    remove(id: string): Promise<{
        message: string;
    }>;
    regenerateApiKey(id: string): Promise<Account>;
}
