'use client'

import { definePlugin } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import { useState, useEffect, useCallback } from 'react'
import { Card, Stack, Button, Text, Spinner } from '@sanity/ui'

const API_URL = process.env.NEXT_PUBLIC_SIGNUP_API_URL || ''

interface Signup {
  id: string
  reportSlug: string
  formData: Record<string, string>
  timestamp: string
}

function SignupExportTool() {
  const [signups, setSignups] = useState<Signup[]>([])
  const [loading, setLoading] = useState(true)
  const [slugFilter, setSlugFilter] = useState('')
  const [error, setError] = useState('')

  const fetchSignups = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (!API_URL) {
        setError('Signup API URL not configured')
        return
      }
      const params = slugFilter ? `?reportSlug=${encodeURIComponent(slugFilter)}` : ''
      const res = await fetch(`${API_URL}/signups${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSignups(data.signups || [])
    } catch (err) {
      console.error('Failed to fetch signups', err)
      setError(`Failed to load signups: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }, [slugFilter])

  useEffect(() => { fetchSignups() }, [fetchSignups])

  const uniqueSlugs = Array.from(new Set(signups.map((s) => s.reportSlug))).sort()

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

  async function deleteSignup(id: string) {
    if (!confirm('Delete this signup?')) return
    try {
      const res = await fetch(`${API_URL}/signup?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSignups((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error('Failed to delete signup', err)
      alert('Failed to delete signup')
    }
  }

  const allKeys = signups.length > 0
    ? Array.from(new Set(signups.flatMap((s) => Object.keys(s.formData))))
    : []

  const filtered = slugFilter
    ? signups.filter((s) => s.reportSlug === slugFilter)
    : signups
  const sorted = [...filtered].sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={3} weight="bold">Report Signups</Text>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={slugFilter}
            onChange={(e) => setSlugFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: 14,
              border: '1px solid #ccc',
              borderRadius: 4,
              background: 'white',
              minWidth: 200,
            }}
          >
            <option value="">All Reports</option>
            {uniqueSlugs.map((slug) => (
              <option key={slug} value={slug}>{slug}</option>
            ))}
          </select>
          <Button onClick={fetchSignups} text="Refresh" tone="primary" disabled={loading} />
          <Button onClick={exportCsv} text="Export CSV" tone="positive" disabled={signups.length === 0} />
        </div>

        {error && <Text size={1} style={{ color: '#d00' }}>{error}</Text>}

        {loading ? (
          <Spinner />
        ) : (
          <>
            <Text size={1} muted>{sorted.length} signups{slugFilter ? ` for ${slugFilter}` : ''}</Text>

            {sorted.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>Date</th>
                      <th style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>Report</th>
                      {allKeys.map((k) => (
                        <th key={k} style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{k}</th>
                      ))}
                      <th style={{ padding: '8px 12px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}>
                          {new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '6px 12px' }}>{s.reportSlug}</td>
                        {allKeys.map((k) => (
                          <td key={k} style={{ padding: '6px 12px' }}>{s.formData[k] || ''}</td>
                        ))}
                        <td style={{ padding: '6px 12px' }}>
                          <button
                            onClick={() => deleteSignup(s.id)}
                            style={{ background: 'none', border: 'none', color: '#d00', cursor: 'pointer', fontSize: 13 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
