import { NestFactory }          from '@nestjs/core';
import { AppModule }            from './app.module';
import { ValidationPipe }       from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser        from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://192.168.38.16:5173',  // ou qualquer domínio do seu front
    credentials: true,                // <— importante
  });

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Rpps-Auth API')
    .setDescription('Documentação da API com Swagger + cookie-jwt')
    .setVersion('1.0')
    // esquema de cookie:
    .addCookieAuth('cookieAuth', {   // chave interna "cookieAuth"
      type: 'apiKey',
      in: 'cookie',
      name: 'Authentication',         // mesmo nome que você usa em res.cookie()
    }, 'cookieAuth',)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  // habilita envio de credenciais no Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      requestCredentials: 'include',  // <— faz o browser anexar cookies
    }
  });

  await app.listen(3001, '0.0.0.0');
  console.log(`> Swagger disponível em http://192.168.38.16:3001/api`);
}

bootstrap();
