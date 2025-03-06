// src/modules/supabase/supabase.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importa ConfigModule e ConfigService
import { createClient } from '@supabase/supabase-js';

@Module({
  imports: [ConfigModule], // Aggiungi ConfigModule qui
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('SUPABASE_URL') ?? '';
        const key = configService.get<string>('SUPABASE_KEY') ?? '';
        return createClient(url, key);
      },
      inject: [ConfigService], // Inietta ConfigService
    },
  ],
  exports: ['SUPABASE_CLIENT'], // Esporta il provider
})
export class SupabaseModule {}
