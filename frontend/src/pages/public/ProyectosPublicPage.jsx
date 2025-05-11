import React from 'react'

const ProyectosPublicPage = () => {
  return (
    <div className="container mx-auto">
      {/* Header Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Nuestros{' '}
            <span className="text-[#4338CA]">
              Proyectos
            </span>
          </h1>
          <div className="w-24 h-1 bg-[#4338CA] mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra trayectoria a través de proyectos que transforman espacios y crean experiencias únicas
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project1.jpg" 
                  alt="Residencia Moderna"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Residencia Moderna
                </h3>
                <p className="text-gray-600 mb-4">
                  Diseño contemporáneo con espacios abiertos y acabados de lujo
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Residencial
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    2023
                  </span>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project2.jpg" 
                  alt="Centro Comercial"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Centro Comercial
                </h3>
                <p className="text-gray-600 mb-4">
                  Espacio comercial moderno con diseño funcional y sostenible
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Comercial
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    2023
                  </span>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project3.jpg" 
                  alt="Complejo Industrial"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Complejo Industrial
                </h3>
                <p className="text-gray-600 mb-4">
                  Instalaciones industriales con altos estándares de calidad
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Industrial
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    2023
                  </span>
                </div>
              </div>
            </div>

            {/* Project 4 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project4.jpg" 
                  alt="Edificio Corporativo"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Edificio Corporativo
                </h3>
                <p className="text-gray-600 mb-4">
                  Oficinas modernas con énfasis en eficiencia energética
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Corporativo
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    2022
                  </span>
                </div>
              </div>
            </div>

            {/* Project 5 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project5.jpg" 
                  alt="Hotel Boutique"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Hotel Boutique
                </h3>
                <p className="text-gray-600 mb-4">
                  Diseño elegante que combina lujo y confort
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Hotelería
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    2022
                  </span>
                </div>
              </div>
            </div>

            {/* Project 6 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src="/images/project6.jpg" 
                  alt="Complejo Residencial"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Complejo Residencial
                </h3>
                <p className="text-gray-600 mb-4">
                  Desarrollo residencial con amenidades de primer nivel
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Residencial
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    2022
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProyectosPublicPage 