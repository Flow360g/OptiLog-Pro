import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { optimizationId } = await req.json()

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the optimization record
    const { data: optimization, error: fetchError } = await supabaseAdmin
      .from('rsa_optimizations')
      .select('*')
      .eq('id', optimizationId)
      .single()

    if (fetchError || !optimization) {
      console.error('Error fetching optimization:', fetchError)
      throw new Error('Optimization not found')
    }

    // Download the files from storage
    const { data: keywordsFile, error: keywordsError } = await supabaseAdmin.storage
      .from('rsa-files')
      .download(optimization.keywords_file_path)

    const { data: adsFile, error: adsError } = await supabaseAdmin.storage
      .from('rsa-files')
      .download(optimization.ads_file_path)

    if (keywordsError || adsError) {
      console.error('Error downloading files:', { keywordsError, adsError })
      throw new Error('Error downloading files')
    }

    // Parse CSV files
    const keywordsText = await keywordsFile.text()
    const adsText = await adsFile.text()

    // Prepare prompt for Deepseek
    const prompt = `
      I need help optimizing Google Responsive Search Ads (RSA).
      
      Here are the current keywords:
      ${keywordsText}
      
      And here are the current ads:
      ${adsText}
      
      ${optimization.additional_instructions ? 
        `Additional context: ${optimization.additional_instructions}` : ''}
      
      Please analyze these and provide:
      1. 3-5 new ad headline variations
      2. 2-3 new description variations
      3. Specific recommendations for keyword optimization
      4. Overall campaign improvement suggestions
      
      Format the response as a JSON object with these keys:
      - headlines: array of new headlines
      - descriptions: array of new descriptions
      - keywordRecommendations: array of specific keyword recommendations
      - generalSuggestions: array of overall campaign suggestions
    `

    // Call Deepseek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('Deepseek API error:', await response.text())
      throw new Error('Error calling Deepseek API')
    }

    const aiResponse = await response.json()
    const results = JSON.parse(aiResponse.choices[0].message.content)

    // Update the optimization record with results
    const { error: updateError } = await supabaseAdmin
      .from('rsa_optimizations')
      .update({
        results,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', optimizationId)

    if (updateError) {
      console.error('Error updating optimization:', updateError)
      throw new Error('Error updating optimization')
    }

    return new Response(
      JSON.stringify({ message: 'Processing completed successfully', results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in process-rsa-files function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})