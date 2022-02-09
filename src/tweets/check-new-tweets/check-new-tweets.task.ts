import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { TweetsService } from '../tweets.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class CheckNewTweetsTask {
  private limit = 10;
  private minutesForTtl = 1 * 60 * 10;

  constructor(
    private tweetService: TweetsService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectQueue('emails')
    private emailsQueue: Queue,
  ) {}

  @Interval(5000)
  async handle() {
    let offset = await this.cacheManager.get<number>('tweet-offset');
    offset = offset || 0;

    console.log(`Checking new tweets from offset ${offset}`);

    const tweets = await this.tweetService.findAll({
      limit: this.limit,
      offset,
    });

    console.log(`Found ${tweets.length} tweets`);

    if (tweets.length === this.limit) {
      await this.cacheManager.set('tweet-offset', offset + this.limit, {
        ttl: this.minutesForTtl,
      });

      console.log(`Saved offset ${offset + this.limit}`);
      await this.emailsQueue.add({});
    }
  }
}
