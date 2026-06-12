import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis'
import { Payload } from './payload/payload';
import { timestamp } from 'rxjs';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client!: Redis
    private publisher!: Redis
    private subscriber!: Redis

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const options = {
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
        }
        this.client = new Redis(options)
        this.publisher = new Redis(options)
        this.subscriber = new Redis(options)
    }

    onModuleDestroy() {
        this.client.quit()
        this.publisher.quit()
        this.subscriber.quit()
    }

    async acquireLock(key: string, value: string, ttlSeconds = 300): Promise<boolean> {
        const result = await this.client.set(
            `Lock:${key}`, value, 'EX', ttlSeconds, 'NX'
        )
        return result === 'OK'
    }

    async releaseLock(key: string, value: string): Promise<void> {
        const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del" , KEYS[1])
        else 
            return 0
        end
        `
        await this.client.eval(script, 1, `Lock:${key}`, value)
    }

    async publishSeatUpdate(payload: Payload): Promise<void> {
        await this.publisher.publish('seat:updates', JSON.stringify(payload))
    }

    async publishAuditLog(payload: Record<string, any>): Promise<void> {
        await this.publisher.publish('audit:logs', JSON.stringify({
            ...payload,
            timestamp: new Date().toISOString(),
        }))
    }

    getSubscriber(): Redis {
        return this.subscriber
    }
}
