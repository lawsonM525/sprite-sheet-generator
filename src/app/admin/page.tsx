import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { headers } from 'next/headers'

const ADMIN_EMAILS = new Set([
  'mlawsy525@gmail.com',
  'michelle@michellelawson.me',
])

export default async function AdminPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await getServerSession(authOptions)
  const email = (session?.user as any)?.email
  if (!email || !ADMIN_EMAILS.has(email)) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Admin</h1>
        <p className="text-red-600">Access denied. You must be an admin to view this page.</p>
      </div>
    )
  }

  const timeframe = (Array.isArray(searchParams?.t) ? searchParams?.t[0] : searchParams?.t) || '30d'
  const hdrs = headers()
  const host = hdrs.get('x-forwarded-host') || hdrs.get('host')
  const proto = hdrs.get('x-forwarded-proto') || 'http'
  const baseUrl = `${proto}://${host}`
  const cookie = hdrs.get('cookie') || ''
  const res = await fetch(`${baseUrl}/api/admin/generation-logs/summary?timeframe=${encodeURIComponent(timeframe)}`, {
    cache: 'no-store',
    headers: { cookie },
  })
  if (!res.ok) {
    throw new Error('Failed to load summary')
  }
  const data = await res.json()

  const tabs = [
    { key: '7d', label: '7d' },
    { key: '30d', label: '30d' },
    { key: '90d', label: '90d' },
    { key: 'all', label: 'All' },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Analytics</h1>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/admin?t=${t.key}`}
              className={`px-3 py-1 rounded border ${timeframe === t.key ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      <section>
        <h2 className="text-lg font-medium mb-2">Totals ({data.timeframe})</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded border p-4">
            <div className="text-sm text-gray-500">All</div>
            <div className="text-2xl font-semibold">{data.totals.all}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-gray-500">Success</div>
            <div className="text-2xl font-semibold text-green-600">{data.totals.success}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-gray-500">Failed</div>
            <div className="text-2xl font-semibold text-red-600">{data.totals.failed}</div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-medium mb-2">Top Concepts</h2>
          <div className="rounded border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2">Concept</th>
                  <th className="text-right p-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {data.topConcepts.map((c: any) => (
                  <tr key={c.concept} className="border-t">
                    <td className="p-2">{c.concept || <span className="text-gray-400">(empty)</span>}</td>
                    <td className="p-2 text-right">{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-2">Top Styles</h2>
          <div className="rounded border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2">Style</th>
                  <th className="text-right p-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {data.topStyles.map((s: any) => (
                  <tr key={s.style} className="border-t">
                    <td className="p-2">{s.style || <span className="text-gray-400">(empty)</span>}</td>
                    <td className="p-2 text-right">{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-lg font-medium mb-2">By Plan</h2>
        <div className="rounded border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2">Plan</th>
                <th className="text-right p-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {data.byPlan.map((p: any) => (
                <tr key={p.plan || 'unknown'} className="border-t">
                  <td className="p-2">{p.plan || 'unknown'}</td>
                  <td className="p-2 text-right">{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
