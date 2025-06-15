// Elementos do DOM
const inputPalavra = document.getElementById('input-palavra');
const inputTamanho = document.getElementById('input-tamanho');
const btnGerar = document.getElementById('btn-gerar');
const senhaGerada = document.getElementById('senha-gerada');
const btnCopiar = document.getElementById('btn-copiar');
const medidor = document.getElementById('forca-senha').firstElementChild;
const feedback = document.getElementById('feedback');

// Função para gerar senha forte baseada em palavra-chave e tamanho
function gerarSenha(palavra, tamanho) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
  let base = palavra || '';
  let senha = '';

  // Começa com a palavra-chave (ou vazio) e adiciona caracteres aleatórios até o tamanho
  senha += base;

  while (senha.length < tamanho) {
    const charAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    senha += charAleatorio;
  }

  // Embaralhar a senha para não ficar previsível
  senha = senha.split('').sort(() => 0.5 - Math.random()).join('');

  return senha.slice(0, tamanho);
}

// Função para avaliar força da senha
function avaliarForca(senha) {
  let forca = 0;

  if (senha.length >= 8) forca++;
  if (/[A-Z]/.test(senha)) forca++;
  if (/[a-z]/.test(senha)) forca++;
  if (/\d/.test(senha)) forca++;
  if (/[\W_]/.test(senha)) forca++;

  // Classifica força: 0-2 fraca, 3-4 média, 5 forte
  if (forca <= 2) return 'fraca';
  if (forca <= 4) return 'media';
  return 'forte';
}

// Atualiza medidor visual e mensagem
function atualizarMedidor(senha) {
  const forca = avaliarForca(senha);
  let width = 0;
  let classe = '';
  let mensagem = '';

  switch (forca) {
    case 'fraca':
      width = 33;
      classe = 'forca-fraca';
      mensagem = 'Senha fraca: adicione letras maiúsculas, números e símbolos.';
      break;
    case 'media':
      width = 66;
      classe = 'forca-media';
      mensagem = 'Senha média: pode melhorar incluindo mais caracteres especiais.';
      break;
    case 'forte':
      width = 100;
      classe = 'forca-forte';
      mensagem = 'Senha forte! Excelente escolha.';
      break;
  }

  medidor.style.width = width + '%';
  medidor.className = classe;
  feedback.textContent = mensagem;
}

// Evento botão gerar senha
btnGerar.addEventListener('click', () => {
  const palavra = inputPalavra.value.trim();
  let tamanho = parseInt(inputTamanho.value, 10);

  if (!tamanho || tamanho < 6) {
    feedback.textContent = 'Escolha um tamanho de senha mínimo de 6 caracteres.';
    senhaGerada.textContent = '';
    medidor.style.width = '0%';
    medidor.className = '';
    return;
  }

  const senha = gerarSenha(palavra, tamanho);
  senhaGerada.textContent = senha;
  atualizarMedidor(senha);
  feedback.textContent = '';
});

// Evento botão copiar senha
btnCopiar.addEventListener('click', () => {
  const senha = senhaGerada.textContent;
  if (!senha) {
    feedback.textContent = 'Não há senha para copiar.';
    return;
  }
  navigator.clipboard.writeText(senha).then(() => {
    feedback.textContent = 'Senha copiada para a área de transferência!';
  }).catch(() => {
    feedback.textContent = 'Falha ao copiar a senha.';
  });
});
