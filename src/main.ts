import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if(process.env.NODE_ENV === 'production'){
    app.use(helmet());

    app.enableCors({
      origin: ['http://localhost:3001', 'http://192.168.0.11:3001', 'https://controle-estoque-api-production.up.railway.app'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Estoque API')
    .setDescription('Controle de estoque')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
