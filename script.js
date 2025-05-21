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

function gerarPontos(a, b, c, min = -10, max = 10, step = 0.1) {
  let xValues = [];
  let yValues = [];
  
  for (let x = min; x <= max; x += step) {
    xValues.push(x);
    let y = a * x * x + b * x + c;
    yValues.push(y);
  }
  
  return { xValues, yValues };
}

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

let myPlot = null;

function criarGrafico(a, b, c, delta, raizes, vertice) {
  const graphDiv = document.getElementById("grafico");
  
  // Ajusta o intervalo do gráfico com base nos pontos importantes
  let xMin, xMax, pontos;
  
  if (delta >= 0 && typeof raizes !== 'string') {
    // Se tiver raízes, incluir elas no gráfico
    xMin = Math.min(raizes.x1, raizes.x2, vertice.xv) - 5;
    xMax = Math.max(raizes.x1, raizes.x2, vertice.xv) + 5;
  } else {
    // Se não tiver raízes, focar no vértice
    xMin = vertice.xv - 5;
    xMax = vertice.xv + 5;
  }
  
  // Garante um intervalo mínimo para visualização
  if (xMax - xMin < 10) {
    const centro = (xMin + xMax) / 2;
    xMin = centro - 5;
    xMax = centro + 5;
  }
  
  // Gera os pontos no intervalo calculado
  pontos = gerarPontos(a, b, c, xMin, xMax);
  
  // Calcula limites de Y para melhor visualização
  let yValues = pontos.yValues;
  let yMin = Math.min(...yValues);
  let yMax = Math.max(...yValues);
  let yRange = yMax - yMin;
  
  // Adiciona margem aos limites de Y
  yMin = yMin - yRange * 0.1;
  yMax = yMax + yRange * 0.1;
  
  // Limita Y para não ficar muito grande
  if (yMin < -50) yMin = -50;
  if (yMax > 50) yMax = 50;
  
  // Cria a linha da parábola
  const parabola = {
    x: pontos.xValues,
    y: pontos.yValues,
    type: 'scatter',
    mode: 'lines',
    name: 'f(x) = ' + formatarFuncao(a, b, c),
    line: {
      color: 'rgba(9, 132, 227, 1)',
      width: 3
    },
    hoverinfo: 'text',
    hovertext: pontos.xValues.map((x, i) => 
      `x: ${x.toFixed(2)}<br>y: ${pontos.yValues[i].toFixed(2)}`
    )
  };
  
  const traces = [parabola];
  
  // Adiciona marcadores para as raízes
  if (delta >= 0 && typeof raizes !== 'string') {
    const isRaizDupla = Math.abs(raizes.x1 - raizes.x2) < 0.001;
    
    if (isRaizDupla) {
      traces.push({
        x: [raizes.x1],
        y: [0],
        mode: 'markers',
        name: `Raiz dupla: x = ${formatarNumero(raizes.x1).toFixed(2)}`,
        marker: {
          color: '#00b894',
          size: 10,
          symbol: 'star',
          line: {
            color: '#00b894',
            width: 2
          }
        },
        hoverinfo: 'text',
        hovertext: `Raiz dupla: x = ${formatarNumero(raizes.x1).toFixed(2)}`
      });
    } else {
      // Raiz x1
      traces.push({
        x: [raizes.x1],
        y: [0],
        mode: 'markers',
        name: `x₁ = ${formatarNumero(raizes.x1).toFixed(2)}`,
        marker: {
          color: '#00b894',
          size: 10,
          symbol: 'circle',
          line: {
            color: '#00b894',
            width: 2
          }
        },
        hoverinfo: 'text',
        hovertext: `x₁ = ${formatarNumero(raizes.x1).toFixed(2)}`
      });
      
      // Raiz x2
      traces.push({
        x: [raizes.x2],
        y: [0],
        mode: 'markers',
        name: `x₂ = ${formatarNumero(raizes.x2).toFixed(2)}`,
        marker: {
          color: '#00b894',
          size: 10,
          symbol: 'circle',
          line: {
            color: '#00b894',
            width: 2
          }
        },
        hoverinfo: 'text',
        hovertext: `x₂ = ${formatarNumero(raizes.x2).toFixed(2)}`
      });
    }
  }
  
  // Adiciona marcador para o vértice
  traces.push({
    x: [vertice.xv],
    y: [vertice.yv],
    mode: 'markers',
    name: `Vértice (${formatarNumero(vertice.xv).toFixed(2)}, ${formatarNumero(vertice.yv).toFixed(2)})`,
    marker: {
      color: '#fdcb6e',
      size: 10,
      symbol: 'triangle-up',
      line: {
        color: '#fdcb6e',
        width: 2
      }
    },
    hoverinfo: 'text',
    hovertext: `Vértice (${formatarNumero(vertice.xv).toFixed(2)}, ${formatarNumero(vertice.yv).toFixed(2)})`
  });
  
  // Adiciona linha do eixo X
  traces.push({
    x: [xMin, xMax],
    y: [0, 0],
    mode: 'lines',
    name: 'Eixo X',
    line: {
      color: 'rgba(150, 150, 150, 0.5)',
      width: 1,
      dash: 'dash'
    },
    showlegend: false,
    hoverinfo: 'none'
  });
  
  // Adiciona linha do eixo Y
  traces.push({
    x: [0, 0],
    y: [yMin, yMax],
    mode: 'lines',
    name: 'Eixo Y',
    line: {
      color: 'rgba(150, 150, 150, 0.5)',
      width: 1,
      dash: 'dash'
    },
    showlegend: false,
    hoverinfo: 'none'
  });
  
  // Configuração do layout
  const layout = {
    title: {
      text: 'Gráfico da Função Quadrática',
      font: {
        family: 'Inter, sans-serif',
        size: 18
      }
    },
    hoverlabel: {
      bgcolor: '#FFF',
      font: {
        family: 'Inter, sans-serif',
        size: 12,
        color: '#333'
      },
      bordercolor: '#0984e3'
    },
    xaxis: {
      title: {
        text: 'x',
        font: {
          family: 'Inter, sans-serif',
          size: 14,
          color: 'var(--text-primary)'
        }
      },
      range: [xMin, xMax],
      showgrid: true,
      zeroline: true,
      gridcolor: 'rgba(150, 150, 150, 0.1)',
      zerolinecolor: 'rgba(150, 150, 150, 0.5)',
      zerolinewidth: 1.5
    },
    yaxis: {
      title: {
        text: 'y',
        font: {
          family: 'Inter, sans-serif',
          size: 14,
          color: 'var(--text-primary)'
        }
      },
      range: [yMin, yMax],
      showgrid: true,
      zeroline: true,
      gridcolor: 'rgba(150, 150, 150, 0.1)',
      zerolinecolor: 'rgba(150, 150, 150, 0.5)',
      zerolinewidth: 1.5
    },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: -0.15,
      xanchor: 'center',
      x: 0.5,
      font: {
        family: 'Inter, sans-serif',
        size: 12
      }
    },
    margin: {
      l: 50,
      r: 50,
      t: 50,
      b: 50
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: true,
    hovermode: 'closest',
    annotations: []
  };
  
  // Adiciona annotations para as raízes e vértice
  if (delta >= 0 && typeof raizes !== 'string') {
    const isRaizDupla = Math.abs(raizes.x1 - raizes.x2) < 0.001;
    
    if (isRaizDupla) {
      layout.annotations.push({
        x: raizes.x1,
        y: 0,
        text: `x = ${formatarNumero(raizes.x1).toFixed(2)}`,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 1.5,
        arrowcolor: '#00b894',
        ax: 0,
        ay: -30,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: '#00b894',
        borderwidth: 1,
        borderpad: 4,
        font: {
          family: 'Inter, sans-serif',
          size: 12,
          color: '#00b894'
        }
      });
    } else {
      layout.annotations.push({
        x: raizes.x1,
        y: 0,
        text: `x₁ = ${formatarNumero(raizes.x1).toFixed(2)}`,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 1.5,
        arrowcolor: '#00b894',
        ax: 0,
        ay: -30,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: '#00b894',
        borderwidth: 1,
        borderpad: 4,
        font: {
          family: 'Inter, sans-serif',
          size: 12,
          color: '#00b894'
        }
      });
      
      layout.annotations.push({
        x: raizes.x2,
        y: 0,
        text: `x₂ = ${formatarNumero(raizes.x2).toFixed(2)}`,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 1.5,
        arrowcolor: '#00b894',
        ax: 0,
        ay: -30,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: '#00b894',
        borderwidth: 1,
        borderpad: 4,
        font: {
          family: 'Inter, sans-serif',
          size: 12,
          color: '#00b894'
        }
      });
    }
  }
  
  // Vértice annotation
  layout.annotations.push({
    x: vertice.xv,
    y: vertice.yv,
    text: `(${formatarNumero(vertice.xv).toFixed(2)}, ${formatarNumero(vertice.yv).toFixed(2)})`,
    showarrow: true,
    arrowhead: 2,
    arrowsize: 1,
    arrowwidth: 1.5,
    arrowcolor: '#fdcb6e',
    ax: 0,
    ay: -40,
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    bordercolor: '#fdcb6e',
    borderwidth: 1,
    borderpad: 4,
    font: {
      family: 'Inter, sans-serif',
      size: 12,
      color: '#fdcb6e'
    }
  });
  
  // Configurações para interatividade
  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
    displaylogo: false
  };
  
  // Se já existe um gráfico, atualize-o
  if (myPlot) {
    Plotly.react(graphDiv, traces, layout, config);
  } else {
    // Caso contrário, crie um novo
    Plotly.newPlot(graphDiv, traces, layout, config);
    myPlot = graphDiv;
  }
  
  // Ajuste para tema escuro se aplicável
  ajustarTemaCores();
}

