import cron from 'node-cron';
import AppService from './api/app.service';
import { logger } from './utils/logger';

class Jobs {
  private appService = new AppService();

  public start() {
    this.publishMessages();
  }

  private publishMessages() {
    // Job runs for 10 seconds
    cron.schedule('5 * * * * *', async () => {
      logger.info('publishing messages');
      await this.appService.publishMessages();
    });
  }
}

export default Jobs;
