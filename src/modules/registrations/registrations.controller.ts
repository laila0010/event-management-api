import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';

@Controller('registrations')
export class RegistrationsController {

  constructor(private service: RegistrationsService) {}

  @Post(':eventId')
  register(
    @Param('eventId') eventId: number,
    @Body() body: { userId: number }, 
  ) {
    return this.service.register(eventId, body.userId);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: number) {
    return this.service.approve(id);
  }

  @Get('event/:eventId')
  attendees(@Param('eventId') eventId: number) {
    return this.service.getEventAttendees(eventId);
  }
}