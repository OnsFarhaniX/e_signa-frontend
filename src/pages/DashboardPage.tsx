import Sidebar from '../components/Sidebar'

function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Invoices</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Signed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">18</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">4</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Sent to TNN</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">12</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Invoices</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Number</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 font-medium">INV-2026-001</td>
                <td className="py-3 text-gray-600">Client A</td>
                <td className="py-3 text-gray-600">1,200 TND</td>
                <td className="py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Signed</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium">INV-2026-002</td>
                <td className="py-3 text-gray-600">Client B</td>
                <td className="py-3 text-gray-600">850 TND</td>
                <td className="py-3">
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">Pending</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium">INV-2026-003</td>
                <td className="py-3 text-gray-600">Client C</td>
                <td className="py-3 text-gray-600">3,400 TND</td>
                <td className="py-3">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">Sent to TNN</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage