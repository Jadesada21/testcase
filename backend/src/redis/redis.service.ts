import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client!: Redis

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.client = new Redis({
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
        })
    }

    onModuleDestroy() {
        this.client.quit()
    }

    async acquireLock(key: string, ttlMs = 5000): Promise<boolean> {
        const result = await this.client.set(
            `Lock:${key}`, '1', 'PX', ttlMs, 'NX'
        )
        return result === 'OK'
    }

    async releaseLock(key: string): Promise<void> {
        await this.client.del(`Lock:${key}`)
    }
}
