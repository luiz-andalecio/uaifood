export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-2 text-center">Sobre o UAIFood</h1>
      <p className="text-center text-gray-600 mb-10">Conectando você aos melhores sabores da culinária mineira com praticidade e qualidade</p>

      <section className="rounded-xl bg-white p-6 shadow-sm mb-10">
        <h2 className="text-2xl font-semibold mb-3">Nossa História</h2>
        <p className="text-gray-700 leading-relaxed">
          O UAIFood nasceu da paixão pela comida mineira e do desejo de tornar pedidos de comida uma experiência mais prática e agradável.
          Combinamos tradição culinária com tecnologia moderna para levar até você o melhor da gastronomia.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          Nossa plataforma foi desenvolvida pensando em você, que busca qualidade, variedade e comodidade na hora de fazer seus pedidos.
          Trabalhamos com os melhores restaurantes e fornecedores para garantir que cada refeição seja uma experiência memorável.
        </p>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold">Feito com Amor</h3>
            <p className="text-gray-700 text-sm mt-1">Cada prato é preparado com ingredientes selecionados e muito carinho</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold">Entrega Rápida</h3>
            <p className="text-gray-700 text-sm mt-1">Seu pedido chega quentinho e no horário combinado</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold">Para Todos</h3>
            <p className="text-gray-700 text-sm mt-1">Opções variadas para todos os gostos e preferências</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold">Qualidade Garantida</h3>
            <p className="text-gray-700 text-sm mt-1">Compromisso com excelência em cada detalhe</p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Nossa Missão</h2>
          <p className="text-gray-700">
            Proporcionar experiências gastronômicas excepcionais, conectando pessoas à comida de qualidade através de uma plataforma moderna, segura e fácil de usar.
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Nossos Valores</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li><strong>Qualidade:</strong> Ingredientes frescos e preparos cuidadosos</li>
            <li><strong>Transparência:</strong> Informações claras sobre produtos e preços</li>
            <li><strong>Inovação:</strong> Tecnologia a serviço da melhor experiência</li>
            <li><strong>Compromisso:</strong> Satisfação do cliente em primeiro lugar</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
