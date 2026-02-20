import { Controller, Get, Param, Post, Body, UseGuards, Patch, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    @Get()
    @Roles(UserRole.Admin)
    async getAllUsers() {
        return this.userModel.find({}, { passwordHash: 0 }).exec();
    }

    @Patch(':id/status')
    @Roles(UserRole.Admin)
    async toggleStatus(@Param('id') id: string, @Body('status') status: 'active' | 'inactive') {
        return this.userModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }

    @Delete(':id')
    @Roles(UserRole.Admin)
    async deleteUser(@Param('id') id: string) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
