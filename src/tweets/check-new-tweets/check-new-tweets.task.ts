import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TweetsService } from '../tweets.service';

@Injectable()
export class CheckNewTweetsTask {
  private limit = 10;

  constructor(private tweetService: TweetsService) {}

  @Interval(5000)
  async handle() {
    console.log('Checking for new tweets...');
  }
}
