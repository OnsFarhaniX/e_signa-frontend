import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { createInvoice, getClients } from '../api/auth'

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
}

function CreateInvoicePage() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    clientId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 19 },
  ])

  // Charge les clients au démarrage
  useEffect(() => {
    getClients().then(res => {
      setClients(Array.isArray(res.data) ? res.data : [])
    }).catch(err => console.error(err))
  }, [])

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

    if (!form.clientId) {
      alert('Please select a client')
      return
    }
    if (items.some(item => !item.description || item.unitPrice === 0)) {
      alert('Please fill all invoice items')
      return
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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">New Invoice</h2>
            <p className="text-gray-500">Create a new invoice</p>
          </div>
          <button
            onClick={() => navigate('/invoices')}
            className="text-gray-500 hover:text-gray-700 text-sm border border-gray-300 px-4 py-2 rounded-lg"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Invoice Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Information</h3>
            <div className="grid grid-cols-3 gap-4">

              {/* Client Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client *
                </label>
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date *
                </label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
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
          <div className="bg-white rounded-xl shadow p-6">
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
                      placeholder="Service or product description"
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

          {/* Notes + Totals */}
          <div className="grid grid-cols-2 gap-6">

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Payment terms or additional notes..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="bg-white rounded-xl shadow p-6">
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
                  <span className="font-bold text-blue-600 text-lg">
                    {total.toFixed(2)} TND
                  </span>
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
  )
}

export default CreateInvoicePage