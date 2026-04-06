import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier, SupplierDocument } from '../auth/schemas/supplier.schema';
import { CreateSupplierDto } from '../company/dto/create-supplier.dto';
import { UpdateSupplierDto } from '../company/dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private readonly supplierModel: Model<SupplierDocument>,
  ) {}

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    return this.supplierModel.create(dto);
  }

  async findAll(companyId: string): Promise<Supplier[]> {
    return this.supplierModel
      .find({ companyId })
      .populate('companyId')
      .exec();
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierModel
      .findById(id)
      .populate('companyId')
      .exec();
    if (!supplier) throw new NotFoundException(`Supplier #${id} not found`);
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    const updated = await this.supplierModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Supplier #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.supplierModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Supplier #${id} not found`);
  }

  async findByName(name: string): Promise<Supplier | null> {
    return this.supplierModel.findOne({ name: { $regex: new RegExp(name, 'i') } }).exec();
  }

  async deleteByName(name: string): Promise<void> {
    const supplier = await this.findByName(name);
    if (!supplier) {
      throw new NotFoundException(`Supplier with name "${name}" not found`);
    }
    await this.supplierModel.findByIdAndDelete(supplier._id).exec();
  }
}