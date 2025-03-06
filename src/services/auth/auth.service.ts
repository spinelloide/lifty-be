import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { User } from 'src/interfaces/User';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async signUp(user: User): Promise<User | null> {
    const { email, name, surname, username, password } = user;

    // Controlla se l'utente esiste già
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Crittografia della password
    const saltRounds = 10; // Numero di cicli di hashing (più alto = più sicuro, ma più lento)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inserimento dell'utente con la password criptata
    const { data, error } = await this.supabase
      .from('users')
      .insert([{ email, name, surname, username, password: hashedPassword }])
      .select();

    if (error) {
      console.error('Error inserting user:', error);
      throw new Error('Error inserting user');
    }

    return data ? (data[0] as User) : null;
  }
}
