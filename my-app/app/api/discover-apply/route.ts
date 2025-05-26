import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  const { email, xHandle, tgHandle, role, otherRole, description } = await request.json()

  if (!email || !xHandle || !tgHandle || !role || !description) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const finalRole = role === 'other' ? otherRole : role

  try {
    const { data, error } = await supabaseClient
      .from('discover_applicants')
      .insert([
        {
          email,
          x_handle: xHandle,
          tg_handle: tgHandle,
          role: finalRole,
          description,
        }
      ])

    if (error) throw error

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
