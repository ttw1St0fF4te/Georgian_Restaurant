import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  // Устанавливаем часовой пояс для всего приложения
  process.env.TZ = process.env.TZ || 'Europe/Moscow';
  
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS for frontend development
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000'],
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Georgian Restaurant API')
    .setDescription('API для управления грузинскими ресторанами с системой бронирования, заказов и аудита')
    .setVersion('1.0.0')
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('users', 'Управление пользователями')
    .addTag('restaurants', 'Управление ресторанами')
    .addTag('menu', 'Управление меню')
    .addTag('tables', 'Управление столиками')
    .addTag('reservations', 'Бронирование столиков')
    .addTag('orders', 'Заказы')
    .addTag('audit', 'Аудит и логирование')
    .addTag('health', 'Мониторинг состояния системы')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addServer('http://localhost:3000', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Save OpenAPI spec to file for type generation
  fs.writeFileSync('./openapi-spec.json', JSON.stringify(document, null, 2));
  
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api-docs`);
  console.log(`📄 OpenAPI spec saved to: ./openapi-spec.json`);
}
bootstrap();
