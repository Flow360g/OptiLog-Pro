// Follow Deno strict typing
/// <reference lib="deno.unstable" />

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { optimizationId } = await req.json()
    
    if (!optimizationId) {
      console.error('Missing optimization ID')
      return new Response(
        JSON.stringify({ error: 'Missing optimization ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate OpenRouter API key
    const apiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!apiKey) {
      console.error('OpenRouter API key is not configured')
      return new Response(
        JSON.stringify({ 
          error: 'OpenRouter API key is not configured',
          details: 'Please configure OPENROUTER_API_KEY in the Supabase Edge Function settings'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`API Key length: ${apiKey.length}, first few chars: ${apiKey.substring(0, 4)}...`)

    // Process the optimization using OpenRouter API (with Deepseek model)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://lovable.ai', // required for OpenRouter
        'X-Title': 'Lovable RSA Optimizer' // optional for OpenRouter
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-coder-33b-instruct',
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Error processing with OpenRouter API',
          details: `OpenRouter API error: ${response.status} ${response.statusText}\n${errorText}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('OpenRouter API response:', JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})