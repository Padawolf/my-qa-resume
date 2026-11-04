# language: pt

@experiencia
Funcionalidade: Experiência profissional

  Cenário: Automação de testes web, mobile e de APIs
    Dado sistemas grandes, com muito tráfego
    Quando uma funcionalidade nova começa a ser desenvolvida
    Então escrevo os testes automatizados de web, mobile e APIs junto com ela
    E coloco essas suítes para rodar no pipeline de CI/CD

  Cenário: Testes de performance e de carga
    Dado um sistema que vai receber muitos acessos
    Então planejo e rodo os testes de performance e de carga para saber até onde ele aguenta

  Cenário: Estratégia de testes
    Dado aplicações web, mobile e de APIs
    Quando o time precisa decidir o que testar e como
    Então defino a estratégia de testes e acompanho a execução com o time

  @ia
  Cenário: Testes de infraestrutura gerados com IA
    Dado que criei uma base de conhecimento que lê projetos de infraestrutura como código
    Quando o projeto declara recursos como buckets S3, políticas de acesso e regras de autorização
    Então ela gera testes automatizados que conferem se cada recurso foi criado e funciona como o projeto descreve

  @ia
  Cenário: Repositórios de automação a partir de APIs
    Dado que criei outra base de conhecimento, que lê APIs
    Quando uma automação de testes precisa começar do zero
    Então ela ajuda a montar o esqueleto do repositório de testes

  Cenário: BDD e boas práticas
    Dado times com jeitos diferentes de testar
    Então ajudei a adotar BDD e boas práticas de QA
    E trabalhei perto dos devs, do bug encontrado até a correção testada
