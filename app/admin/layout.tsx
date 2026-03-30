import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdmin = await verifyAdminSession()

  // Allow access to login page without auth
  // We handle this by checking the path, but since layout can't access pathname easily,
  // we'll let the login page render and redirect from non-login pages via middleware approach.
  // Instead, we protect here but exempt login by catching the redirect in login page itself.
  // Actually safest: just check and redirect to login if not authed.
  // The login page itself won't use this layout if we move it outside, but per spec it's inside admin.
  // So we need to not redirect for /admin/login - we'll use a workaround:
  // render children always, but wrap in a check that skips for the login path.
  // Since we can't access pathname in layout cleanly, we'll pass isAdmin as a data attribute.

  return (
    <AdminLayoutInner isAdmin={isAdmin}>
      {children}
    </AdminLayoutInner>
  )
}

function AdminLayoutInner({
  children,
  isAdmin,
}: {
  children: React.ReactNode
  isAdmin: boolean
}) {
  // We can't conditionally redirect from a client component, so we use a server-side approach:
  // The login page itself is accessible; all other admin pages check isAdmin.
  // For the layout, we show the sidebar only when authenticated.
  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {isAdmin ? (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside
            className="w-56 flex-shrink-0 border-r"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <div className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
              <Link href="/admin" className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Native Archival
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
            </div>
            <nav className="p-4 space-y-1">
              {[
                { href: '/admin', label: 'Dashboard' },
                { href: '/admin/products', label: 'Products' },
                { href: '/admin/orders', label: 'Orders' },
                { href: '/admin/customers', label: 'Customers' },
                { href: '/admin/blog', label: 'Blog' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-sm rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                <Link
                  href="/"
                  className="block px-3 py-2 text-sm rounded text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  ← View Site
                </Link>
                <form action="/api/admin/logout" method="POST">
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-2 text-sm rounded text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </nav>
          </aside>
          {/* Main */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}
