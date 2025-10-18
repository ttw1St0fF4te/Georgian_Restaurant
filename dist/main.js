"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const fs = require("fs");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
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
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addServer('http://localhost:3000', 'Development server')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    fs.writeFileSync('./openapi-spec.json', JSON.stringify(document, null, 2));
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
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
//# sourceMappingURL=main.js.map