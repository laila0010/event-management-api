import { Controller, Post, Body, Param, Patch, Get, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { user_role } from '../users/entities/user.entity';

@Controller('registrations')
export class RegistrationsController {
  constructor(private service: RegistrationsService) {}

  @Post(':eventId')
  register(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body('userId') userId: number,
  ) {
    return this.service.register(eventId, userId);
  }

  @Patch(':id/approve')
 @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(user_role.ADMIN)
        approve(@Param('id', ParseIntPipe) id: number) {
    return this.service.approve(id);
  }

  @Get('event/:eventId')
 @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(user_role.ADMIN)
        attendees(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.service.getEventAttendees(eventId);
  }
}