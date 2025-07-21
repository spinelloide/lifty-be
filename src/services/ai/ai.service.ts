import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { exerciseSchema } from 'src/schemas/exerciseSchema';
import { workoutSchema } from 'src/schemas/workoutSchema';
import z from 'zod';
@Injectable()
export class AiService {
  private readonly llm = new ChatOpenAI({
    temperature: 0,
    modelName: process.env.OPENAI_MODEL ?? 'gpt-4o',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  async generateStructuredResponse(prompt: string): Promise<{ title: string }> {
    // 1. Definisci lo schema Zod dell’output
    const schema = z.object({
      title: z.string().describe('Il titolo della scheda'),
    });

    type StructuredOutput = z.infer<typeof schema>;
    // 2. Costruisci il prompt
    const fullPrompt = [
      {
        role: 'system',
        content:
          'Sei un assistente AI che fornisce una scheda di allenamento in base a determinati parametri.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const llmWithStructure =
      this.llm.withStructuredOutput<StructuredOutput>(schema);

    return await llmWithStructure.invoke(fullPrompt);
  }

  async generateWorkoutPlan(input: {
    days: number;
    weeks: number;
    level: string;
    type: string;
  }) {
    const schema = z.object({
      workout_plan: workoutSchema,
      exercises: z.array(exerciseSchema),
    });
    type outputSchema = z.infer<typeof schema>;

    const fullPrompt = [
      {
        role: 'system',
        content: `Sei un assistente AI esperto in fitness che genera programmi di allenamento personalizzati. Rispondi sempre e solo in formato JSON conforme alle istruzioni fornite.`,
      },
      {
        role: 'user',
        content: `
Crea una scheda di allenamento per un utente con questi parametri:
- Giorni di allenamento a settimana: ${input.days}
- Durata del programma (in settimane): ${input.weeks}
- Livello di esperienza: ${input.level}
- Tipo di split: ${input.type}
- Durata di ogni sessione: almeno 60-90 minuti
- Gli esercizi devono avere \`day\` che vanno da 1 a ${input.days} (inclusi).
- Crea esattamente ${input.days} giorni di workout, distribuiti secondo il tipo (\`muscle_split\`, \`push_pull\`, \`full_body\`).
- Ogni giorno deve contenere almeno 5 esercizi se si tratta di bodybuilding, o 3-4 esercizi se si tratta di un programma di resistenza o funzionale.
- La descrizione del workout deve essere breve ma informativa, adatta al livello dell'utente, massimo 2-3 frasi.

Obiettivi:
1. Ogni giorno deve contenere abbastanza esercizi da riempire una sessione completa di almeno 60-90 minuti.
2. Tutti i principali gruppi muscolari devono essere allenati ogni settimana:
   - chest
   - back
   - legs
   - shoulders
   - biceps
   - triceps
   - core (abs)

3. Distribuisci il lavoro muscolare in modo coerente con il tipo di allenamento:
   - 'push_pull': separa esercizi push (petto, spalle, tricipiti) e pull (dorso, bicipiti)
   - 'muscle_split': suddividi i gruppi muscolari in giorni distinti (es. petto lunedì, schiena martedì, ecc.)
   - 'full_body': ogni giorno coinvolge tutto il corpo, ma con variazioni per evitare sovraccarico

4. Il numero totale di esercizi deve essere proporzionato a giorni x settimane (es: almeno ${input.days * input.weeks} esercizi).
5. Adatta volume e intensità al livello:
   - beginner: esercizi base, meno volume
   - intermediate: volume medio, più varietà
   - advanced: più esercizi, tecniche avanzate, superserie

6. Ogni esercizio deve contenere:
   - name
   - muscle_group (in inglese)
   - sets
   - reps
   - rest_time
   - weight (array vuoto [])
   - day (numero da 1 a ${input.days})

7. Il piano deve includere:
   - workout_plan: { title, description, duration = ${input.weeks}, training_days = ${input.days}, completed_count = giorni x settimane, is_active = false }
   - exercises: array di esercizi distribuiti per giorno

Rispondi solo con il JSON come da schema. Nessun testo aggiuntivo.
`,
      },
    ];

    const llm = this.llm.withStructuredOutput<outputSchema>(schema);

    try {
      return await llm.invoke(fullPrompt);
    } catch (error) {
      console.error('Errore AI:', error);
      throw new Error('Errore durante la generazione del workout');
    }
  }
}
