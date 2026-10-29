import { Suspense } from 'react'
import AccountForm from './account-form'
import { createClient } from '@/lib/supabase/server'

async function AccountContent() {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()

  return <AccountForm claims={claimsData?.claims ?? null} />
}

export default function Account() {
  return (
    <Suspense fallback={<div className="form-widget">Loading account…</div>}>
      <AccountContent />
    </Suspense>
  )
}
