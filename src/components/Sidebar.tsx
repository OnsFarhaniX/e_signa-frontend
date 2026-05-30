import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'USER'
  const isAdmin = role === 'ADMIN'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const userMenuGroups = [
    {
      
      items: [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/invoices', label: 'Invoices' },
        { path: '/clients', label: 'Clients' },
        { path: '/templates', label: 'Templates' },
        { path: '/signatures', label: 'Signatures'},
      ]
    },
    
  ]

  const adminMenuGroups = [
    {
      label: 'MAIN',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'H' },
      ]
    },
    {
      label: 'ADMINISTRATION',
      items: [
        { path: '/admin', label: 'Users', icon: 'U' },
        { path: '/settings', label: 'Settings', icon: 'G' },
      ]
    }
  ]

  const menuGroups = isAdmin ? adminMenuGroups : userMenuGroups

  return (
    <div className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ES</span>
          </div>
          <span className="font-bold text-gray-800 text-lg">E-Signature</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-2 border-b border-gray-100">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          isAdmin
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {isAdmin ? 'Administrator' : 'User'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold">
                    {item.icon}
                  </div>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isAdmin ? 'bg-purple-600' : 'bg-blue-600'
          }`}>
            <span className="text-white text-xs font-bold">
              {isAdmin ? 'A' : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {isAdmin ? 'Admin' : 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          Log out
        </button>
      </div>

    </div>
  )
}

export default Sidebar