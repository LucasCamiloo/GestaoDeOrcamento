let receitas = [];
let despesas = [];
let budgetChart = null;

function adicionarReceita() {
    const descricao = document.getElementById('receitaDescricao').value;
    const valor = parseFloat(document.getElementById('receitaValor').value);
    if (descricao && valor) {
        receitas.push({ descricao, valor });
        atualizarTabela('receitasTable', receitas);
        atualizarResumo();
        atualizarGrafico();
        document.getElementById('receitaDescricao').value = '';
        document.getElementById('receitaValor').value = '';
    }
}

function adicionarDespesa() {
    const descricao = document.getElementById('despesaDescricao').value;
    const valor = parseFloat(document.getElementById('despesaValor').value);
    if (descricao && valor) {
        despesas.push({ descricao, valor });
        atualizarTabela('despesasTable', despesas);
        atualizarResumo();
        atualizarGrafico();
        document.getElementById('despesaDescricao').value = '';
        document.getElementById('despesaValor').value = '';
    }
}

function atualizarTabela(tabelaId, dados) {
    const tabela = document.getElementById(tabelaId);
    tabela.innerHTML = '';
    dados.forEach(item => {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = item.descricao;
        row.insertCell(1).textContent = `R$ ${item.valor.toFixed(2)}`;
    });
}

function atualizarResumo() {
    const totalReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);
    const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
    const saldo = totalReceitas - totalDespesas;

    document.getElementById('totalReceitas').textContent = totalReceitas.toFixed(2);
    document.getElementById('totalDespesas').textContent = totalDespesas.toFixed(2);
    document.getElementById('saldo').textContent = saldo.toFixed(2);
}

function atualizarGrafico() {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    const totalReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);
    const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);

    if (budgetChart) {
        budgetChart.destroy();
    }

    budgetChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
                data: [totalReceitas, totalDespesas],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('dark');
}
