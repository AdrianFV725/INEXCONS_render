import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="container mx-auto">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Construimos el{' '}
              <span className="text-[#4338CA]">
                futuro
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transformamos espacios con diseños innovadores y construcción de calidad
            </p>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link
              to="/login"
              className="px-8 py-4 bg-[#4338CA] text-white font-medium rounded-lg hover:bg-[#3730A3] transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
            >
              Iniciar Proyecto
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proyectos Destacados
            </h2>
            <div className="w-24 h-1 bg-[#4338CA] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project1.jpg" 
                  alt="Proyecto Residencial"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Residencia Moderna
                </h3>
                <p className="text-gray-600 mb-4">
                  Diseño contemporáneo con espacios abiertos y acabados de lujo
                </p>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project2.jpg" 
                  alt="Proyecto Comercial"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Centro Comercial
                </h3>
                <p className="text-gray-600 mb-4">
                  Espacio comercial moderno con diseño funcional y sostenible
                </p>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project3.jpg" 
                  alt="Proyecto Industrial"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Complejo Industrial
                </h3>
                <p className="text-gray-600 mb-4">
                  Instalaciones industriales con altos estándares de calidad
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage 