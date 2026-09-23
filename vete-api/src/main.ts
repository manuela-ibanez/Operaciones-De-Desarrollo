import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //Para que angular pueda conectarse
  await app.listen(3000)
}
bootstrap();
