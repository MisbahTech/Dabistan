import { useState } from 'react'
import {
  useCreateWeatherMutation,
  useDeleteWeatherMutation,
  useUpdateWeatherMutation,
  useWeatherQuery,
} from '../services/weatherApi'

const emptyForm = { location: '', temperature: '', condition: '' }

export default function WeatherPage() {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const weatherQuery = useWeatherQuery()
  const createWeather = useCreateWeatherMutation()
  const updateWeather = useUpdateWeatherMutation()
  const deleteWeather = useDeleteWeatherMutation()

  const items = weatherQuery.data ?? []
  const isLoading = weatherQuery.isLoading
  const isSaving = createWeather.isPending || updateWeather.isPending || deleteWeather.isPending

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateWeather.mutateAsync({ id: editingId, payload: form })
      } else {
        await createWeather.mutateAsync(form)
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
      location: item.location ?? '',
      temperature: item.temperature ?? '',
      condition: item.condition ?? '',
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this weather entry?')) {
      return
    }
    setError('')
    try {
      await deleteWeather.mutateAsync(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>{editingId ? 'Edit Weather' : 'Add Weather'}</h3>
            <p className="muted">Cache weather snapshots.</p>
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
            <span>Location</span>
            <input
              type="text"
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Temperature</span>
            <input
              type="number"
              step="0.1"
              value={form.temperature}
              onChange={(event) => setForm((prev) => ({ ...prev, temperature: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Condition</span>
            <input
              type="text"
              value={form.condition}
              onChange={(event) => setForm((prev) => ({ ...prev, condition: event.target.value }))}
              required
            />
          </label>
          {error ? <div className="alert error full">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingId ? 'Update Weather' : 'Add Weather'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Weather Cache</h3>
            <p className="muted">Latest cached weather entries.</p>
          </div>
        </div>
        {weatherQuery.error ? (
          <div className="alert error">{weatherQuery.error.message}</div>
        ) : null}
        {isLoading ? <div className="muted">Loading weather...</div> : null}
        {items.length === 0 && !isLoading ? <div className="muted">No weather entries yet.</div> : null}
        <div className="table">
          <div className="table-row table-head cols-4">
            <span>Location</span>
            <span>Temperature</span>
            <span>Condition</span>
            <span>Actions</span>
          </div>
          {items.map((item) => (
            <div key={item.id} className="table-row cols-4">
              <span>{item.location}</span>
              <span>{item.temperature}</span>
              <span>{item.condition}</span>
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
