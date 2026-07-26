import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use((request, response, next) => {
    response.header('Access-Control-Allow-Private-Network', 'true');
    next();
  });
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Request-Private-Network'],
  });
  app.useStaticAssets(join(process.cwd(), 'public'), { prefix: '/game/' });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
