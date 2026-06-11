import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { SeatsModule } from './seats/seats.module';
import { AdminModule } from './admin/admin.module';
import { RedisModule } from './redis/redis.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          Logger.log(`MongoDB state: ${connection.readyState}`, 'Mongoose');
          if (connection.readyState === 1) {
            Logger.log('MongoDB already connected', 'Mongoose');
          }
          connection.on('connected', () => {
            Logger.log('MongoDB connected', 'Mongoose');
          });
          connection.on('error', (error) => {
            Logger.error('MongoDB connection error', error, 'Mongoose');
          });
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    BookingsModule,
    SeatsModule,
    AdminModule,
    RedisModule,
    EventsModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
