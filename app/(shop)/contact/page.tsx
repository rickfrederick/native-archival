'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      // still show success
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--color-ivory)' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-charcoal)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-8 h-px mb-8" style={{ backgroundColor: 'var(--color-kraft)' }} />
          <h1
            className="text-4xl font-light tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-ivory)' }}
          >
            Contact Us
          </h1>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-silver)' }}
          >
            We respond within 1–2 business days
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Contact Details */}
          <div>
            <div className="space-y-10">
              <div>
                <div className="w-6 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
                <h3
                  className="text-xs font-medium uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Email
                </h3>
                <a
                  href="mailto:custservice@nativearchival.com"
                  className="text-xs"
                  style={{ color: 'var(--color-silver)' }}
                >
                  custservice@nativearchival.com
                </a>
              </div>
              <div>
                <div className="w-6 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
                <h3
                  className="text-xs font-medium uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Phone
                </h3>
                <a href="tel:3155024265" className="text-xs" style={{ color: 'var(--color-silver)' }}>
                  315-502-4265
                </a>
              </div>
              <div>
                <div className="w-6 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
                <h3
                  className="text-xs font-medium uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Mailing Address
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-silver)' }}>
                  Native Archival<br />
                  P.O. Box 475<br />
                  Palmyra, NY 14522
                </p>
              </div>
              <div>
                <div className="w-6 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
                <h3
                  className="text-xs font-medium uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Company
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-silver)' }}>
                  Operated by Pulp Packaging, Inc.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="text-center py-16">
                <div
                  className="w-8 h-px mx-auto mb-8"
                  style={{ backgroundColor: 'var(--color-kraft)' }}
                />
                <h2
                  className="text-xl font-light tracking-widest uppercase mb-4"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Message Sent
                </h2>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--color-silver)' }}
                >
                  We&apos;ll get back to you within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest mb-2"
                      style={{ color: 'var(--color-silver)' }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-sm border bg-transparent outline-none"
                      style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest mb-2"
                      style={{ color: 'var(--color-silver)' }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-sm border bg-transparent outline-none"
                      style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-2"
                    style={{ color: 'var(--color-silver)' }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm border bg-transparent outline-none"
                    style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-2"
                    style={{ color: 'var(--color-silver)' }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-4 py-3 text-sm border bg-transparent outline-none resize-none"
                    style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 text-xs uppercase tracking-widest font-medium transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-kraft)', color: 'var(--color-ivory)' }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
