import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

const userOwnedTables = [
  'expenses',
  'budget_categories',
  'monthly_budgets',
  'balance_items',
  'balance_snapshots',
  'profiles',
  'visual_preferences'
] as const

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

function readSecretKey() {
  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (secretKeys) {
    const parsed = JSON.parse(secretKeys) as Record<string, string>
    const key = parsed.default ?? Object.values(parsed)[0]
    if (key) return key
  }

  const legacyKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (legacyKey) return legacyKey

  throw new Error('Supabase secret key is not configured for delete-account')
}

function readPublishableKey() {
  const publishableKeys = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')
  if (publishableKeys) {
    const parsed = JSON.parse(publishableKeys) as Record<string, string>
    const key = parsed.default ?? Object.values(parsed)[0]
    if (key) return key
  }

  const legacyKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (legacyKey) return legacyKey

  throw new Error('Supabase publishable key is not configured for delete-account')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const authorization = request.headers.get('Authorization')

  if (!supabaseUrl) {
    return jsonResponse({ error: 'Supabase URL is not configured' }, 500)
  }

  if (!authorization?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Authenticated session is required' }, 401)
  }

  const userClient = createClient(supabaseUrl, readPublishableKey(), {
    auth: { persistSession: false },
    global: {
      headers: { Authorization: authorization }
    }
  })
  const adminClient = createClient(supabaseUrl, readSecretKey(), {
    auth: { persistSession: false }
  })

  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData.user) {
    return jsonResponse({ error: 'Authenticated user could not be verified' }, 401)
  }

  const userId = userData.user.id
  const jwt = authorization.replace(/^Bearer\s+/i, '')

  const { error: signOutError } = await adminClient.auth.admin.signOut(jwt, 'global')
  if (signOutError) {
    return jsonResponse({ error: 'Could not revoke active sessions' }, 500)
  }

  for (const table of userOwnedTables) {
    const { error } = await adminClient.from(table).delete().eq('user_id', userId)
    if (error) {
      return jsonResponse({ error: `Could not delete records from ${table}` }, 500)
    }
  }

  const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(userId, false)
  if (deleteUserError) {
    return jsonResponse({ error: 'Could not delete account' }, 500)
  }

  return jsonResponse({ deleted: true })
})
