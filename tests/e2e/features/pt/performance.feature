# language: pt

@e2e @performance
Funcionalidade: Teste de performance com bugs
  Como visitante do site
  Quero soltar bugs numa janela de jogo
  Para ver se a IDE aguenta a carga e corrigir o que der

  Contexto:
    Dado que abri o site em "português"
    E que abri o teste de performance

  Cenário: Soltar uma quantidade normal de bugs
    Quando eu escolho 50 bugs
    E eu solto os bugs
    Então o contador de FPS aparece na tela
    E os bugs caem só dentro da janela do jogo
    E o teste de performance mostra "50 bugs em"
    E o teste de performance mostra "FPS médio"
    E o teste de performance mostra "foram para produção"

  @mobile
  Cenário: No celular a chuva é limitada a 500 bugs
    Dado que estou usando um celular
    Quando eu escolho 1000 bugs
    E eu solto os bugs
    Então o teste de performance mostra "500 bugs em"
    E o teste de performance mostra "Celular: limitado a 500 bugs"

  @a11y
  Cenário: Com movimento reduzido os bugs não caem
    Dado que prefiro movimento reduzido
    Quando eu escolho 20 bugs
    E eu solto os bugs
    Então o teste de performance mostra "Movimento reduzido"

  @a11y
  Cenário: Fechar o jogo pelo teclado
    Então a página não tem violações de acessibilidade graves
    Quando eu pressiono "Escape"
    Então o teste de performance está fechado

  Cenário: Um bilhão de bugs derruba o sistema de propósito
    Quando eu escolho 1000000000 bugs
    E eu solto os bugs
    Então a tela de erro previsto está visível
    Quando eu pressiono "Enter"
    Então a tela de erro previsto não está visível
