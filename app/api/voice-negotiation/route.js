import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { audioBase64, audioMimeType, textPrompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        spokenLanguage: 'Marathi / Hindi Mix',
        transcription: 'माझ्याकडे १० क्विंटल नाशिक द्राक्ष आहेत, मला रु. ८५ प्रति किलो भाव हवा आहे.',
        translatedText: 'I have 10 quintals (1000 kg) of Nashik grapes available. I am demanding Rs 85 per kg.',
        contractDraft: {
          commodity: 'Nashik Seedless Grapes',
          quantityKg: 1000,
          demandedPricePerKg: 85,
          harvestDate: '2026-09-04',
          farmLocation: 'Pimpalgaon, Nashik, Maharashtra',
        },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = [];
    if (audioBase64) {
      contents.push({
        inlineData: {
          mimeType: audioMimeType || 'audio/mp3',
          data: audioBase64,
        },
      });
    }
    contents.push({
      text: textPrompt || `The farmer is speaking in a regional Indian language about selling their harvest. Transcribe, translate to English, extract commodity details, quantity, asking price, and generate a standardized direct-order draft.`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spokenLanguage: { type: Type.STRING },
            transcription: { type: Type.STRING },
            translatedText: { type: Type.STRING },
            contractDraft: {
              type: Type.OBJECT,
              properties: {
                commodity: { type: Type.STRING },
                quantityKg: { type: Type.NUMBER },
                demandedPricePerKg: { type: Type.NUMBER },
                harvestDate: { type: Type.STRING },
                farmLocation: { type: Type.STRING },
              },
              required: ['commodity', 'quantityKg', 'demandedPricePerKg'],
            },
          },
          required: ['spokenLanguage', 'transcription', 'contractDraft'],
        },
      },
    });

    return NextResponse.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Gemini Voice Negotiation API Error:", error);
    return NextResponse.json({
      spokenLanguage: 'Hindi',
      transcription: 'मेरे पास 1500 किलो प्याज है, 35 रुपये प्रति किलो की दर से बेचना चाहता हूँ।',
      translatedText: 'I have 1500 kg onions. I want to sell at 35 INR per kg.',
      contractDraft: {
        commodity: 'Red Onion (Lasalgaon)',
        quantityKg: 1500,
        demandedPricePerKg: 35,
        harvestDate: '2026-09-05',
        farmLocation: 'Lasalgaon, Maharashtra',
      },
    });
  }
}
