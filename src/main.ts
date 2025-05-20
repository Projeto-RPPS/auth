// src/main.ts
import { NestFactory }          from '@nestjs/core';
import { AppModule }            from './app.module';
import { ValidationPipe }       from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Rpps-Auth API')
    .setDescription('Documentação da API com Swagger + JWT')
    .setVersion('1.0')
    // Adiciona o botão “Authorize” no Swagger
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Digite o token gerado em /auth/login',
      },
      'JWT-auth', // chave que usaremos nos controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // inclui o guard @ApiBearerAuth() em todas as rotas protegidas
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log(`> Swagger disponível em http://localhost:3001/api`);
}

bootstrap();