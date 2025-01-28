/// <reference lib="deno.unstable" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const createResponse = (body: any, status: number = 200) => {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
      return createResponse({ 
        error: 'OpenRouter API key is not configured',
        details: 'Please configure OPENROUTER_API_KEY in the Supabase Edge Function settings'
      }, 500)
    }

    console.log(`Processing optimization ID: ${optimizationId}`)
    console.log(`API Key length: ${apiKey.length}, first few chars: ${apiKey.substring(0, 4)}...`)

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
            content: 'You are an AI assistant that helps optimize Google RSA (Responsive Search Ads) campaigns.'
          },
          {
            role: 'user',
            content: 'Please analyze the provided keywords and ads to suggest optimizations.'
          }
        ]
      })
    });

    console.log('OpenRouter API Response Status:', response.status);
    console.log('OpenRouter API Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return createResponse({ 
        error: 'Error processing with OpenRouter API',
        details: `Status: ${response.status}\nResponse: ${errorText}`
      }, 500);
    }

    const result = await response.json();
    console.log('OpenRouter API response:', JSON.stringify(result, null, 2));

    return createResponse({ success: true, result });

  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse({ 
      error: 'Internal server error',
      details: error.message
    }, 500);
  }
})