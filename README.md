# Casa do Samir — Fábrica Android

Projeto completo do aplicativo **Casa do Samir**, preparado para ser enviado diretamente para a raiz de um repositório GitHub e compilado pelo GitHub Actions.

## Objetivo

Aplicativo privado para Samir visitar apartamentos usados, registrar o estado real de cada imóvel, comparar preços/localização/custos e gerar relatórios em PDF.

## Interface de visita

A interface foi feita para uso principal pelo celular:
- sem rolagem horizontal;
- seções curtas;
- apenas uma categoria do checklist aberta por vez;
- botões rápidos `OK`, `Atenção`, `Ruim` e `N/A`;
- campo de observação curto em cada item;
- ao terminar uma categoria, a próxima abre automaticamente;
- informações secundárias ficam recolhidas em `Mais detalhes`;
- salvamento automático.

## Checklist implantado

### Estado do imóvel
- infiltração e umidade;
- parede entre banheiro e quartos;
- trincas e rachaduras;
- piso geral;
- azulejos ocos/soltos;
- taco/madeira;
- cupim;
- pintura/acabamento;
- armários embutidos.

### Portas e janelas
- porta de entrada e fechadura;
- portas internas;
- janela da sala;
- janelas dos quartos;
- esquadrias;
- vidros/persianas/venezianas.

### Água e banheiros
- pressão;
- chuveiro;
- torneiras;
- descargas;
- ralos/escoamento;
- vazamentos sob pias;
- registros;
- aquecimento/gás.

### Elétrica
- quadro de luz;
- tomadas;
- interruptores;
- iluminação;
- circuitos de alta potência;
- pontos para ar-condicionado;
- estado/reforma da fiação.

### Conforto
- posição solar;
- ventilação;
- mofo;
- cheiro de esgoto;
- isolamento com janelas fechadas;
- barulho interno do prédio;
- privacidade/vista.

### Bairro e rotina
- barulho durante o dia;
- barulho à noite;
- bairro durante o dia;
- bairro à noite;
- iluminação da rua à noite;
- movimento/comércio à noite;
- segurança no entorno;
- caminho até o metrô.

### Condomínio e garagem
- portaria 24 horas;
- câmeras/acesso/eclusa;
- elevadores;
- fachada/hall/corredores;
- vaga;
- manobra;
- portões;
- áreas comuns;
- acessibilidade.

### Financeiro e documentos
- valor do condomínio;
- IPTU;
- taxa extra;
- obras aprovadas;
- regras do condomínio;
- pets;
- débitos;
- matrícula/ônus.

## Comparação automática

O sistema mantém a nota auxiliar:
- 45% condição técnica;
- 25% localização;
- 30% custo-benefício.

A nota de localização considera:
- distância do trabalho;
- distância do metrô;
- avaliação feita pelo próprio Samir do bairro e da rotina.

## Dados no celular

Não existe Firebase nem banco remoto.

O banco principal fica no armazenamento privado do aplicativo Android e recebe espelho automático no aparelho.

Em Android moderno:
- `Downloads/Casa do Samir/dados-apartamentos.json`
- `Downloads/Casa do Samir/Relatorios`
- `Downloads/Casa do Samir/Backups`

O app também mantém o armazenamento web local como camada adicional de recuperação.

## PDFs, impressão e compartilhamento

- PDF individual do apartamento;
- PDF de comparação;
- impressão nativa do Android;
- compartilhamento do PDF pelo menu do Android;
- WhatsApp quando selecionado pelo usuário;
- backup JSON;
- restauração de backup.

Mapas e cálculo automático de localização dependem de internet. As bibliotecas de PDF também são carregadas de CDN e ficam sujeitas à disponibilidade de rede/cache da WebView.

## Google Maps

Há três ações simples:
- `Localizar`: calcula endereço, distância e metrô;
- `Mapa`: abre o apartamento;
- `Trabalho`: abre a rota até o endereço de trabalho.

## Android

- App: `Casa do Samir`
- Package: `br.com.thiaguinhosolucoes.casadosamir`
- minSdk: 24
- targetSdk: 37
- compileSdk: 37
- Java: 17
- Android Gradle Plugin: 9.3.1
- Gradle: 9.5
- AndroidX Core: 1.19.0
- AndroidX WebKit: 1.16.0 estável

## Como gerar o APK pelo GitHub

1. Crie um repositório.
2. Extraia o ZIP.
3. Envie **o conteúdo do ZIP para a raiz do repositório**.
4. Confirme que `.github/workflows/build-apk.yml` foi enviado.
5. Abra `Actions`.
6. Abra `Gerar APK - Casa do Samir`.
7. Use `Run workflow` se não tiver iniciado automaticamente.
8. Aguarde a execução ficar verde.
9. Abra a execução.
10. Em `Artifacts`, baixe `Casa-do-Samir-APK`.
11. Extraia o artifact e instale `Casa-do-Samir.apk`.

## Estrutura esperada na raiz

```text
.github/
app/
.gitignore
build.gradle
gradle.properties
settings.gradle
README.md
SUBIR-NO-GITHUB.txt
```

## Assinatura do produto

**Powered by thIAguinho Soluções**
