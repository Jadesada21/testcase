import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    Credential: true,
  })

  await app.listen(process.env.PORT ?? 3000)


  console.log('Service is running on port 3000');
}
bootstrap();
