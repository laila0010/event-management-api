import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException, 
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findAll() {
    return this.eventRepository.find({
      order: { event_date: 'ASC' },
    });
  }

  async findUpcoming() {
    return this.eventRepository.find({
      where: {
        event_date: MoreThan(new Date()), 
      },
      order: { event_date: 'ASC' },
    });
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['registrations', 'registrations.user'], 
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async create(dto: CreateEventDto) {
    const existingEvent = await this.eventRepository.findOne({
      where: { event_date: dto.event_date },
    });

    if (existingEvent) {
      throw new ConflictException(
        'An event already exists at this date and time',
      );
    }

    const event = this.eventRepository.create(dto);
    return this.eventRepository.save(event);
  }

  async update(id: number, dto: UpdateEventDto) {
    const event = await this.findOne(id);

    if (dto.event_date) {
      const existingEvent = await this.eventRepository.findOne({
        where: { event_date: dto.event_date },
      });

      if (existingEvent && existingEvent.id !== id) {
        throw new ConflictException(
          'Another event already exists at this date and time',
        );
      }
    }

    Object.assign(event, dto);
    return this.eventRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
    return { message: 'Event deleted successfully' };
  }
}