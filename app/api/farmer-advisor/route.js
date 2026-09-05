import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import { saveFarmerAdvisory } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { prompt, audioBase64, audioMimeType, language } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    let result;

    if (!apiKey) {
      result = {
        query: prompt || 'Which crop should I grow this season for maximum profit?',
        detectedLanguage: language || 'English / Hindi',
        recommendation: `🌱 **Recommended Crops for Current Season (Kharif / Late Monsoon)**:
1. **Nashik Thompson Seedless Grapes / Pomegranate**: High export demand & eligible for AgriFresh Micro-Cold Hub pre-cooling credit (60% advance).
2. **Short-Duration Organic Red Onions**: Market price trend predicts a +22% APMC price rally in Mumbai Vashi mandi over the next 45 days.

💡 **Key Farming Strategy**:
- Utilize drip irrigation with nitrogen fertigation to lower water consumption by 35%.
- Pre-book a slot at the nearest **Solar Micro-Cold Hub** before harvest to eliminate post-harvest decay and prevent distress sales!`,
        suggestedActions: [
          'Reserve 10MT Solar Cold Hub Slot',
          'Scan Harvest Photo with Gemini Vision',
          'View Direct B2B Buyer Escrow Demand',
        ]
      };
    } else {
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
        text: prompt ? `You are AgriFresh AI, an expert agricultural scientist advising a smallholder farmer in India. The farmer asks: "${prompt}". Provide practical, highly encouraging, actionable farming advice, recommended seasonal crops to grow, pest management tips, and mandi price strategies in simple text with clear bullet points. If language is specified as ${language || 'regional'}, respond in that language.` : `Provide expert seasonal crop selection and smart farming strategy for smallholder farmers in India.`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
      });

      result = {
        query: prompt || 'Farmer Advisory Query',
        detectedLanguage: language || 'Hindi / English',
        recommendation: response.text,
        suggestedActions: [
          'Reserve Solar Cold Hub Slot',
          'Grade Harvest Photo with Gemini Vision',
          'Check Live APMC Mandi Rates',
        ]
      };
    }

    // Log to Supabase Backend
    await saveFarmerAdvisory(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Gemini Farmer Advisor API Error:", error);
    const fallback = {
      query: prompt || 'Seasonal Crop Strategy',
      detectedLanguage: 'English',
      recommendation: '🌱 For high return on investment this season, consider high-density horticulture crops like Seedless Grapes, Guava, or Tomatoes paired with Solar Micro-Cold Storage to avoid harvest season distress sales.',
      suggestedActions: ['Check Cold Hub Capacity', 'Scan Produce Image']
    };
    await saveFarmerAdvisory(fallback);
    return NextResponse.json(fallback);
  }
}
