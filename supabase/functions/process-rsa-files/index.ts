import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STANDARDIZED_PROMPT = `You are a skilled PPC copywriter specializing in Google Search Ads. 
Your task is to create **15 headlines** (each up to 30 characters) 
and **4 descriptions** (each up to 90 characters). 

Review the current ad copy along with the keywords for this ad group. 

**Objective**:
1. Incorporate persuasive elements from Google's "messy middle" model when relevant, 
   such as:
   - **Social proof** (e.g., testimonials, number of customers)
   - **Scarcity** or **urgency** (e.g., limited-time offers)
   - **Authority** or **expertise** (e.g., certifications, experience)
   - **Framing and anchoring** (e.g., "Save 50%" or "Our best-selling plan")

2. Comply strictly with these Google RSA (Responsive Search Ad) constraints:
   - **Headlines**: up to 30 characters each
   - **Descriptions**: up to 90 characters each

3. Use varied language to target different buyer mindsets across the exploration and evaluation stages of the messy middle.

4. Make sure ad copy is relevant to the keywords supplied and use keywords in the headlines where appropriate to maximise relevance. 

4. Provide the output in the following format:
   - **Headlines (1–15)**: 
     1. Headline text (≤30 characters)
     2. Headline text (≤30 characters)
     ...
     15. Headline text (≤30 characters)
   - **Descriptions (1–4)**:
     1. Description text (≤90 characters)
     ...
     4. Description text (≤90 characters)

**Constraints**:
- Adhere to correct spelling and grammar.
- Highlight relevant emotional and rational benefits to entice clicks.
- Include clear calls-to-action (CTA) as appropriate.

Keywords file content:
{keywordsText}

Current ads file content:
{adsText}

{additionalInstructions}`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { optimizationId } = await req.json()
    console.log('Processing optimization ID:', optimizationId)

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
    const prompt = STANDARDIZED_PROMPT
      .replace('{keywordsText}', keywordsText)
      .replace('{adsText}', adsText)
      .replace('{additionalInstructions}', optimization.additional_instructions || '')

    console.log('Sending request to Deepseek API with prompt:', prompt)

    // Call Deepseek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
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
      console.error('Deepseek API error response:', errorText)
      throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`)
    }

    const aiResponse = await response.json()
    console.log('Deepseek API response:', aiResponse)

    if (!aiResponse.choices?.[0]?.message?.content) {
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