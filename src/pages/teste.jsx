export default function Teste() {
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Cabeçalho */}
            <header className="bg-blue-600 text-white py-6 shadow-lg">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Página de Teste</h1>
                    <p className="mt-2 text-lg">Criado com Next.js e Tailwind CSS</p>
                </div>
            </header>

            {/* Seção de Botões */}
            <section className="container mx-auto my-8 px-4">
                <h2 className="text-2xl font-semibold mb-4">Botões</h2>
                <div className="flex flex-wrap gap-4 justify-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        Botão Primário
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                        Botão Secundário
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                        Botão Perigo
                    </button>
                </div>
            </section>

            {/* Seção de Cards */}
            <section className="container mx-auto my-8 px-4">
                <h2 className="text-2xl font-semibold mb-4">Cards</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
                        <h3 className="text-xl font-semibold mb-2">Card 1</h3>
                        <p className="text-gray-700">
                            Este é um card de exemplo criado com Tailwind CSS.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
                        <h3 className="text-xl font-semibold mb-2">Card 2</h3>
                        <p className="text-gray-700">
                            Adicione informações ou conteúdos relevantes aqui.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
                        <h3 className="text-xl font-semibold mb-2">Card 3</h3>
                        <p className="text-gray-700">
                            Componentes prontos facilitam a construção de layouts.
                        </p>
                    </div>
                </div>
            </section>

            {/* Rodapé */}
            <footer className="bg-gray-800 text-white py-6 mt-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Meu Projeto Next.js com Tailwind CSS</p>
                    <p className="text-gray-400 mt-1">Criado para fins de teste</p>
                </div>
            </footer>
        </div>
    );
}
