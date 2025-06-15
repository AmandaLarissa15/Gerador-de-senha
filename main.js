// Elementos
const inputPalavra = document.getElementById('input-palavra');
const inputTamanho = document.getElementById('input-tamanho');
const btnGerar = document.getElementById('btn-gerar');
const senhaGerada = document.getElementById('senha-gerada');
const btnCopiar = document.getElementById('btn-copiar');
const medidor = document.getElementById('forca-senha').firstElementChild;
const feedback = document.getElementById('feedback');
const pathCadeado = document.getElementById('cadeado-path1');

// Geração de senha
function gerarSenha(palavra, tamanho) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=[]{}<>?';
  let base = palavra || '';
  let senha = base;

  while (senha.length < tamanho) {
    const rand = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    senha += rand;
  }

  return senha.split('').sort(() => 0.5 - Math.random()).join('').slice(0, tamanho);
}

// Avaliação da força
function avaliarForca(senha) {
  let forca = 0;
  if (senha.length >= 8) forca++;
  if (/[A-Z]/.test(senha)) forca++;
  if (/[a-z]/.test(senha)) forca++;
  if (/\d/.test(senha)) forca++;
  if (/[\W_]/.test(senha)) forca++;

  if (forca <= 2) return 'fraca';
  if (forca <= 4) return 'media';
  return 'forte';
}

// Atualiza barra + cadeado
function atualizarMedidor(senha) {
  const forca = avaliarForca(senha);
  let largura = 0;
  let classe = '';
  let mensagem = '';

  switch (forca) {
    case 'fraca':
      largura = 33;
      classe = 'forca-fraca';
      mensagem = 'Senha fraca: use letras maiúsculas, números e símbolos.';
      pathCadeado.setAttribute('d', 'M7 10V7a5 5 0 0110 0v3'); // Cadeado fechado
      break;
    case 'media':
      largura = 66;
      classe = 'forca-media';
      mensagem = 'Senha média: melhore incluindo mais caracteres especiais.';
      pathCadeado.setAttribute('d', 'M7 10V7a5 5 0 0110 0v3'); // Cadeado fechado
      break;
    case 'forte':
      largura = 100;
      classe = 'forca-forte';
      mensagem = 'Senha forte! Excelente!';
      pathCadeado.setAttribute('d', 'M7 10V7a5 5 0 0110 0h-2a3 3 0 00-6 0v3'); // Cadeado aberto
      break;
  }

  medidor.style.width = largura + '%';
  medidor.className = classe;
  feedback.textContent = mensagem;
}

// Evento gerar
btnGerar.addEventListener('click', () => {
  const palavra = inputPalavra.value.trim();
  const tamanho = parseInt(inputTamanho.value, 10);

  if (!tamanho || tamanho < 6) {
    feedback.textContent = 'Tamanho mínimo: 6 caracteres.';
    senhaGerada.textContent = '';
    medidor.style.width = '0%';
    medidor.className = '';
    pathCadeado.setAttribute('d', 'M7 10V7a5 5 0 0110 0v3'); // Reset para trancado
    return;
  }

  const senha = gerarSenha(palavra, tamanho);
  senhaGerada.textContent = senha;
  atualizarMedidor(senha);
});

// Evento copiar
btnCopiar.addEventListener('click', () => {
  const senha = senhaGerada.textContent;
  if (!senha) {
    feedback.textContent = 'Nenhuma senha para copiar.';
    return;
  }
  navigator.clipboard.writeText(senha).then(() => {
    feedback.textContent = 'Senha copiada!';
  }).catch(() => {
    feedback.textContent = 'Erro ao copiar.';
  });
});
