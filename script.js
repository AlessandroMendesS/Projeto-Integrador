function calcularDelta(a, b, c) {
  return b * b - 4 * a * c;
}

function calcularRaizes(a, b, delta) {
  if (delta < 0) return "Sem raízes reais";
  let x1 = (-b + Math.sqrt(delta)) / (2 * a);
  let x2 = (-b - Math.sqrt(delta)) / (2 * a);
  return { x1, x2 };
}

function calcularVertice(a, b, c) {
  let xv = -b / (2 * a);
  let yv = a * xv * xv + b * xv + c;
  return { xv, yv };
}

function gerarPontos(a, b, c) {
  let xValues = [];
  let yValues = [];
  for (let x = -100; x <= 100; x += 0.5) {
    xValues.push(x);
    let y = a * x * x + b * x + c;
    yValues.push(y);
  }
  return { xValues, yValues };
}

let chart = null;

function formatarNumero(num) {
  return parseFloat(num.toFixed(2));
}

function formatarFuncao(a, b, c) {
  let formula = '';

  // Termo a
  if (a === 1) formula += 'x²';
  else if (a === -1) formula += '-x²';
  else formula += a + 'x²';

  // Termo b
  if (b > 0) formula += ' + ' + (b === 1 ? 'x' : b + 'x');
  else if (b < 0) formula += ' - ' + (Math.abs(b) === 1 ? 'x' : Math.abs(b) + 'x');

  // Termo c
  if (c > 0) formula += ' + ' + c;
  else if (c < 0) formula += ' - ' + Math.abs(c);

  return formula;
}

function criarGrafico(xValues, yValues, a, b, c, delta, raizes, vertice) {
  const ctx = document.getElementById("grafico").getContext("2d");

  if (chart !== null) {
    chart.destroy();
  }

  let yMin = Math.min(...yValues);
  let yMax = Math.max(...yValues);

  let yRange = yMax - yMin;
  yMin = yMin - yRange * 0.1;
  yMax = yMax + yRange * 0.1;

  const parabola = {
    label: "Parábola",
    data: yValues,
    borderColor: "rgba(9, 132, 227, 0.8)",
    backgroundColor: "rgba(9, 132, 227, 0.1)",
    fill: false,
    tension: 0.4,
    pointRadius: 0,
    borderWidth: 3
  };

  const options = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: -20,
        max: 20,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(150, 150, 150, 0.1)',
          zeroLineColor: 'rgba(150, 150, 150, 0.5)',
          drawTicks: true
        }
      },
      y: {
        title: {
          display: true,
          text: 'Y',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: Math.max(yMin, -50),
        max: Math.min(yMax, 50),
        ticks: {
          stepSize: 5,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(150, 150, 150, 0.1)',
          zeroLineColor: 'rgba(150, 150, 150, 0.5)',
          drawTicks: true
        }
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(9, 132, 227, 0.9)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const x = context.label;
            const y = context.raw;
            return `(${x}, ${y.toFixed(2)})`;
          }
        }
      },
      legend: {
        labels: {
          font: {
            size: 13,
            weight: 'bold'
          },
          padding: 20
        }
      }
    }
  };

  const datasets = [parabola];

  if (delta >= 0) {
    let x1, x2;

    if (typeof raizes === 'string') {
      // Não há raízes reais
    } else {
      x1 = raizes.x1;
      x2 = raizes.x2;

      const isRaizDupla = Math.abs(x1 - x2) < 0.001;

      if (isRaizDupla) {
        const raizIndex = xValues.findIndex(x => Math.abs(x - x1) < 0.5);
        if (raizIndex >= 0) {
          const raizesDataset = {
            label: `Raiz dupla: x = ${x1.toFixed(2)}`,
            data: Array(yValues.length).fill(null),
            pointBackgroundColor: '#00b894',
            pointBorderColor: '#00b894',
            pointRadius: 6,
            pointHoverRadius: 10,
            pointStyle: 'star'
          };
          raizesDataset.data[raizIndex] = 0;
          datasets.push(raizesDataset);
        }
      } else {
        const raiz1Index = xValues.findIndex(x => Math.abs(x - x1) < 0.5);
        const raiz2Index = xValues.findIndex(x => Math.abs(x - x2) < 0.5);

        if (raiz1Index >= 0) {
          const raiz1Dataset = {
            label: `x₁ = ${x1.toFixed(2)}`,
            data: Array(yValues.length).fill(null),
            pointBackgroundColor: '#00b894',
            pointBorderColor: '#00b894',
            pointRadius: 6,
            pointHoverRadius: 10,
            pointStyle: 'circle'
          };
          raiz1Dataset.data[raiz1Index] = 0;
          datasets.push(raiz1Dataset);
        }

        if (raiz2Index >= 0) {
          const raiz2Dataset = {
            label: `x₂ = ${x2.toFixed(2)}`,
            data: Array(yValues.length).fill(null),
            pointBackgroundColor: '#00b894',
            pointBorderColor: '#00b894',
            pointRadius: 6,
            pointHoverRadius: 10,
            pointStyle: 'circle'
          };
          raiz2Dataset.data[raiz2Index] = 0;
          datasets.push(raiz2Dataset);
        }
      }
    }
  }

  const verticeIndex = xValues.findIndex(x => Math.abs(x - vertice.xv) < 0.5);
  if (verticeIndex >= 0) {
    const verticeDataset = {
      label: `Vértice: (${vertice.xv.toFixed(2)}, ${vertice.yv.toFixed(2)})`,
      data: Array(yValues.length).fill(null),
      pointBackgroundColor: '#fdcb6e',
      pointBorderColor: '#fdcb6e',
      pointRadius: 6,
      pointHoverRadius: 10,
      pointStyle: 'triangle'
    };
    verticeDataset.data[verticeIndex] = yValues[verticeIndex];
    datasets.push(verticeDataset);
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xValues,
      datasets: datasets
    },
    options: options
  });
}

