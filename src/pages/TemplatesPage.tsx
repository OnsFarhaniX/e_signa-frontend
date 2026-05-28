import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getTemplates, createTemplate, deleteTemplate, setDefaultTemplate } from '../api/auth'

interface TemplateItem {
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
}

function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    isDefault: false,
  })

  const [items, setItems] = useState<TemplateItem[]>([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 19 }
  ])

  useEffect(() => { fetchTemplates() }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const res = await getTemplates()
      setTemplates(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Error loading templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, taxRate: 19 }])
  }

  const removeItem = (index: number) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof TemplateItem, value: string | number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const handleCreate = async () => {
    if (!form.name) { setError('Name is required'); return }
    if (items.some(item => !item.description)) {
      setError('Please fill all item descriptions'); return
    }
    try {
      setSaving(true)
      setError('')
      await createTemplate({
        name: form.name,
        description: form.description,
        isDefault: form.isDefault,
        templateData: {
          items: items,
          defaultNotes: '',
          defaultCurrency: 'TND'
        }
      })
      setShowModal(false)
      setForm({ name: '', description: '', isDefault: false })
      setItems([{ description: '', quantity: 1, unitPrice: 0, taxRate: 19 }])
      setError('')
      fetchTemplates()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating template')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this template?')) return
    try {
      await deleteTemplate(id)
      fetchTemplates()
    } catch (err) {
      alert('Error deleting template')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultTemplate(id)
      fetchTemplates()
    } catch (err) {
      alert('Error setting default template')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Templates</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            + New Template
          </button>
        </div>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Invoice Templates</h2>
            <p className="text-gray-500 text-sm mt-1">
              Create reusable templates to speed up invoice creation
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : templates.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 mb-4">No templates yet</p>
              
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-6">

                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      )}
                    </div>
                    {template.isDefault && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Items preview */}
                  {template.templateData?.items?.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Items :</p>
                      {template.templateData.items.slice(0, 2).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs text-gray-600 py-1">
                          <span>{item.description}</span>
                          <span className="font-medium">{item.unitPrice} TND</span>
                        </div>
                      ))}
                      {template.templateData.items.length > 2 && (
                        <p className="text-xs text-gray-400 mt-1">
                          +{template.templateData.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mb-4">
                    Created: {new Date(template.createdAt).toLocaleDateString('en-GB')}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!template.isDefault && (
                      <button
                        onClick={() => handleSetDefault(template.id)}
                        className="flex-1 text-xs bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="flex-1 text-xs bg-red-50 text-red-500 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Create Template */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">

            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">New Template</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">x</button>
            </div>

            <div className="p-6 space-y-5">

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Template Name *"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Default Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Invoice Items
                </label>

                {/* Items Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 mb-2 px-1">
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-3">Unit Price</div>
                  <div className="col-span-2">Tax %</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                          min="1"
                          className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                          min="0"
                          step="0.01"
                          className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={item.taxRate}
                          onChange={(e) => updateItem(index, 'taxRate', Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={0}>0%</option>
                          <option value={7}>7%</option>
                          <option value={13}>13%</option>
                          <option value={19}>19%</option>
                        </select>
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-400 hover:text-red-600 font-bold"
                        >
                          x
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Set as default template</span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Template'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default TemplatesPage