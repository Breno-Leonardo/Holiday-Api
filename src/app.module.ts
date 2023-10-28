import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HolidayModule } from './holiday/holiday.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateModule } from './state/state.module';
import { CountyModule } from './county/county.module';
import { HolidayEntity } from './holiday/entities/holiday.entity';
import { StateEntity } from './state/entities/state.entity';
import { CountyEntity } from './county/entities/county.entity';
import { CreateTables1698334121179 } from './migration/1698334121179-create_tables';
import { InsertInitialData1698334147735 } from './migration/1698334147735-insert_initial_data';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        server: configService.get('DB_SERVER','localhost'),
        schema: configService.get('DB_SCHEMA', 'public'),
        entities: [
          HolidayEntity,
          StateEntity,
          CountyEntity
        ],
        migrations: [CreateTables1698334121179,InsertInitialData1698334147735],
        migrationsRun: true,
        // synchronize: true,
      }),
    }),
    HolidayModule,
    StateModule,
    CountyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
