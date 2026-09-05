import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fpofksbeiaftslekpbcr.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zc9k-stbZUAM9ZzUN3PKHQ_xYE0Fxyq';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Save AI Produce Vision Grading to Supabase
 */
export async function saveProduceGrading(gradingData) {
  try {
    const { data, error } = await supabase
      .from('produce_gradings')
      .insert([
        {
          crop_type: gradingData.cropIdentified,
          grade: gradingData.grade,
          freshness_score: gradingData.freshnessScoreOutOf100,
          shelf_life_days: gradingData.estimatedShelfLifeDays,
          recommended_price_inr: gradingData.recommendedFairPricePerKgInr,
          summary: gradingData.verificationSummary,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn("Supabase insert notice (produce_gradings):", error.message);
    }
    return data;
  } catch (err) {
    console.error("Supabase produce_gradings error:", err);
    return null;
  }
}

/**
 * Save Voice Trade Contract to Supabase
 */
export async function saveTradeContract(contractData) {
  try {
    const { data, error } = await supabase
      .from('trade_contracts')
      .insert([
        {
          spoken_language: contractData.spokenLanguage,
          transcription: contractData.transcription,
          translated_text: contractData.translatedText,
          commodity: contractData.contractDraft?.commodity,
          quantity_kg: contractData.contractDraft?.quantityKg,
          demanded_price_per_kg: contractData.contractDraft?.demandedPricePerKg,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn("Supabase insert notice (trade_contracts):", error.message);
    }
    return data;
  } catch (err) {
    console.error("Supabase trade_contracts error:", err);
    return null;
  }
}

/**
 * Save Dispute Resolution & Multi-Party Liability to Supabase
 */
export async function saveDisputeResolution(disputeData) {
  try {
    const { data, error } = await supabase
      .from('dispute_resolutions')
      .insert([
        {
          batch_id: 'AGRI-GRAPE-8821',
          agent_reasoning: disputeData.agentReasoning,
          multi_party_liability: disputeData.multiPartyLiability,
          verdict: disputeData.finalSettlement?.verdict,
          original_escrow_usdc: disputeData.finalSettlement?.originalEscrowAmountUsdc,
          adjusted_farmer_payout_usdc: disputeData.finalSettlement?.adjustedFarmerPayoutUsdc,
          buyer_refund_usdc: disputeData.finalSettlement?.buyerRefundUsdc,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn("Supabase insert notice (dispute_resolutions):", error.message);
    }
    return data;
  } catch (err) {
    console.error("Supabase dispute_resolutions error:", err);
    return null;
  }
}

/**
 * Save Farmer Advisory Interaction to Supabase
 */
export async function saveFarmerAdvisory(advisoryData) {
  try {
    const { data, error } = await supabase
      .from('farmer_advisories')
      .insert([
        {
          query: advisoryData.query,
          detected_language: advisoryData.detectedLanguage,
          recommendation: advisoryData.recommendation,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn("Supabase insert notice (farmer_advisories):", error.message);
    }
    return data;
  } catch (err) {
    console.error("Supabase farmer_advisories error:", err);
    return null;
  }
}
