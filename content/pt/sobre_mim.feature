# language: pt
# Autora: Natalia Pandolfi

@perfil @smoke
Funcionalidade: Conhecer a Natalia Pandolfi
  Como recrutadora, time de produto ou dev curioso
  Quero saber quem é a QA por trás destes cenários
  Para entender como ela pode contribuir com o meu time

  Contexto:
    Dado que a visitante abriu este arquivo

  Cenário: Apresentação
    Dado que meu nome é "Natalia Pandolfi"
    E que sou "QA Engineer"
    Quando alguém pergunta o que faço
    Então conto que trabalho com automação de testes web, mobile e de APIs e com testes de performance
    E que gosto de entrar no projeto cedo, ainda na discovery

  Cenário: Como gosto de trabalhar
    Dado um time começando uma funcionalidade nova
    Então converso com o Product Owner antes de o código existir
    E ajudo a escrever os requisitos, os critérios de aceite e os cenários de teste
    E explico os riscos de um jeito que quem não é técnico também entenda

  Cenário: Sobre este site
    Dado que montei este site como uma IDE antiga, com a apresentação em Gherkin
    Então o código e os testes dele estão no GitHub, no link da janela de projeto
    E o meu currículo em PDF também está lá, para baixar
