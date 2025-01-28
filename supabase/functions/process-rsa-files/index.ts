import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STANDARDIZED_PROMPT = `// ... keep existing code`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get authorization header from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Validate Deepseek API key
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY')
    if (!apiKey) {
      console.error('Deepseek API key is not configured')
      return new Response(
        JSON.stringify({ error: 'Deepseek API key is not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const { optimizationId } = await req.json()
    console.log('Processing optimization ID:', optimizationId)

    // Initialize Supabase client with service role key
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
      return new Response(
        JSON.stringify({ error: 'Optimization not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
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
      return new Response(
        JSON.stringify({ error: 'Error downloading files' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Parse CSV files
    const keywordsText = await keywordsFile.text()
    const adsText = await adsFile.text()

    // Prepare prompt for Deepseek
    const prompt = STANDARDIZED_PROMPT
      .replace('{keywordsText}', keywordsText)
      .replace('{adsText}', adsText)
      .replace('{additionalInstructions}', optimization.additional_instructions || '')

    console.log('Sending request to Deepseek API')

    // Call Deepseek API with proper error handling and logging
    try {
      console.log('Making request to Deepseek API...')
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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
        const errorText = await response.text()
        console.error('Deepseek API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })
        throw new Error(`Deepseek API error: ${response.status} ${response.statusText}\n${errorText}`)
      }

      const aiResponse = await response.json()
      console.log('Deepseek API response received successfully')

      if (!aiResponse.choices?.[0]?.message?.content) {
        console.error('Invalid response format from Deepseek API:', aiResponse)
        throw new Error('Invalid response format from Deepseek API')
      }

      const results = aiResponse.choices[0].message.content

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

      console.log('Successfully processed optimization:', optimizationId)
      return new Response(
        JSON.stringify({ message: 'Processing completed successfully', results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (deepseekError) {
      console.error('Deepseek API error:', deepseekError)
      return new Response(
        JSON.stringify({ 
          error: 'Error processing with Deepseek API',
          details: deepseekError.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

  } catch (error) {
    console.error('Error in process-rsa-files function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})