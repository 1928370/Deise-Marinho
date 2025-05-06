<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Site de Eventos</title>
</head>
<body>
    <header>
        <h1>Eventos Locais</h1>
    </header>

    <main>
        <section id="eventos">
            <h2>Próximos Eventos</h2>
            <div class="evento">
                <h3>Show de Música</h3>
                <p>Data: 20/05/2025</p>
                <p>Local: Praça Central</p>
                <button onclick="inscrever('Show de Música')">Inscrever-se</button>
            </div>
            <div class="evento">
                <h3>Feira de Artesanato</h3>
                <p>Data: 25/05/2025</p>
                <p>Local: Centro Cultural</p>
                <button onclick="inscrever('Feira de Artesanato')">Inscrever-se</button>
            </div>
        </section>

        <!-- Área do Dono -->
        <section id="dono" style="display: none;">
            <h2>Área do Dono</h2>
            <div class="evento">
                <h3>Adicionar Novo Evento</h3>
                <form id="novoEventoForm" onsubmit="return adicionarEvento(event)">
                    <input type="text" id="novoEventoNome" placeholder="Nome do Evento" required>
                    <input type="date" id="novoEventoData" required>
                    <input type="text" id="novoEventoLocal" placeholder="Local do Evento" required>
                    <button type="submit">Adicionar Evento</button>
                </form>
            </div>
            <div id="listaEventos">
                <h3>Eventos Cadastrados</h3>
                <ul id="eventosCadastrados"></ul>
            </div>
        </section>

        <section id="formularioEvento">
            <h2>Cadastrar Novo Evento</h2>
            <form onsubmit="cadastrarEvento(event)">
                <input type="text" id="nomeEvento" placeholder="Nome do Evento" required>
                <input type="date" id="dataEvento" required>
                <input type="text" id="localEvento" placeholder="Local do Evento" required>
                <button type="submit">Cadastrar Evento</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Site de Eventos</p>
    </footer>

    <div id="formulario" class="modal">
        <div class="modal-conteudo">
            <span class="fechar" onclick="fecharFormulario()">&times;</span>
            <h2>Inscrição</h2>
            <form id="inscricaoForm" onsubmit="return processarInscricao(event)">
                <input type="text" id="nome" placeholder="Seu Nome" required>
                <input type="email" id="email" placeholder="Seu Email" required>
                <input type="number" id="quantidade" placeholder="Quantidade de Ingressos" required>
                <input type="hidden" id="eventoNome">
                <button type="submit">Enviar</button>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        // Função para alternar entre a área do público e a área do dono
        function alternarArea(area) {
            document.getElementById('eventos').style.display = area === 'publico' ? 'block' : 'none';
            document.getElementById('dono').style.display = area === 'dono' ? 'block' : 'none';
        }

        // Função para adicionar um novo evento
        function adicionarEvento(event) {
            event.preventDefault();

            const nome = document.getElementById('novoEventoNome').value;
            const data = document.getElementById('novoEventoData').value;
            const local = document.getElementById('novoEventoLocal').value;

            const lista = document.getElementById('eventosCadastrados');
            const novoItem = document.createElement('li');
            novoItem.textContent = `${nome} - ${data} - ${local}`;
            lista.appendChild(novoItem);

            document.getElementById('novoEventoForm').reset();
            alert('Evento adicionado com sucesso!');
        }

        function cadastrarEvento(event) {
            event.preventDefault();

            const nome = document.getElementById('nomeEvento').value;
            const data = document.getElementById('dataEvento').value;
            const local = document.getElementById('localEvento').value;

            enviarEvento(nome, data, local);
        }

        // Função para carregar eventos do servidor e exibi-los na página
        async function carregarEventos() {
            try {
                const response = await fetch('http://localhost:3000/api/eventos');
                if (response.ok) {
                    const eventos = await response.json();
                    const eventosContainer = document.getElementById('eventos');

                    eventosContainer.innerHTML = '<h2>Próximos Eventos</h2>';
                    eventos.forEach(evento => {
                        const eventoDiv = document.createElement('div');
                        eventoDiv.className = 'evento';
                        eventoDiv.innerHTML = `
                            <h3>${evento.nome}</h3>
                            <p>Data: ${new Date(evento.data).toLocaleDateString()}</p>
                            <p>Local: ${evento.local}</p>
                            <button onclick="inscrever('${evento.nome}')">Inscrever-se</button>
                        `;
                        eventosContainer.appendChild(eventoDiv);
                    });
                } else {
                    console.error('Erro ao carregar eventos:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao conectar ao servidor:', error);
            }
        }

        // Carregar eventos ao carregar a página
        window.onload = () => {
            iniciarEfeitoLuzes();
            carregarEventos();
        };
    </script>

    <!-- Botões para alternar entre as áreas -->
    <div style="text-align: center; margin: 20px;">
        <button onclick="alternarArea('publico')">Área do Público</button>
        <button onclick="alternarArea('dono')">Área do Dono</button>
    </div>
</body>
</html>
