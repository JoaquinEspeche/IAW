"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const account_schema_1 = require("./schemas/account.schema");
const crypto_1 = require("crypto");
let AccountsService = class AccountsService {
    constructor(accountModel) {
        this.accountModel = accountModel;
    }
    async create(createAccountDto) {
        const existing = await this.accountModel.findOne({ email: createAccountDto.email });
        if (existing) {
            throw new common_1.ConflictException(`Account with email ${createAccountDto.email} already exists`);
        }
        const apiKey = (0, crypto_1.randomUUID)();
        const createdAccount = new this.accountModel({
            ...createAccountDto,
            apiKey,
        });
        return createdAccount.save();
    }
    async findAll() {
        return this.accountModel.find().exec();
    }
    async findOne(id) {
        const account = await this.accountModel.findById(id).exec();
        if (!account) {
            throw new common_1.NotFoundException(`Account with ID ${id} not found`);
        }
        return account;
    }
    async findByApiKey(apiKey) {
        return this.accountModel.findOne({ apiKey }).exec();
    }
    async update(id, updateAccountDto) {
        const updatedAccount = await this.accountModel
            .findByIdAndUpdate(id, updateAccountDto, { new: true })
            .exec();
        if (!updatedAccount) {
            throw new common_1.NotFoundException(`Account with ID ${id} not found`);
        }
        return updatedAccount;
    }
    async remove(id) {
        const result = await this.accountModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Account with ID ${id} not found`);
        }
        return { message: `Account ${id} deleted successfully` };
    }
    async regenerateApiKey(id) {
        const newApiKey = (0, crypto_1.randomUUID)();
        const updatedAccount = await this.accountModel
            .findByIdAndUpdate(id, { apiKey: newApiKey }, { new: true })
            .exec();
        if (!updatedAccount) {
            throw new common_1.NotFoundException(`Account with ID ${id} not found`);
        }
        return updatedAccount;
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(account_schema_1.Account.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map