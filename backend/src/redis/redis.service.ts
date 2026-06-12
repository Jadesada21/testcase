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

    async acquireLock(key: string, value: string, ttlMs = 5000): Promise<boolean> {
        const result = await this.client.set(
            `Lock:${key}`, value, 'PX', ttlMs, 'NX'
        )
        return result === 'OK'
    }

    async releaseLock(key: string, value: string): Promise<void> {
        const currentValue = await this.client.get(`Lock:${key}`)
        if (currentValue === value) {
            await this.client.del(`Lock:${key}`)
        }
    }
}
