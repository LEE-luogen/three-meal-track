import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's recent data for personalized insights
    const [mealsResult, fastingResult, profileResult] = await Promise.all([
      supabase.from('meals').select('*').eq('user_id', user.id)
        .gte('eaten_at', new Date(Date.now() - 7 * 86400000).toISOString())
        .order('eaten_at', { ascending: false }).limit(20),
      supabase.from('fasting_records').select('*').eq('user_id', user.id)
        .order('started_at', { ascending: false }).limit(10),
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    ]);

    const meals = mealsResult.data || [];
    const fastingRecords = fastingResult.data || [];
    const profile = profileResult.data;

    // Calculate stats
    const avgCalories = meals.length > 0
      ? meals.reduce((s, m) => s + (m.calories || 0), 0) / meals.length
      : 0;
    const avgProtein = meals.length > 0
      ? meals.reduce((s, m) => s + (m.protein_g || 0), 0) / meals.length
      : 0;
    const completedFasts = fastingRecords.filter(f => (f.completion_rate || 0) >= 100).length;
    const totalFasts = fastingRecords.length;

    // Generate insight based on data patterns
    let suggestion = "";
    let confidence = 75;
    let basis = "";

    if (meals.length === 0) {
      suggestion = "开始记录你的第一餐吧！AI 将根据你的饮食数据提供个性化建议。";
      confidence = 50;
      basis = "暂无饮食数据";
    } else if (avgProtein < 20) {
      suggestion = "近7天蛋白质摄入偏低，建议每餐增加优质蛋白来源，如鸡胸肉、鱼类或豆制品，有助于维持肌肉量和代谢水平。";
      confidence = 85;
      basis = `基于近${meals.length}餐数据，平均蛋白质${avgProtein.toFixed(0)}g`;
    } else if (avgCalories > 2000) {
      suggestion = "近期热量摄入偏高，建议适当控制碳水化合物比例，增加蔬菜和膳食纤维的摄入，有助于提升饱腹感。";
      confidence = 80;
      basis = `基于近${meals.length}餐数据，平均热量${avgCalories.toFixed(0)}kcal`;
    } else if (completedFasts > 0 && completedFasts === totalFasts) {
      suggestion = "断食完成率100%！你的自律令人钦佩。可以考虑尝试更长时间的断食模式，进一步提升代谢灵活性。";
      confidence = 90;
      basis = `基于${totalFasts}次断食记录，全部达标`;
    } else {
      suggestion = "你的饮食和断食节奏整体良好，继续保持当前的健康习惯。建议关注食物多样性，确保微量营养素充足。";
      confidence = 82;
      basis = `基于近7日${meals.length}餐数据与${totalFasts}次断食记录`;
    }

    return new Response(JSON.stringify({ suggestion, confidence, basis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-insights:', error);
    return new Response(JSON.stringify({
      suggestion: "暂时无法生成洞察，请稍后重试。",
      confidence: 0,
      basis: "服务暂时不可用",
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
