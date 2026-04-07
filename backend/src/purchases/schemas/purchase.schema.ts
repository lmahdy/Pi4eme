import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PurchaseStatus = 'pending' | 'received' | 'cancelled';
export type ValidationStatus = 'pending' | 'approved' | 'rejected';

@Schema({ collection: 'purchases_flat', timestamps: true })
export class Purchase {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true, index: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'Unknown' })
  supplier: string;

  @Prop({ default: '' })
  category: string;

  @Prop({ required: true })
  item: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ default: 0, min: 0 })
  unitCost: number;

  @Prop({ required: true, min: 0 })
  totalCost: number;

  @Prop({
    required: true,
    enum: ['pending', 'received', 'cancelled'],
    default: 'received',
  })
  status: PurchaseStatus;

  @Prop({ default: '' })
  notes: string;

  @Prop({
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  validationStatus: ValidationStatus;

  @Prop({ default: '' })
  rejectionNote: string;

  @Prop({ default: '' })
  invoiceRef: string;
}

export type PurchaseDocument = Purchase & Document;
export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