// Função para ajustar cores baseado no tema
function ajustarTemaCores() {
  // Verifica se o tema atual é escuro
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (!myPlot) return;
  
  const updateColors = {
    'xaxis.color': isDarkMode ? '#dfe6e9' : '#2d3436',
    'yaxis.color': isDarkMode ? '#dfe6e9' : '#2d3436',
    'xaxis.gridcolor': isDarkMode ? 'rgba(150, 150, 150, 0.2)' : 'rgba(150, 150, 150, 0.1)',
    'yaxis.gridcolor': isDarkMode ? 'rgba(150, 150, 150, 0.2)' : 'rgba(150, 150, 150, 0.1)',
    'font.color': isDarkMode ? '#dfe6e9' : '#2d3436',
    'title.font.color': isDarkMode ? '#f5f6fa' : '#2d3436'
  };
  
  Plotly.relayout(myPlot, updateColors);
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
  
  // Adicionar classe de loading para indicar processamento
  document.getElementById('grafico').classList.add('loading');

  setTimeout(() => {
    let delta = calcularDelta(a, b, c);
    let raizes = calcularRaizes(a, b, delta);
    let vertice = calcularVertice(a, b, c);

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
      `<i class="fas fa-function"></i> f(x) = ${formatarFuncao(a, b, c)}`;

    criarGrafico(a, b, c, delta, raizes, vertice);

    // Restaurar opacidade dos cards
    document.querySelectorAll('.card-resultado').forEach(card => {
      card.style.opacity = '1';
    });
    
    // Remover classe de loading
    document.getElementById('grafico').classList.remove('loading');
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
        <button onclick="carregarFavorito(${fav.a}, ${fav.b}, ${fav.c})" class="btn-carregar" title="Carregar função">
          <i class="fas fa-play"></i>
        </button>
        <button onclick="removerFavorito(${index})" class="btn-remover" title="Remover dos favoritos">
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

// Escutar mudanças no tema do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (myPlot) {
    ajustarTemaCores();
  }
});

// Adicionar evento de resize para o gráfico
window.addEventListener('resize', () => {
  if (myPlot) {
    Plotly.Plots.resize(myPlot);
  }
});

// Inicializar a página com valores padrão
window.onload = function () {
  calcularFuncao();
  atualizarListaFavoritos();
};
