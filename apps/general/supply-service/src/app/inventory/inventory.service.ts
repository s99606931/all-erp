import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, itemName: string, minQuantity: number) {
    return this.prisma.inventory.create({
      data: {
        tenantId,
        itemName,
        minQuantity: new Prisma.Decimal(minQuantity),
      },
    });
  }

  async recordTransaction(inventoryId: string, type: 'IN' | 'OUT', quantity: number, date: string) {
    const inventory = await this.prisma.inventory.findUnique({ where: { id: inventoryId } });
    if (!inventory) throw new Error('Inventory not found');

    const delta = new Prisma.Decimal(quantity);
    const newQuantity = type === 'IN' ? inventory.quantity.add(delta) : inventory.quantity.sub(delta);

    if (newQuantity.lessThan(0)) {
      throw new BadRequestException('Insufficient inventory: cannot go negative');
    }

    await this.prisma.inventoryTransaction.create({
      data: {
        inventoryId,
        type,
        quantity: delta,
        date: new Date(date),
      },
    });

    return this.prisma.inventory.update({
      where: { id: inventoryId },
      data: { quantity: newQuantity },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.inventory.findMany({
      where: { tenantId },
      include: { transactions: true },
    });
  }
}
