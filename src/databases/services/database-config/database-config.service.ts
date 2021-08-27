import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { ConnectionNames } from '../../connection-names';
import { UserModel } from '../../models/user.model';
import { TaskModel } from '../../models/task.model';
import { LoggingService } from '../../../services/logging/logging.service';

@Injectable()
export class DatabaseConfigService implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService) {}

  createSequelizeOptions(
    connectionName?: string,
  ): Promise<SequelizeModuleOptions> | SequelizeModuleOptions {
    connectionName = connectionName || ConnectionNames.DefaultConnection;
    const config = this.configService.get<SequelizeModuleOptions>(
      `databases.${connectionName}`,
    );

    if (!!config.logging) {
      const logger = new LoggingService(this.configService);
      config.logging = (sql, timing) =>
        logger.debug(`Executed ${sql} Elapsed time: ${timing}`);
    }

    // @todo find way to auto detect models
    // add all the model classes here
    config.models = [UserModel, TaskModel];

    return config;
  }
}
