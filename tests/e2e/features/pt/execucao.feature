# language: pt

@e2e @execucao
Funcionalidade: Ver o resultado da última execução do CI
  Como visitante curioso
  Quero apertar "Executar"
  Para ver o relatório real dos testes deste site

  Cenário: Relatório com todos os testes aprovados
    Dado que o CI publicou o relatório "aprovado"
    E que abri o site em "português"
    Quando eu clico no botão de executar
    Então a saída mostra "4 Scenarios (4 passed)"
    E a saída mostra "BUILD SUCCESS"

  Cenário: Relatório com um teste falhando
    Dado que o CI publicou o relatório "com-falha"
    E que abri o site em "português"
    Quando eu pressiono "F9"
    Então a saída mostra "1 failed"
    E a saída mostra "BUILD FAILURE"

  Cenário: Ainda não existe relatório
    Dado que o CI ainda não publicou nenhum relatório
    Quando eu abro o site em "português"
    Então a saída mostra "Nenhum relatório do CI"
