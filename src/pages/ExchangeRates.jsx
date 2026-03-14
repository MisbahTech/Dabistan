import { useState } from 'react'
import {
  useCreateExchangeRateMutation,
  useDeleteExchangeRateMutation,
  useExchangeRatesQuery,
  useUpdateExchangeRateMutation,
} from '../services/exchangeRatesApi'

const emptyForm = { base: '', currency: '', rate: '' }

export default function ExchangeRatesPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const exchangeRatesQuery = useExchangeRatesQuery()
  const createRate = useCreateExchangeRateMutation()
  const updateRate = useUpdateExchangeRateMutation()
  const deleteRate = useDeleteExchangeRateMutation()

  const items = exchangeRatesQuery.data ?? []
  const isLoading = exchangeRatesQuery.isLoading
  const isSaving = createRate.isPending || updateRate.isPending || deleteRate.isPending

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateRate.mutateAsync({ id: editingId, payload: form })
      } else {
        await createRate.mutateAsync(form)
      }
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      base: item.base ?? '',
      currency: item.currency ?? '',
      rate: item.rate ?? '',
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exchange rate?')) {
      return
    }
    setError('')
    try {
      await deleteRate.mutateAsync(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingId ? 'Edit Exchange Rate' : 'Add Exchange Rate'}</h3>
            <p className="muted">Cache exchange rates for the public site.</p>
          </div>
          {editingId ? (
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(emptyForm)
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Base</span>
            <input
              type="text"
              value={form.base}
              onChange={(event) => setForm((prev) => ({ ...prev, base: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Currency</span>
            <input
              type="text"
              value={form.currency}
              onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Rate</span>
            <input
              type="number"
              step="0.0001"
              value={form.rate}
              onChange={(event) => setForm((prev) => ({ ...prev, rate: event.target.value }))}
              required
            />
          </label>
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update Rate' : 'Add Rate'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Exchange Rates</h3>
            <p className="muted">Cached currency exchange rates.</p>
          </div>
        </div>
        {exchangeRatesQuery.error ? (
          <div className="alert error">{exchangeRatesQuery.error.message}</div>
        ) : null}
        {isLoading ? <div className="muted">Loading rates...</div> : null}
        {items.length === 0 && !isLoading ? <div className="muted">No rates yet.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Base</span>
            <span>Currency</span>
            <span>Rate</span>
            <span>Actions</span>
          </div>
          {items.map((item) => (
            <div key={item.id} className="table-row cols-4">
              <span>{item.base}</span>
              <span>{item.currency}</span>
              <span>{item.rate}</span>
              <div className="actions">
                <button className="btn ghost" type="button" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="btn danger" type="button" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
