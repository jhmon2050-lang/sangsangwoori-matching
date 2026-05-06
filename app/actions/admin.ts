'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function assignMatch(matchId: string) {
  const { error } = await supabase
    .from('matches')
    .update({ status: 'assigned' })
    .eq('id', matchId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
}
