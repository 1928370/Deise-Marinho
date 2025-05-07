function inscrever(evento) {
    document.getElementById('eventoNome').value = evento;
    document.getElementById('formulario').style.display = "block";
}

function fecharFormulario() {
    document.getElementById('formulario').style.display = "none";
}

function processarInscricao(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const quantidade = document.getElementById('quantidade').value;
    const eventoNome = document.getElementById('eventoNome').value;

    alert(`Inscrição realizada com sucesso!\nEvento: ${eventoNome}\nNome: ${nome}\nEmail: ${email}\nQuantidade de Ingressos: ${quantidade}`);
    
    fecharFormulario();
    document.getElementById('inscricaoForm').reset();
}

// Adicionando efeito de luzes piscando no cabeçalho
function iniciarEfeitoLuzes() {
    const header = document.querySelector('header');
    let cores = ['#ff6f61', '#ff8566', '#ff9a9e', '#fad0c4'];
    let indice = 0;

    setInterval(() => {
        header.style.boxShadow = `0 0 20px ${cores[indice]}, 0 0 40px ${cores[(indice + 1) % cores.length]}`;
        indice = (indice + 1) % cores.length;
    }, 500);
}

// Função para verificar se o usuário é o dono
function verificarDono() {
    const senhaDono = prompt("Digite a senha para acessar a Área do Dono:");
    const senhaCorreta = "senha123"; // Substitua por uma senha segura

    if (senhaDono === senhaCorreta) {
        alternarArea('dono');
    } else {
        alert("Senha incorreta! Acesso negado.");
    }
}

// Modificando o botão para chamar a verificação de senha
const botaoDono = document.querySelector("button[onclick=\"alternarArea('dono')\"]");
if (botaoDono) {
    botaoDono.setAttribute("onclick", "verificarDono()");
}

// Função para enviar uma requisição POST para adicionar um evento
async function enviarEvento(nome, data, local) {
    try {
        const response = await fetch('http://192.168.100.9:3000/api/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, data, local }),
        });

        if (response.ok) {
            const evento = await response.json();
            alert(`Evento cadastrado com sucesso!\nNome: ${evento.nome}\nData: ${evento.data}\nLocal: ${evento.local}`);
        } else {
            const error = await response.json();
            alert(`Erro ao cadastrar evento: ${error.error}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar ao servidor.');
    }
}

// Ajustando a exibição de eventos no frontend
async function carregarEventos() {
    try {
        console.log('Iniciando carregamento de eventos...');
        const response = await fetch('http://192.168.100.9:3000/api/eventos');
        console.log('Resposta do servidor:', response);
        if (response.ok) {
            const eventos = await response.json();
            console.log('Eventos recebidos:', eventos);
            const eventosContainer = document.getElementById('eventos');

            eventosContainer.innerHTML = '<h2>Próximos Eventos</h2>';
            eventos.forEach(evento => {
                const eventoDiv = document.createElement('div');
                eventoDiv.className = 'evento';
                eventoDiv.innerHTML = `
                    <h3>${evento.nome}</h3>
                    <p>Data: ${new Date(evento.data).toLocaleDateString('pt-BR')}</p>
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
