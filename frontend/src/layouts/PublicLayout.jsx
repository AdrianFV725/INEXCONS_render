import { Link, Outlet, useLocation } from 'react-router-dom'

const PublicLayout = () => {
  const location = useLocation()

  // Función para verificar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path ? 'text-[#4338CA]' : 'text-gray-600 hover:text-gray-900'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#4338CA]">INEXCONS</span>
              </Link>
              
              {/* Links de navegación */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link to="/" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}>
                  Inicio
                </Link>
                <Link to="/proyectos" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/proyectos')}`}>
                  Proyectos
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <Link
                to="/login"
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#4338CA] hover:bg-[#3730A3] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Iniciar Sesión
              </Link>
              
              {/* Botón de menú móvil */}
              <div className="md:hidden flex items-center ml-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4338CA]"
                  aria-expanded="false"
                >
                  <span className="sr-only">Abrir menú principal</span>
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PublicLayout 