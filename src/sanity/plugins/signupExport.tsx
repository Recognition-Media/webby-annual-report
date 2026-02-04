'use client'

import { definePlugin } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import { useState, useEffect, useCallback } from 'react'
import { Card, Stack, Button, Select, Text, Spinner } from '@sanity/ui'

interface Signup {
  id: string
  reportSlug: string
  formData: Record<string, string>
  timestamp: string
}

function SignupExportTool() {
  const [signups, setSignups] = useState<Signup[]>([])
  const [loading, setLoading] = useState(false)
  const [slugFilter, setSlugFilter] = useState('')

  const fetchSignups = useCallback(async () => {
    setLoading(true)
    try {
      const params = slugFilter ? `?reportSlug=${encodeURIComponent(slugFilter)}` : ''
      const res = await fetch(`/api/signups${params}`)
      const data = await res.json()
      setSignups(data.signups || [])
    } catch (err) {
      console.error('Failed to fetch signups', err)
    } finally {
      setLoading(false)
    }
  }, [slugFilter])

  useEffect(() => { fetchSignups() }, [fetchSignups])

  function exportCsv() {
    if (signups.length === 0) return

    const allKeys = new Set<string>()
    signups.forEach((s) => Object.keys(s.formData).forEach((k) => allKeys.add(k)))
    const headers = ['timestamp', 'reportSlug', ...Array.from(allKeys)]

    const rows = signups.map((s) =>
      headers.map((h) => {
        if (h === 'timestamp') return s.timestamp
        if (h === 'reportSlug') return s.reportSlug
        return s.formData[h] || ''
      })
    )

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `signups-${slugFilter || 'all'}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={3} weight="bold">Report Signups</Text>

        <Select value={slugFilter} onChange={(e) => setSlugFilter((e.target as HTMLSelectElement).value)}>
          <option value="">All Reports</option>
        </Select>

        <Button onClick={fetchSignups} text="Refresh" tone="primary" disabled={loading} />

        {loading ? (
          <Spinner />
        ) : (
          <>
            <Text size={1} muted>{signups.length} signups found</Text>
            <Button onClick={exportCsv} text="Export CSV" tone="positive" disabled={signups.length === 0} />
          </>
        )}
      </Stack>
    </Card>
  )
}

export const signupExportPlugin = definePlugin({
  name: 'signup-export',
  tools: [
    {
      name: 'signups',
      title: 'Signups',
      icon: UsersIcon,
      component: SignupExportTool,
    },
  ],
})
