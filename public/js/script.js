const addButton = document.getElementById('addButton');
const addModal = document.getElementById('addModal');
const addForm = document.getElementById('addForm');
const detailsModal = document.getElementById('detailsModal');
const messageElement = document.getElementById('message');
const integrantesList = document.getElementById('integrantesList');
const totalIntegrantesElement = document.getElementById('totalIntegrantes');
const errorModal = document.getElementById('errorModal');
const errorMessageElement = document.getElementById('errorMessage');
const confirmButton = document.getElementById('confirmButton');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const noUsersMessage = document.getElementById('noUsersMessage');
const toggleButton = document.getElementById('toggleButton'); // Botão de expandir/ocultar lista
let integrantes = [];

// Carrega os integrantes ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/integrantes')
        .then(response => response.json())
        .then(data => {
            integrantes = data;
            renderIntegrantes();
        })
        .catch(error => console.error('Erro ao carregar integrantes:', error));
});

// Função para exibir a lista de integrantes e atualizar o total
function renderIntegrantes(integrantesToRender = integrantes) {
    integrantesList.innerHTML = ''; // Limpa a lista antes de renderizar
    integrantesToRender.forEach(integrante => {
        const li = document.createElement('li');
        li.textContent = `${integrante.nome} - ${integrante.cpf}`;
        li.onclick = () => showDetails(integrante); // Exibe detalhes
        integrantesList.appendChild(li);
    });

    // Atualiza o total de integrantes
    totalIntegrantesElement.textContent = `Total: ${integrantesToRender.length}`;
}

// Função para alternar a visibilidade da lista de usuários
toggleButton.addEventListener('click', () => {
    if (integrantesList.style.display === 'none' || integrantesList.style.display === '') {
        integrantesList.style.display = 'block';
        toggleButton.textContent = '▲ Lista de Usuários'; // Seta para cima

        // Verifica se não há integrantes e mostra a mensagem
        if (integrantes.length === 0) {
            noUsersMessage.classList.remove('hidden'); // Mostra a mensagem de "Nenhum usuário"
            noUsersMessage.style.color = 'red'; // Define a cor vermelha
        } else {
            noUsersMessage.classList.add('hidden'); // Esconde a mensagem se houver usuários
        }
    } else {
        integrantesList.style.display = 'none';
        toggleButton.textContent = '▼ Lista de Usuários'; // Seta para baixo
        noUsersMessage.classList.add('hidden'); // Esconde a mensagem
    }
});

// Função para buscar integrantes pelo nome ou CPF
// Função para buscar integrantes pelo nome ou CPF
function searchIntegrantes() {
    const searchTerm = searchInput.value.toLowerCase();
    const isCpfSearch = /^\d/.test(searchTerm);

    const filteredIntegrantes = integrantes.filter(integrante => {
        if (isCpfSearch) {
            return integrante.cpf.includes(searchTerm);
        } else {
            return integrante.nome.toLowerCase().includes(searchTerm);
        }
    });

    renderIntegrantes(filteredIntegrantes);

    // Exibe a notificação de erro se nenhum integrante for encontrado
    const searchError = document.getElementById('searchError');
    if (filteredIntegrantes.length === 0) {
        searchError.classList.remove('hidden'); // Exibe a notificação de erro

        // Define um temporizador para ocultar a notificação após 3 segundos
        setTimeout(() => {
            searchError.classList.add('hidden');
        }, 3000); // 3000 milissegundos = 3 segundos
    } else {
        searchError.classList.add('hidden'); // Esconde a notificação de erro
    }
}

// Evento para acionar a busca ao clicar no botão
searchButton.onclick = searchIntegrantes;

// Permite buscar ao pressionar "Enter" no campo de busca
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchIntegrantes();
    }
});

// Formata o CPF no campo de busca
searchInput.addEventListener('input', (event) => {
    if (/^\d/.test(event.target.value)) { 
        let cpfValue = event.target.value.replace(/\D/g, ""); 
        if (cpfValue.length > 11) { 
            cpfValue = cpfValue.slice(0, 11);
        }
        event.target.value = formatCpf(cpfValue);
    }
});

// Função para abrir o modal de adição de integrante
addButton.onclick = () => {
    addModal.style.display = 'flex';
};

// Função para exibir o modal de erro
function showErrorModal(message) {
    errorMessageElement.textContent = message;
    errorModal.style.display = 'flex';
}

// Função para adicionar integrante no banco de dados
function addIntegranteToDatabase(integrante) {
    fetch('http://localhost:3000/api/integrantes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(integrante),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
        return response.json();
    })
    .then(data => {
        integrantes.push(data); 
        renderIntegrantes(); 
        showMessage('Integrante adicionado com sucesso!');
    })
    .catch(error => {
        if (error.message === 'CPF já cadastrado') {
            showErrorModal('CPF já cadastrado'); 
        } else {
            console.error('Erro ao adicionar integrante:', error);
        }
    });
}

