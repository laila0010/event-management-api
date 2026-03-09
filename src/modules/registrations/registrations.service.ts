import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Registration } from './entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';
import { registration_status } from './enums/registration-status.enum';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepo: Repository<Registration>,

    @InjectRepository(Event)
    private eventRepo: Repository<Event>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async register(eventId: number, userId: number) {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['registrations'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

   if (new Date(event.event_date) < new Date()) {
    throw new BadRequestException('Event has already passed');
  }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.registrationRepo.findOne({
      where: { user: { id: userId }, event: { id: eventId } },
    });

    if (existing) {
      throw new BadRequestException('User already registered for this event');
    }

const approvedCount = await this.registrationRepo.count({
    where: { event: { id: eventId }, status: registration_status.APPROVED }
  });

  if (approvedCount >= event.max_attendees) {
    throw new BadRequestException('Event capacity reached');
  }
    const registration = this.registrationRepo.create({
      user,
      event,
      status: registration_status.PENDING,
    });

    return this.registrationRepo.save(registration);
  }

  async approve(registrationId: number) {
    const registration = await this.registrationRepo.findOne({
      where: { id: registrationId },
      relations: ['event'],
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    const event = registration.event;
    const approvedCount = await this.registrationRepo.count({
      where: { event: { id: event.id }, status: registration_status.APPROVED },
    });

    if (approvedCount >= event.max_attendees) {
      throw new BadRequestException('Event capacity reached');
    }

    registration.status = registration_status.APPROVED;

    return this.registrationRepo.save(registration);
  }

  async getEventAttendees(eventId: number) {
    return this.registrationRepo.find({
      where: { event: { id: eventId } },
      relations: ['user'],
    });
  }
}