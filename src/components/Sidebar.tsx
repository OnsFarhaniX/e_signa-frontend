import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', label: ' Dashboard' },
    { path: '/invoices', label: 'Invoices' },
    { path: '/clients', label: ' Clients' },
    { path: '/signatures', label: ' Signatures' },
    { path: '/settings', label: 'Settings' },
    { path: '/templates', label: 'Templates' },
  ]

  return (
    <div className="w-64 min-h-screen bg-blue-700 text-white flex flex-col">
      <div className="p-6 border-b border-blue-600">
        <h1 className="text-xl font-bold"> E-Signature</h1>
       
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition font-medium ${
                isActive ? 'bg-white text-blue-700' : 'text-blue-100 hover:bg-blue-600'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-600">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 text-left text-blue-100 hover:bg-blue-600 rounded-lg transition"
        >
           Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar