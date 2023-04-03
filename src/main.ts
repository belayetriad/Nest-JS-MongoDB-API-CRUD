import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the ConfigService instance
  const configService = app.get(ConfigService);
  console.log(configService);

  const port = configService.get<number>('port');
  const environment = configService.get<string>('NODE_ENV');
  const title = configService.get<string>('title');
  const description = configService.get<string>('description');
  const version = configService.get<string>('version');

  app.useWebSocketAdapter(new IoAdapter());
  await app.listen(port);
  console.log(`Application running in ${environment} mode on port ${port}`);

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
