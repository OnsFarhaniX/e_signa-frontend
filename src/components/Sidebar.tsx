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
        { path: '/signatures', label: 'Signatures' },
      ]
    },
  ]

  const adminMenuGroups = [
    {
      
      items: [
        { path: '/dashboard', label: 'Dashboard' },
      ]
    },
    {
      label: 'ADMINISTRATION',
      items: [
        { path: '/admin', label: 'Users' },
        { path: '/settings', label: 'Settings' },
      ]
    }
  ]

  const menuGroups = isAdmin ? adminMenuGroups : userMenuGroups

  return (
   <div className="w-56 min-h-screen bg-blue-700 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2">
          
          <span className="font-bold text-white text-lg">E-Signature</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-2">
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
            <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider px-3 mb-2">
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
      ? 'bg-white text-blue-700'
      : 'text-white hover:bg-blue-600'
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
      <div className="px-3 py-4 border-t border-blue-600">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isAdmin ? 'bg-purple-600' : 'bg-blue-600'
          }`}>
            <span className="text-white text-xs font-bold">
              {isAdmin ? 'A' : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {isAdmin ? 'Admin' : 'User'}
            </p>
            <p className="text-xs text-blue-200 truncate">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
         className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-blue-600 transition"
        >
          Log out
        </button>
      </div>

    </div>
  )
}

export default Sidebar