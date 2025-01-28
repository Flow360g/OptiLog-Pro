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
            content: 'You are an expert at optimizing Google RSA ads. You will receive keywords and ads data, and you should provide optimization suggestions.'
          },
          {
            role: 'user',
            content: 'Please optimize these RSA ads.'
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
    console.log('AI Response:', aiResponse);

    // Create CSV content from AI response
    const csvContent = `Optimization Results\n${aiResponse.choices[0].message.content}`;
    const fileName = `optimization_${optimizationId}.csv`;

    console.log('Uploading file:', fileName);

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
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