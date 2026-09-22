import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './schemas/account.schema';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    findAll(): Promise<Account[]>;
    findOne(id: string): Promise<Account>;
    update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account>;
    remove(id: string): Promise<{
        message: string;
    }>;
    regenerateApiKey(id: string): Promise<Account>;
}