function calcularFuncao() {
  let a = parseFloat(document.getElementById("coefA").value);
  let b = parseFloat(document.getElementById("coefB").value);
  let c = parseFloat(document.getElementById("coefC").value);

  if (a === 0 || isNaN(a) || isNaN(b) || isNaN(c)) {
    alert("Insira valores válidos e o coeficiente 'a' deve ser diferente de 0.");
    return;
  }

  // Adicionar animação de loading
  document.querySelectorAll('.card-resultado').forEach(card => {
    card.style.opacity = '0.5';
  });

  setTimeout(() => {
    let delta = calcularDelta(a, b, c);
    let raizes = calcularRaizes(a, b, delta);
    let vertice = calcularVertice(a, b, c);
    let pontos = gerarPontos(a, b, c);

    document.getElementById("delta").innerText = `Δ = ${delta.toFixed(2)}`;

    if (typeof raizes === 'string') {
      document.getElementById("raizes").innerText = raizes;
    } else {
      const x1 = formatarNumero(raizes.x1);
      const x2 = formatarNumero(raizes.x2);

      if (Math.abs(x1 - x2) < 0.001) {
        document.getElementById("raizes").innerHTML = `x = ${x1.toFixed(2)} <span class="badge">Raiz dupla</span>`;
      } else {
        document.getElementById("raizes").innerHTML = `x₁ = ${x1.toFixed(2)}<br>x₂ = ${x2.toFixed(2)}`;
      }
    }

    document.getElementById("vertice").innerText =
      `(${formatarNumero(vertice.xv).toFixed(2)}, ${formatarNumero(vertice.yv).toFixed(2)})`;

    document.getElementById("funcao-display").innerHTML =
      `f(x) = ${formatarFuncao(a, b, c)}`;

    criarGrafico(pontos.xValues, pontos.yValues, a, b, c, delta, raizes, vertice);

    // Restaurar opacidade dos cards
    document.querySelectorAll('.card-resultado').forEach(card => {
      card.style.opacity = '1';
    });
  }, 300);
}

// Adicionar função para salvar favoritos
function salvarFavorito() {
  const a = document.getElementById("coefA").value;
  const b = document.getElementById("coefB").value;
  const c = document.getElementById("coefC").value;

  const favorito = {
    a: parseFloat(a),
    b: parseFloat(b),
    c: parseFloat(c),
    formula: formatarFuncao(parseFloat(a), parseFloat(b), parseFloat(c))
  };

  let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  favoritos.push(favorito);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));

  atualizarListaFavoritos();
  mostrarNotificacao('Função salva como favorita!');
}

function carregarFavorito(a, b, c) {
  document.getElementById("coefA").value = a;
  document.getElementById("coefB").value = b;
  document.getElementById("coefC").value = c;
  calcularFuncao();
}

function removerFavorito(index) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  favoritos.splice(index, 1);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  atualizarListaFavoritos();
  mostrarNotificacao('Função removida dos favoritos!');
}

function atualizarListaFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  const listaFavoritos = document.getElementById('lista-favoritos');

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = '<p class="sem-favoritos">Nenhuma função favorita salva</p>';
    return;
  }

  listaFavoritos.innerHTML = favoritos.map((fav, index) => `
    <div class="favorito-item">
      <span class="favorito-formula">f(x) = ${fav.formula}</span>
      <div class="favorito-botoes">
        <button onclick="carregarFavorito(${fav.a}, ${fav.b}, ${fav.c})" class="btn-carregar">
          <i class="fas fa-play"></i>
        </button>
        <button onclick="removerFavorito(${index})" class="btn-remover">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement('div');
  notificacao.className = 'notificacao';
  notificacao.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${mensagem}</span>
  `;
  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.classList.add('mostrar');
    setTimeout(() => {
      notificacao.classList.remove('mostrar');
      setTimeout(() => {
        notificacao.remove();
      }, 300);
    }, 2000);
  }, 100);
}

// Inicializar a página com valores padrão
window.onload = function () {
  calcularFuncao();
  atualizarListaFavoritos();
};