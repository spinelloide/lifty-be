export interface SignUpResponse {
  message: string;
  status?: string;
  user?: any; // Puoi sostituire "any" con il tipo dell'utente che hai definito nel tuo modello (es. User)
  details?: string;
}
