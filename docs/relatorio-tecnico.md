# Relatório Técnico - Website da Lanchonete Sabor na Mesa

## 1. Objetivo do projeto

Este projeto desenvolve um website responsivo para uma lanchonete, utilizando HTML5, CSS3 e JavaScript. O site apresenta páginas interligadas, menu funcional, cadastro de usuário e administrador, carrinho com total, painel administrativo, efeitos interativos, validação de formulário e otimizações básicas de SEO.

## 2. Escolhas de design e arquitetura

A interface foi pensada para transmitir apetite, acolhimento e agilidade. O layout usa tons quentes, cartões com sombra e espaçamento generoso para facilitar a leitura.

A arquitetura foi organizada de forma simples e escalável:

- HTML separado por páginas: Home, Sobre, Cardápio, Contato, Cadastro, Carrinho e Admin.
- CSS centralizado em um único arquivo compartilhado.
- JavaScript centralizado em um único arquivo para manter consistência nas interações.
- Persistência local via localStorage para cadastro, carrinho e catálogo.
- Estrutura sem frameworks, priorizando portabilidade e facilidade de manutenção.

## 3. Tecnologias utilizadas

- HTML5 para estrutura semântica.
- CSS3 para layout responsivo, animações visuais e identidade visual.
- JavaScript para menu responsivo, validação do formulário, filtro do cardápio e efeito de revelação.
- JavaScript para carrinho, cadastro e painel administrativo.

## 4. Aplicação dos conceitos estudados

### Layout responsivo

O site usa Grid Layout, Flexbox e media queries para se adaptar a telas grandes e pequenas. No celular, o menu se transforma em botão hambúrguer e os blocos passam para uma coluna única.

### Menu de navegação funcional

Todas as páginas possuem navegação entre Home, Sobre, Cardápio, Contato, Cadastro, Carrinho e Admin. Em telas menores, o menu é expandido e recolhido via JavaScript.

### Formulário com validação

A página de contato contém validação em JavaScript para nome, e-mail e mensagem. O envio exibe mensagens de erro ou confirmação, evitando submissão vazia ou com e-mail inválido.

### Cadastro, carrinho e administração

O site inclui uma página de cadastro com escolha de perfil. O usuário comum é redirecionado para o cardápio e o administrador para o painel de gestão. O carrinho calcula o total dos itens adicionados. O admin pode cadastrar novos produtos, alterar preço, trocar imagens e excluir itens, tudo salvo neste navegador.

### Efeitos interativos

Foram aplicados dois efeitos interativos principais:

- Animação de revelação dos elementos ao aparecer na tela.
- Filtro dinâmico no cardápio, permitindo visualizar categorias específicas.

### SEO básico

O projeto inclui:

- Títulos específicos por página.
- Meta description e meta keywords.
- Estrutura semântica com header, main, section, article, aside e footer.
- Texto claro e descritivo para favorecer indexação.

## 5. Desafios enfrentados

O principal desafio foi manter o projeto simples, mas completo, sem uso de frameworks. Também foi necessário equilibrar aparência visual, usabilidade e compatibilidade com diferentes tamanhos de tela.

## 6. Capturas de tela

Inserir as capturas de tela final nas seguintes posições:

- Home
- Sobre
- Cardápio
- Contato
- Cadastro
- Carrinho
- Admin

## 7. Conclusão

O site atende aos requisitos propostos ao combinar responsividade, navegação funcional, validação de formulário, interatividade, cadastro, carrinho, administração e SEO básico em uma estrutura organizada e de fácil manutenção.
