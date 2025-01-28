/// <reference lib="deno.unstable" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const createResponse = (body: any, status: number = 200) => {
  return new Response(
    JSON.stringify(body),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  );
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { optimizationId } = await req.json()

    if (!optimizationId) {
      console.error('Missing optimization ID')
      return createResponse({ error: 'Missing optimization ID' }, 400)
    }

    const apiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!apiKey) {
      console.error('OpenRouter API key is not configured')
      return createResponse({ error: 'API configuration error' }, 500)
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing')
      return createResponse({ error: 'Server configuration error' }, 500)
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`Processing optimization ID: ${optimizationId}`)

    // Get the optimization record to access the files
    const { data: optimization, error: fetchError } = await supabase
      .from('rsa_optimizations')
      .select('*')
      .eq('id', optimizationId)
      .single();

    if (fetchError || !optimization) {
      console.error('Failed to fetch optimization:', fetchError)
      return createResponse({ error: 'Failed to fetch optimization details' }, 500)
    }

    // Download keywords file
    const { data: keywordsData, error: keywordsError } = await supabase.storage
      .from('rsa-files')
      .download(optimization.keywords_file_path);

    if (keywordsError) {
      console.error('Failed to download keywords file:', keywordsError);
      return createResponse({ error: 'Failed to access keywords file' }, 500);
    }

    // Download ads file
    const { data: adsData, error: adsError } = await supabase.storage
      .from('rsa-files')
      .download(optimization.ads_file_path);

    if (adsError) {
      console.error('Failed to download ads file:', adsError);
      return createResponse({ error: 'Failed to access ads file' }, 500);
    }

    // Convert files to text
    const keywordsText = await keywordsData.text();
    const adsText = await adsData.text();

    console.log('Keywords data:', keywordsText.substring(0, 200) + '...');
    console.log('Ads data:', adsText.substring(0, 200) + '...');

    console.log('Making request to OpenRouter API...')
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://lovable.ai',
        'X-Title': 'Lovable RSA Optimizer',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-llama-70b",
        messages: [
          {
            role: 'system',
            content: 'You are an expert at optimizing Google RSA ads. You will analyze keywords and ads data, and provide optimization suggestions in a CSV format.'
          },
          {
            role: 'user',
            content: `Please analyze and optimize these RSA ads.
            
            Keywords data (CSV format):
            ${keywordsText}
            
            Current ads data (CSV format):
            ${adsText}
            
            Additional instructions:
            ${optimization.additional_instructions || 'No additional instructions provided.'}
            
            Please provide your recommendations in a CSV format with the following columns:
            Original Ad,Suggested Changes,Rationale,Expected Impact
            
            Make sure to analyze the relationship between the keywords and ads, and suggest specific improvements to make the ads more relevant and effective.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return createResponse({ error: 'Failed to process optimization' }, 500);
    }

    const aiResponse = await response.json();
    console.log('AI Response received:', aiResponse);

    if (!aiResponse?.choices?.[0]?.message?.content) {
      console.error('Invalid AI response format:', aiResponse);
      return createResponse({ error: 'Invalid optimization result format' }, 500);
    }

    // Create CSV content from AI response
    const csvContent = aiResponse.choices[0].message.content;
    const fileName = `${optimizationId}.csv`;

    console.log('Uploading file:', fileName);

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('rsa-files')
      .upload(fileName, new Blob([csvContent], { type: 'text/csv' }), {
        contentType: 'text/csv',
        upsert: true
      });

    if (uploadError) {
      console.error('File upload error:', uploadError);
      return createResponse({ error: 'Failed to save optimization results' }, 500);
    }

    console.log('File uploaded successfully:', fileName);

    // Update the optimization record with the output file path
    const { error: updateError } = await supabase
      .from('rsa_optimizations')
      .update({
        status: 'completed',
        output_file_path: fileName,
        results: aiResponse.choices[0].message
      })
      .eq('id', optimizationId);

    if (updateError) {
      console.error('Database update error:', updateError);
      return createResponse({ error: 'Failed to update optimization status' }, 500);
    }

    return createResponse({
      message: 'Optimization completed successfully',
      output_file_path: fileName
    });

  } catch (error) {
    console.error('Processing error:', error);
    return createResponse({ error: 'An unexpected error occurred' }, 500);
  }
});