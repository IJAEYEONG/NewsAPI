import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Next.js가 실행 중인 포트
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();
