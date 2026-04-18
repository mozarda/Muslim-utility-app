/**
 * Voxtral AI Recitation Checker
 * Sends audio to OpenRouter (mistralai/voxtral-small) for Tajweed analysis.
 */

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface TajweedMistake {
  start: number;
  end: number;
  text: string;
}

export interface TajweedCheckResult {
  transcription: string;
  isCorrect: boolean;
  mistakes: TajweedMistake[];
  error?: string;
}

export async function checkRecitation(
  audioBase64: string,
  referenceText: string,
  verseIndex?: number,
): Promise<TajweedCheckResult> {
  if (!OPENROUTER_API_KEY) {
    return {
      transcription: '',
      isCorrect: false,
      mistakes: [],
      error: 'OpenRouter API key not configured. Set EXPO_PUBLIC_OPENROUTER_API_KEY in .env',
    };
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/voxtral-small-24b-2507',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'input_audio',
                input_audio: {
                  data: audioBase64,
                  format: 'wav',
                },
              },
              {
                type: 'text',
                text: `You are an Arabic Quran Tajweed expert.

The expected verse is: "${referenceText}"
Verse number: ${(verseIndex || 0) + 1}

Listen to the user's recitation and:
1. Transcribe exactly what they said
2. Compare it character-by-character with the expected text
3. Identify any mistakes (wrong letters, missing letters, extra letters, or wrong diacritics)
4. Mark the position and text of each mistake

Respond ONLY with valid JSON in this exact format:
{
  "transcription": "what the user recited",
  "isCorrect": true or false,
  "mistakes": [
    {"start": character_start_index, "end": character_end_index, "text": "the wrong text"}
  ]
}

If correct: isCorrect = true, mistakes = []
If wrong: isCorrect = false, mistakes = array of mistake objects with start, end, and text
All indexes are 0-based character positions in the transcribed text.

IMPORTANT: Respond with ONLY the JSON, no other text.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return {
        transcription: '',
        isCorrect: false,
        mistakes: [],
        error: `API error: ${response.status}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        transcription: '',
        isCorrect: false,
        mistakes: [],
        error: 'No response from AI model',
      };
    }

    // Parse JSON from response
    let result: TajweedCheckResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(content);
      }
    } catch {
      return {
        transcription: content,
        isCorrect: false,
        mistakes: [],
        error: 'Could not parse AI response',
      };
    }

    return {
      transcription: result.transcription || '',
      isCorrect: result.isCorrect || false,
      mistakes: result.mistakes || [],
    };
  } catch (err: any) {
    console.error('Recitation check failed:', err);
    return {
      transcription: '',
      isCorrect: false,
      mistakes: [],
      error: err.message || 'Network error',
    };
  }
}
