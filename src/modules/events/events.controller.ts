import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { user_role } from '../users/entities/user.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(user_role.ADMIN)

  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(user_role.ADMIN)

  findAll() {
    return this.eventsService.findAll();
  }
  @Get('upcoming')
findUpcoming() {
  return this.eventsService.findUpcoming();
}
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(user_role.ADMIN)

  update(@Param('id') id: number, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
 @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(user_role.ADMIN)
        remove(@Param('id') id: number) {
    return this.eventsService.remove(id);
  }

}


