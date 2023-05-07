import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  let port: any = process.env.PORT;
  if (port == null || port == '') {
    port = 8000;
  }
  await app.listen(port);
}
bootstrap();
