# language: pt

@e2e @a11y
Funcionalidade: Acessibilidade
  Como pessoa que navega com teclado ou leitor de tela
  Quero usar o site sem barreiras
  Para conhecer a Natalia como qualquer outra visitante

  Esquema do Cenário: Página em <idioma> sem violações graves
    Dado que abri o site em "<idioma>"
    Então a página não tem violações de acessibilidade graves

    Exemplos:
      | idioma    |
      | português |
      | inglês    |

  Cenário: Abrir e fechar a ajuda pelo teclado
    Dado que abri o site em "português"
    Quando eu pressiono "F1"
    Então o diálogo de ajuda está visível
    Quando eu pressiono "Escape"
    Então o diálogo de ajuda não está visível
