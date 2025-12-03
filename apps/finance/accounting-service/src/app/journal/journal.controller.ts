import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { JournalService } from './journal.service';
import { CreateJournalEntryDto } from './dto/journal.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Journal Entries')
@Controller('journal-entries')
export class JournalController {
  constructor(private readonly service: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a journal entry' })
  async create(@Body() dto: CreateJournalEntryDto) {
    return this.service.createEntry(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all journal entries' })
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }
}
