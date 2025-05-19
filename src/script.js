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

  // Destruir gráfico anterior se existir
  if (chart !== null) {
    chart.destroy();
  }

  // Encontrar limites adequados para o gráfico
  let yMin = Math.min(...yValues);
  let yMax = Math.max(...yValues);
  
  // Adicionar margem ao eixo y
  let yRange = yMax - yMin;
  yMin = yMin - yRange * 0.1;
  yMax = yMax + yRange * 0.1;

  // Criar o gráfico principal para a parábola
  const parabola = {
    label: "Parábola",
    data: yValues,
    borderColor: "rgba(100, 100, 100, 0.8)",
    backgroundColor: "rgba(100, 100, 100, 0.1)",
    fill: false,
    tension: 0.1,
    pointRadius: 0
  };

  // Configurações do gráfico
  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'X' },
        min: -20,    
        max: 20,     
        ticks: {
          stepSize: 1 
        },
        grid: {
          color: 'rgba(150, 150, 150, 0.1)',
          zeroLineColor: 'rgba(150, 150, 150, 0.5)',
          drawTicks: true
        }
      },
      y: {
        title: { display: true, text: 'Y' },
        min: Math.max(yMin, -50),    
        max: Math.min(yMax, 50),     
        ticks: {
          stepSize: 5 
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
        callbacks: {
          label: function(context) {
            const x = context.label;
            const y = context.raw;
            return `(${x}, ${y.toFixed(2)})`;
          }
        }
      }
    }
  };

  // Dados adicionais para pontos notáveis
  const datasets = [parabola];

  // Adicionar marcadores para as raízes se existirem
  if (delta >= 0) {
    let x1, x2;
    
    if (typeof raizes === 'string') {
      // Não há raízes reais
    } else {
      x1 = raizes.x1;
      x2 = raizes.x2;
      
      // Verificar se é raiz dupla
      const isRaizDupla = Math.abs(x1 - x2) < 0.001;
      
      if (isRaizDupla) {
        // Raiz dupla
        const raizIndex = xValues.findIndex(x => Math.abs(x - x1) < 0.5);
        if (raizIndex >= 0) {
          const raizesDataset = {
            label: `Raiz dupla: x = ${x1.toFixed(2)}`,
            data: Array(yValues.length).fill(null),
            pointBackgroundColor: '#555555',
            pointBorderColor: '#555555',
            pointRadius: 5,
            pointHoverRadius: 8
          };
          raizesDataset.data[raizIndex] = 0;
          datasets.push(raizesDataset);
        }
      } else {
        // Duas raízes distintas
        const raiz1Index = xValues.findIndex(x => Math.abs(x - x1) < 0.5);
        const raiz2Index = xValues.findIndex(x => Math.abs(x - x2) < 0.5);
        
        if (raiz1Index >= 0) {
          const raiz1Dataset = {
            label: `x₁ = ${x1.toFixed(2)}`,
            data: Array(yValues.length).fill(null),
            pointBackgroundColor: '#555555',
            pointBorderColor: '#555555',
            pointRadius: 5,
            pointHoverRadius: 8
          };
          raiz1Dataset.data[raiz1Index] = 0;
          datasets.push(raiz1Dataset);
        }
        
        if (raiz2Index >= 0) {
          const raiz2Dataset = {
            label: `x₂ = ${x2.toFixed(2)}`,
            data: Array(yValues.length).fill(null),
            pointBackgroundColor: '#555555',
            pointBorderColor: '#555555',
            pointRadius: 5,
            pointHoverRadius: 8
          };
          raiz2Dataset.data[raiz2Index] = 0;
          datasets.push(raiz2Dataset);
        }
      }
    }
  }

  // Adicionar marcador para o vértice
  const verticeIndex = xValues.findIndex(x => Math.abs(x - vertice.xv) < 0.5);
  if (verticeIndex >= 0) {
    const verticeDataset = {
      label: `Vértice: (${vertice.xv.toFixed(2)}, ${vertice.yv.toFixed(2)})`,
      data: Array(yValues.length).fill(null),
      pointBackgroundColor: '#777777',
      pointBorderColor: '#777777',
      pointRadius: 5,
      pointHoverRadius: 8
    };
    verticeDataset.data[verticeIndex] = yValues[verticeIndex];
    datasets.push(verticeDataset);
  }

  // Criar o gráfico
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

  let delta = calcularDelta(a, b, c);
  let raizes = calcularRaizes(a, b, delta);
  let vertice = calcularVertice(a, b, c);
  let pontos = gerarPontos(a, b, c);

  // Atualizar os elementos visuais
  document.getElementById("delta").innerText = `Δ = ${delta.toFixed(2)}`;
  
  // Atualizar raízes
  if (typeof raizes === 'string') {
    document.getElementById("raizes").innerText = raizes;
  } else {
    const x1 = formatarNumero(raizes.x1);
    const x2 = formatarNumero(raizes.x2);
    
    // Verificar se é raiz dupla
    if (Math.abs(x1 - x2) < 0.001) {
      document.getElementById("raizes").innerHTML = `x = ${x1.toFixed(2)} <span class="badge">Raiz dupla</span>`;
    } else {
      document.getElementById("raizes").innerHTML = `x₁ = ${x1.toFixed(2)}<br>x₂ = ${x2.toFixed(2)}`;
    }
  }

  // Atualizar vértice
  document.getElementById("vertice").innerText = 
    `(${formatarNumero(vertice.xv).toFixed(2)}, ${formatarNumero(vertice.yv).toFixed(2)})`;

  // Atualizar a exibição da função
  document.getElementById("funcao-display").innerHTML = 
    `f(x) = ${formatarFuncao(a, b, c)}`;

  // Criar o gráfico
  criarGrafico(pontos.xValues, pontos.yValues, a, b, c, delta, raizes, vertice);
}

// Inicializar a página com valores padrão
window.onload = function() {
  calcularFuncao();
};