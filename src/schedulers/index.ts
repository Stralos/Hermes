import * as schedule from 'node-schedule';
import { WebClient } from '@slack/client';
import WeekDays from 'models/WeekDays';
import BreakfastReminder from './breakfastReminder';

export default class Schedulers {
  private web: WebClient;
  private jobs: schedule.Job[];
  constructor(web: WebClient) {
    this.web = web;
    this.jobs = [];
    this.start = this.start.bind(this);
  }

  public start() {
    this.jobs.push(
      schedule.scheduleJob(
        new schedule.RecurrenceRule(undefined, undefined, undefined, 
          [WeekDays.MONDAY, WeekDays.FRIDAY], 
          11, 11, 0
        ),
        new BreakfastReminder(this.web).sendReminderForBreakfast
      )
    );
  }
}