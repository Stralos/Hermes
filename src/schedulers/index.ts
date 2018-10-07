import * as schedule from 'node-schedule';
import { WebClient } from '@slack/client';
import BreakfastReminder from './breakfastReminder';

export default class Schedulers {
  private web: WebClient;
  constructor(web: WebClient) {
    this.web = web;
  }

  public init() {
    schedule.scheduleJob(
      new schedule.RecurrenceRule(
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        14,
      ),
      new BreakfastReminder(this.web).sendReminderForBreakfast
    );
  }
}