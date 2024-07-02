let receitas = [];
let despesas = [];
let budgetChart = null;
let itemParaExcluir = null;

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

function removerReceita(index) {
    itemParaExcluir = { tipo: 'receita', index };
    exibirModalConfirmacao();
}

function removerDespesa(index) {
    itemParaExcluir = { tipo: 'despesa', index };
    exibirModalConfirmacao();
}

function exibirModalConfirmacao() {
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

document.getElementById('btnConfirmExcluir').addEventListener('click', function() {
    if (itemParaExcluir.tipo === 'receita') {
        receitas.splice(itemParaExcluir.index, 1);
        atualizarTabela('receitasTable', receitas);
    } else if (itemParaExcluir.tipo === 'despesa') {
        despesas.splice(itemParaExcluir.index, 1);
        atualizarTabela('despesasTable', despesas);
    }
    atualizarResumo();
    atualizarGrafico();
    itemParaExcluir = null;
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    modal.hide();
});

function atualizarTabela(tabelaId, dados) {
    const tabela = document.getElementById(tabelaId);
    tabela.innerHTML = '';
    dados.forEach((item, index) => {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = item.descricao;
        row.insertCell(1).textContent = `R$ ${item.valor.toFixed(2)}`;
        const cellAcao = row.insertCell(2);
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.classList.add('btn', 'btn-sm', 'btn-danger', 'mx-1');
        btnRemover.onclick = () => {
            if (tabelaId === 'receitasTable') {
                removerReceita(index);
            } else if (tabelaId === 'despesasTable') {
                removerDespesa(index);
            }
        };
        cellAcao.appendChild(btnRemover);
    });
}

function atualizarResumo() {
    const totalReceitas = receitas.reduce((acc, curr) => acc + curr.valor, 0);
    const totalDespesas = despesas.reduce((acc, curr) => acc + curr.valor, 0);
    const saldo = totalReceitas - totalDespesas;
    document.getElementById('totalReceitas').textContent = totalReceitas.toFixed(2);
    document.getElementById('totalDespesas').textContent = totalDespesas.toFixed(2);
    document.getElementById('saldo').textContent = saldo.toFixed(2);
}

function atualizarGrafico() {
    if (budgetChart) {
        budgetChart.destroy();
    }

    const ctx = document.getElementById('budgetChart').getContext('2d');
    budgetChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
                label: 'Orçamento',
                data: [
                    receitas.reduce((acc, curr) => acc + curr.valor, 0),
                    despesas.reduce((acc, curr) => acc + curr.valor, 0)
                ],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ' ' + context.label + ': R$ ' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
}