// Função para remover integrante do banco de dados
function removeIntegranteFromDatabase(id) {
    fetch(`http://localhost:3000/api/integrantes/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        integrantes = integrantes.filter(i => i._id !== id); 
        renderIntegrantes(); 
        showMessage('Integrante removido com sucesso!');
    })
    .catch(error => console.error('Erro ao remover integrante:', error));
}

// Submete o formulário para adicionar um novo integrante
addForm.onsubmit = (e) => {
    e.preventDefault();
    const newIntegrante = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        telefone: document.getElementById('telefone').value,
        casado: document.querySelector('input[name="casado"]:checked').value,
        batizado: document.querySelector('input[name="batizado"]:checked').value,
        ministerio: document.getElementById('ministerio').value
    };
    addIntegranteToDatabase(newIntegrante);
    addModal.style.display = 'none'; 
    addForm.reset(); 
};

// Fecha os modais ao clicar fora do conteúdo
window.onclick = (event) => {
    if (event.target === addModal || event.target === detailsModal || event.target === errorModal) {
        addModal.style.display = 'none';
        detailsModal.style.display = 'none';
        errorModal.style.display = 'none';
    }
};

// Função para mostrar mensagem temporária
function showMessage(msg) {
    messageElement.textContent = msg;
    setTimeout(() => {
        messageElement.textContent = '';
    }, 3000);
}

// Função para exibir detalhes do integrante
// Função para exibir detalhes do integrante
function showDetails(integrante) {
    const idade = calcularIdade(integrante.dataNascimento);
    document.getElementById('detailsNome').textContent = `Nome: ${integrante.nome}`;
    document.getElementById('detailsCpf').textContent = `CPF: ${integrante.cpf}`;
    document.getElementById('detailsDataNascimento').textContent = `Data de Nascimento: ${new Date(integrante.dataNascimento).toLocaleDateString()} (${idade} anos)`;
    document.getElementById('detailsTelefone').textContent = `Telefone: ${integrante.telefone}`;
    document.getElementById('detailsCasado').textContent = `Casado: ${integrante.casado === 'sim' ? 'Sim' : 'Não'}`;
    document.getElementById('detailsBatizado').textContent = `Batizado: ${integrante.batizado === 'sim' ? 'Sim' : 'Não'}`;
    document.getElementById('detailsMinisterio').textContent = `Ministério: ${formatarMinisterio(integrante.ministerio)}`;
    
    document.getElementById('editButton').onclick = () => openEditUser(integrante);
    document.getElementById('removeButton').onclick = () => removeIntegranteFromDatabase(integrante._id);
    
    detailsModal.style.display = 'flex';
}


// Função para abrir o modo de edição do integrante
function openEditUser(integrante) {
    // Fecha o modal de detalhes
    detailsModal.style.display = 'none';

    // Define valores no modal de adição para edição
    document.getElementById('nome').value = integrante.nome;
    document.getElementById('cpf').value = integrante.cpf;
    document.getElementById('dataNascimento').value = integrante.dataNascimento;
    document.getElementById('telefone').value = integrante.telefone;
    document.querySelector(`input[name="casado"][value="${integrante.casado}"]`).checked = true;
    document.querySelector(`input[name="batizado"][value="${integrante.batizado}"]`).checked = true;
    document.getElementById('ministerio').value = integrante.ministerio;

    // Ao submeter, atualizar os dados do integrante
    addForm.onsubmit = (e) => {
        e.preventDefault();
        const updatedIntegrante = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            telefone: document.getElementById('telefone').value,
            casado: document.querySelector('input[name="casado"]:checked').value,
            batizado: document.querySelector('input[name="batizado"]:checked').value,
            ministerio: document.getElementById('ministerio').value
        };
        updateIntegranteInDatabase(integrante._id, updatedIntegrante);
        addModal.style.display = 'none';
        addForm.reset();
    };
    
    addModal.style.display = 'flex';
}

// Função para atualizar integrante no banco de dados
function updateIntegranteInDatabase(id, updatedData) {
    fetch(`http://localhost:3000/api/integrantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(() => {
        const index = integrantes.findIndex(i => i._id === id);
        if (index !== -1) {
            integrantes[index] = { ...integrantes[index], ...updatedData };
        }
        renderIntegrantes();
        showMessage('Informações do integrante atualizadas com sucesso!');
    })
    .catch(error => console.error('Erro ao atualizar integrante:', error));
}

// Função para formatar o CPF
function formatCpf(value) {
    value = value.replace(/\D/g, ""); 
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
}

// Função para aplicar máscara de telefone ao campo de entrada
function aplicarMascaraTelefone(event) {
    const input = event.target;
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Aplica o formato (##) # ####-####
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    valor = valor.replace(/(\d{1})(\d{4})(\d{4})$/, '$1 $2-$3');

    input.value = valor;
}

// Adiciona o evento de entrada ao campo de telefone
document.getElementById('telefone').addEventListener('input', aplicarMascaraTelefone);

function formatarMinisterio(ministerio) {
    const ministeriosFormatados = {
        "voluntarios": "Voluntários",
        "louvor": "Louvor",
        "danca": "Dança",
        "tecnico": "Técnico",
        "midia": "Mídia",
        "nao": "Não"
    };
    return ministeriosFormatados[ministerio] || ministerio;
}

// Função para calcular a idade com base na data de nascimento
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

// Aplica a formatação ao campo CPF
document.getElementById('cpf').addEventListener('input', (event) => {
    event.target.value = formatCpf(event.target.value);
});

// Botão Confirmar para fechar o modal de erro
confirmButton.onclick = () => {
    errorModal.style.display = 'none';
};
