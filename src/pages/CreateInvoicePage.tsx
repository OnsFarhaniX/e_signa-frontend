import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { createInvoice, getClients, getTemplates } from '../api/auth'

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
}

function CreateInvoicePage() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  const [form, setForm] = useState({
    clientId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 19 },
  ])

  useEffect(() => {
    getClients().then(res => {
      setClients(Array.isArray(res.data) ? res.data : [])
    }).catch(err => console.error(err))

    getTemplates().then(res => {
      setTemplates(Array.isArray(res.data) ? res.data : [])
    }).catch(err => console.error(err))
  }, [])

  const applyTemplate = (template: any) => {
    if (template.templateData?.items?.length > 0) {
      setItems(template.templateData.items.map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        taxRate: item.taxRate || 19
      })))
    }
    if (template.templateData?.defaultNotes) {
      setForm(prev => ({ ...prev, notes: template.templateData.defaultNotes }))
    }
    setShowTemplates(false)
    alert(`Template "${template.name}" applied successfully!`)
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, taxRate: 19 }])
  }

  const removeItem = (index: number) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const getLineTotal = (item: InvoiceItem) => item.quantity * item.unitPrice
  const getLineTax = (item: InvoiceItem) => getLineTotal(item) * (item.taxRate / 100)
  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0)
  const totalTax = items.reduce((sum, item) => sum + getLineTax(item), 0)
  const total = subtotal + totalTax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId) { alert('Please select a client'); return }
    if (items.some(item => !item.description || item.unitPrice === 0)) {
      alert('Please fill all invoice items'); return
    }
    try {
      setLoading(true)
      await createInvoice({
        clientId: form.clientId,
        issueDate: form.issueDate,
        dueDate: form.dueDate || null,
        currency: 'TND',
        notes: form.notes,
        items: items.map((item, index) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          sortOrder: index + 1
        }))
      })
      navigate('/invoices')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating invoice')
    } finally {
      setLoading(false)
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
            <span>Invoices</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">New Invoice</span>
          </div>
          <div className="flex gap-3">
            {templates.length > 0 && (
              <button
                onClick={() => setShowTemplates(true)}
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
              >
                Use Template
              </button>
            )}
            <button
              onClick={() => navigate('/invoices')}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Invoice</h2>
            <p className="text-gray-500 text-sm mt-1">Create a new invoice</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Invoice Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                  <select
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Items</h3>
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 mb-2 px-2">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-1">Tax %</div>
                <div className="col-span-1">Total</div>
                <div className="col-span-1"></div>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Description"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        min="1"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-1">
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
                    <div className="col-span-1 text-sm font-medium text-gray-700 text-right">
                      {getLineTotal(item).toFixed(2)}
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-600 text-lg font-bold"
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
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Item
              </button>
            </div>

            {/* Notes + Summary */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="additional notes..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal (excl. tax)</span>
                    <span className="font-medium">{subtotal.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Tax</span>
                    <span className="font-medium">{totalTax.toFixed(2)} TND</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-800">Total (incl. tax)</span>
                    <span className="font-bold text-blue-600 text-lg">{total.toFixed(2)} TND</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save as Draft'}
                </button>
              </div>
            </div>

          </form>
        </main>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Select a Template</h3>
              <button onClick={() => setShowTemplates(false)} className="text-gray-400 text-2xl">x</button>
            </div>

            {templates.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No templates available</p>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800">{template.name}</h4>
                        {template.description && (
                          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                        )}
                        {template.templateData?.items?.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {template.templateData.items.length} item(s)
                          </p>
                        )}
                      </div>
                      {template.isDefault && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowTemplates(false)}
              className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default CreateInvoicePage