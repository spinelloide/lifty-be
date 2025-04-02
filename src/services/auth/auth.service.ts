import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { User } from 'src/interfaces/User';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './response/login-response';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private jwtService: JwtService,
  ) {}

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

  async login(email: string, password: string): Promise<LoginResponse | null> {
    // Controlla se l'utente esiste nel database
    const { data, error } = await this.supabase
      .from('users')
      .select('id, email, username, password') // Recupera solo le informazioni necessarie
      .eq('email', email)
      .single();

    const user = data as User;

    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    // Verifica se la password fornita corrisponde a quella salvata nel database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Crea il payload del JWT
    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
    };

    // Genera il JWT
    const access_token = this.jwtService.sign(payload);

    // Restituisci il token JWT
    return {
      token: access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}
