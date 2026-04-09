let pontosA = 0;
let pontosB = 0;
let setsA = 0;
let setsB = 0;

function atualizarTela() {
  document.getElementById("pontosA").innerText = pontosA;
  document.getElementById("pontosB").innerText = pontosB;
  document.getElementById("setsA").innerText = setsA;
  document.getElementById("setsB").innerText = setsB;
}

function registrarHistorico(texto) {
  const lista = document.getElementById("historico");
  const item = document.createElement("li");

  const agora = new Date();
  const dataHora = agora.toLocaleString();

  item.innerText = `${dataHora} - ${texto}`;
  lista.prepend(item); // adiciona no topo
}

function verificarSet() {
  if (pontosA >= 10) {
    setsA++;
    registrarHistorico("Time A venceu um set");
    pontosA = 0;
    pontosB = 0;
  }

  if (pontosB >= 10) {
    setsB++;
    registrarHistorico("Time B venceu um set");
    pontosA = 0;
    pontosB = 0;
  }
}

function addPonto(time) {
  if (time === 'A') {
    pontosA++;
    registrarHistorico("Ponto para Time A");
  } else {
    pontosB++;
    registrarHistorico("Ponto para Time B");
  }

  verificarSet();
  atualizarTela();
}

function removerPonto(time) {
  if (time === 'A' && pontosA > 0) {
    pontosA--;
    registrarHistorico("Removeu ponto do Time A");
  } else if (time === 'B' && pontosB > 0) {
    pontosB--;
    registrarHistorico("Removeu ponto do Time B");
  }

  atualizarTela();
}

function resetarTudo() {
  pontosA = 0;
  pontosB = 0;
  setsA = 0;
  setsB = 0;

  registrarHistorico("Placar resetado");

  atualizarTela();
}