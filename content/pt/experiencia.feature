# language: pt

@experiencia
Funcionalidade: Experiência profissional
  Menos sobre onde, mais sobre o que foi feito,
  sempre com a mesma missão: menos bugs chegando ao usuário

  Cenário: Automação de testes web, mobile e de APIs
    Dado sistemas de grande escala e alto tráfego
    Quando uma funcionalidade nova começa a ser desenvolvida
    Então a automação de testes de web, mobile e APIs começa junto com ela
    E as suítes automatizadas rodam no CI/CD como quality gate de cada entrega

  Cenário: Testes de performance e de carga
    Dado um sistema que precisa aguentar o tráfego real
    Quando chega a hora de saber até onde ele vai
    Então testes de performance e de carga mostram o limite antes do usuário

  Cenário: Estratégia de testes
    Dado aplicações web, mobile e orientadas a APIs
    Quando o time precisa decidir o que testar, como e até onde
    Então a estratégia de testes é definida e executada desde o começo

  @ia
  Cenário: IA aplicada a testes de infraestrutura
    Dado uma base de conhecimento construída para ler projetos de infraestrutura como código (IaC)
    Quando um projeto declara recursos como buckets S3, políticas de acesso e regras de autorização
    Então testes automatizados são gerados a partir dessa leitura
    E validam que cada recurso foi criado e se comporta como o projeto descreve

  @ia
  Cenário: IA aplicada ao início de projetos
    Dado uma base de conhecimento construída para ler APIs
    Quando um projeto novo precisa sair do zero
    Então ela ajuda a montar o esqueleto do repositório de testes automatizados
    E o time começa de uma estrutura pronta em vez de uma pasta vazia

  Cenário: Cultura de qualidade
    Dado times com níveis diferentes de maturidade em testes
    Então BDD e boas práticas de QA se espalham entre os times, um cenário de cada vez
    E o trabalho com devs é lado a lado, do "achei um bug" até o "corrigido e testado"
