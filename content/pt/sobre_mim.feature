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
    Quando alguém pergunta o que uma QA faz por aqui
    Então a resposta curta é "ajudar o time a encontrar o bug antes do usuário"
    E a resposta longa está nos outros arquivos desta pasta

  Cenário: Qualidade desde a discovery
    Dado que uma ideia nova ainda está no papel
    Quando o time começa a discovery
    Então a QA já participa da conversa com o Product Owner
    E requisitos, critérios de aceite e cenários de teste nascem juntos
    Mas o teste não espera o código ficar pronto para começar

  Cenário: Como é trabalhar junto
    Dado que qualidade é responsabilidade do time inteiro
    Então riscos técnicos são explicados para quem não é técnico
    E a pergunta incômoda aparece no refinamento, antes de virar incidente em produção
    E o conhecimento é compartilhado, porque QA não é gargalo nem porteiro do deploy

  Cenário: Este site também é testado
    Dado que um currículo aceita qualquer coisa que se escreva nele
    Quando você abre a pasta "e2e/" aqui ao lado
    Então encontra os testes deste site em "Playwright" e "TypeScript", escritos em BDD
    E eles verificam acessibilidade com "axe", os dois idiomas e a performance
    E rodam no GitHub Actions a cada push, com o resultado na janela "Saída"
