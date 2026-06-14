import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { RedisService } from "../redis/redis.service";
import { InjectModel } from "@nestjs/mongoose";
import { AuditLog } from "../admin/schema/audit-lock.schema";
import { Model } from "mongoose";


@Injectable()
@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway implements OnGatewayInit, OnModuleInit {
  @WebSocketServer()
  server!: Server

  private readonly logger = new Logger(EventsGateway.name)

  constructor(
    private redisService: RedisService,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>
  ) { }

  afterInit() {
    this.logger.log('WebSocket Gateway initialized')
  }

  onModuleInit() {
    this.subscribeToRedis()
  }

  private subscribeToRedis() {
    const subscriber = this.redisService.getSubscriber()

    subscriber.subscribe('seat:updates', 'audit:logs', (err) => {
      if (err) this.logger.error('Redis subscribe error ', err)
    })

    subscriber.on('message', async (channel, message) => {
      const payload = JSON.parse(message)

      if (channel === 'seat:updates') {
        this.server.emit('seat:updated', payload)
        this.logger.log(`seat:updated > ${payload.seatNumber} = ${payload.status}`)
      }

      if (channel === 'audit:logs') {
        await this.auditLogModel.create({
          event: payload.event,
          seatNumber: payload.seatNumber,
          userId: payload.userId,
          bookingId: payload.bookingId,
          metadata: payload,
        })
        this.logger.log(`audit:log > ${payload.event}`)
      }
    })
  }

}