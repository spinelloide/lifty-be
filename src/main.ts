import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Abilita la validazione globale
  app.useGlobalPipes(new ValidationPipe());

  // Abilita CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Sostituisci con l'URL del tuo frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // I metodi consentiti
    allowedHeaders: 'Content-Type, Authorization', // Le intestazioni consentite
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
