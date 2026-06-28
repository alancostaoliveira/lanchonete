document.addEventListener('DOMContentLoaded', async () => {
  const storageKeys = {
    catalogOverride: 'sabornamesa.catalogOverride',
    cart: 'sabornamesa.cart',
    currentUser: 'sabornamesa.currentUser',
    users: 'sabornamesa.users',
    theme: 'sabornamesa.theme',
  };

  const defaultCatalog = [
    {
      id: 'smash-burger',
      nome: 'Smash Burger',
      descricao: 'Pão brioche, blend da casa, cheddar e molho especial.',
      categoria: 'burger',
      preco: 28,
      imagem: 'assets/img/smash-burger.svg',
    },
    {
      id: 'chicken-melt',
      nome: 'Chicken Melt',
      descricao: 'Frango crocante, queijo derretido e salada fresca.',
      categoria: 'burger',
      preco: 27,
      imagem: 'assets/img/chicken-melt.svg',
    },
    {
      id: 'rustic-fries',
      nome: 'Batata Rústica',
      descricao: 'Porção dourada com tempero da casa.',
      categoria: 'acompanhamento',
      preco: 16,
      imagem: 'assets/img/rustic-fries.svg',
    },
    {
      id: 'milkshake',
      nome: 'Milk-shake',
      descricao: 'Chocolate, morango ou creme.',
      categoria: 'bebida',
      preco: 15,
      imagem: 'assets/img/milkshake.svg',
    },
  ];

  const categoryLabels = {
    burger: 'Burger',
    acompanhamento: 'Acompanhamento',
    bebida: 'Bebida',
    sobremesa: 'Sobremesa',
  };

  const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  let activeCatalog = defaultCatalog;

  const sanitizeCatalogItem = (item, index) => ({
    id: String(item.id || `item-${index + 1}`),
    nome: String(item.nome || '').trim(),
    descricao: String(item.descricao || '').trim(),
    categoria: String(item.categoria || 'burger').trim(),
    preco: Number(item.preco),
    imagem: String(item.imagem || '').trim(),
  });

  const sanitizeCatalog = (catalog) =>
    Array.isArray(catalog)
      ? catalog
          .map((item, index) => sanitizeCatalogItem(item, index))
          .filter((item) => item.nome && item.descricao && item.imagem)
      : defaultCatalog;

  const loadCatalogFromFile = async () => {
    try {
      const response = await fetch('data/catalogo.json', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar o catálogo padrão.');
      }

      const data = await response.json();
      return sanitizeCatalog(data);
    } catch {
      return defaultCatalog;
    }
  };

  const readJSON = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const writeJSON = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));
  const getCatalog = () => activeCatalog;
  const setCatalog = (catalog) => {
    activeCatalog = sanitizeCatalog(catalog);
    writeJSON(storageKeys.catalogOverride, activeCatalog);
  };
  const clearCatalogOverride = () => {
    localStorage.removeItem(storageKeys.catalogOverride);
  };
  const getCart = () => readJSON(storageKeys.cart, []);
  const setCart = (cart) => writeJSON(storageKeys.cart, cart);
  const getCurrentUser = () => readJSON(storageKeys.currentUser, null);
  const setCurrentUser = (user) => writeJSON(storageKeys.currentUser, user);
  const getTheme = () => localStorage.getItem(storageKeys.theme) || 'light';
  const setTheme = (theme) => localStorage.setItem(storageKeys.theme, theme);

  const sourceCatalog = await loadCatalogFromFile();
  const overrideCatalog = readJSON(storageKeys.catalogOverride, null);
  activeCatalog = sanitizeCatalog(overrideCatalog || sourceCatalog);
  localStorage.removeItem('sabornamesa.catalog');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    const themeButton = document.querySelector('[data-theme-toggle]');
    if (themeButton) {
      themeButton.textContent = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
      themeButton.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro',
      );
    }
  };

  applyTheme(getTheme());

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }

      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const themeToggle = document.createElement('button');
    themeToggle.type = 'button';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('data-theme-toggle', 'true');
    themeToggle.addEventListener('click', () => {
      const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      applyTheme(nextTheme);
    });

    primaryNav.parentElement.insertBefore(themeToggle, primaryNav);
  }

  ensureCartBadge();

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const updateCartBadges = () => {
    const totalQuantity = getCart().reduce(
      (sum, item) => sum + Number(item.quantidade),
      0,
    );
    document
      .querySelectorAll('[data-cart-count], [data-cart-badge]')
      .forEach((element) => {
        element.textContent = String(totalQuantity);
        if (element.hasAttribute('data-cart-badge')) {
          element.hidden = totalQuantity === 0;
        }
      });
  };

  function ensureCartBadge() {
    document
      .querySelectorAll('.primary-nav a[href="carrinho.html"]')
      .forEach((link) => {
        if (link.querySelector('[data-cart-badge]')) {
          return;
        }

        const badge = document.createElement('span');
        badge.className = 'nav-badge';
        badge.setAttribute('data-cart-badge', 'true');
        badge.hidden = true;
        badge.textContent = '0';
        link.append(' ', badge);
      });
  }

  const renderCatalogGrid = () => {
    const grid = document.querySelector('[data-catalog-grid]');
    if (!grid) {
      return;
    }

    const status = document.querySelector('[data-catalog-status]');
    const filterButtons = document.querySelectorAll('.filter-btn');

    const render = (filter = 'all') => {
      const catalog = getCatalog();
      const filteredCatalog =
        filter === 'all'
          ? catalog
          : catalog.filter((item) => item.categoria === filter);

      grid.innerHTML = filteredCatalog
        .map(
          (item) => `
        <article class="menu-item reveal" data-category="${item.categoria}" data-item-id="${item.id}">
          <div class="menu-item__media">
            <img src="${item.imagem}" alt="${item.nome}">
          </div>
          <div class="menu-item__meta">
            <span class="menu-item__category">${categoryLabels[item.categoria] || item.categoria}</span>
            <h2>${item.nome}</h2>
            <p>${item.descricao}</p>
          </div>
          <div class="menu-item__footer">
            <strong>${currency.format(Number(item.preco))}</strong>
            <button class="btn btn-primary btn-small" type="button" data-add-to-cart="${item.id}">Adicionar ao carrinho</button>
          </div>
        </article>
      `,
        )
        .join('');

      if (status) {
        status.textContent = `${filteredCatalog.length} item(ns) exibido(s).`;
      }

      filterButtons.forEach((button) => {
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.filter === filter),
        );
      });

      grid
        .querySelectorAll('.reveal')
        .forEach((element) => revealObserver.observe(element));
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        render(button.dataset.filter);
      });
    });

    grid.addEventListener('click', (event) => {
      const addButton = event.target.closest('[data-add-to-cart]');
      if (!addButton) {
        return;
      }

      const catalogItem = getCatalog().find(
        (item) => item.id === addButton.dataset.addToCart,
      );
      if (!catalogItem) {
        return;
      }

      const cart = getCart();
      const existing = cart.find((item) => item.id === catalogItem.id);
      if (existing) {
        existing.quantidade += 1;
      } else {
        cart.push({
          id: catalogItem.id,
          nome: catalogItem.nome,
          preco: Number(catalogItem.preco),
          quantidade: 1,
          imagem: catalogItem.imagem,
        });
      }

      setCart(cart);
      addButton.textContent = 'Adicionado';
      if (status) {
        status.textContent = `${catalogItem.nome} adicionado ao carrinho.`;
      }
      setTimeout(() => {
        addButton.textContent = 'Adicionar ao carrinho';
      }, 1000);
      updateCartBadges();
    });

    render();
  };

  const renderCartPage = () => {
    const list = document.querySelector('[data-cart-list]');
    if (!list) {
      return;
    }

    const totalNode = document.querySelector('[data-cart-total]');
    const countNode = document.querySelector('[data-cart-count]');

    const render = () => {
      const cart = getCart();
      const total = cart.reduce(
        (sum, item) => sum + Number(item.preco) * Number(item.quantidade),
        0,
      );
      const itemCount = cart.reduce(
        (sum, item) => sum + Number(item.quantidade),
        0,
      );

      if (!cart.length) {
        list.innerHTML =
          '<div class="empty-state reveal"><h2>Seu carrinho está vazio.</h2><p>Volte ao cardápio para adicionar seus produtos favoritos.</p><a class="btn btn-primary" href="cardapio.html">Ir ao cardápio</a></div>';
      } else {
        list.innerHTML = cart
          .map(
            (item) => `
          <article class="cart-item reveal" data-cart-item-id="${item.id}">
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="cart-item__content">
              <h2>${item.nome}</h2>
              <p>${currency.format(Number(item.preco))}</p>
              <div class="cart-item__controls">
                <button class="cart-step" type="button" data-quantity-action="decrease" data-item-id="${item.id}">-</button>
                <span>${item.quantidade}</span>
                <button class="cart-step" type="button" data-quantity-action="increase" data-item-id="${item.id}">+</button>
                <button class="btn btn-secondary btn-small" type="button" data-remove-item="${item.id}">Remover</button>
              </div>
            </div>
            <strong>${currency.format(Number(item.preco) * Number(item.quantidade))}</strong>
          </article>
        `,
          )
          .join('');

        list
          .querySelectorAll('.reveal')
          .forEach((element) => revealObserver.observe(element));
      }

      if (totalNode) {
        totalNode.textContent = currency.format(total);
      }

      if (countNode) {
        countNode.textContent = String(itemCount);
      }

      updateCartBadges();
    };

    list.addEventListener('click', (event) => {
      const removeButton = event.target.closest('[data-remove-item]');
      const quantityButton = event.target.closest('[data-quantity-action]');

      if (removeButton) {
        setCart(
          getCart().filter(
            (item) => item.id !== removeButton.dataset.removeItem,
          ),
        );
        render();
        return;
      }

      if (quantityButton) {
        const cart = getCart();
        const item = cart.find(
          (entry) => entry.id === quantityButton.dataset.itemId,
        );
        if (!item) {
          return;
        }

        if (quantityButton.dataset.quantityAction === 'increase') {
          item.quantidade += 1;
        } else {
          item.quantidade -= 1;
          if (item.quantidade <= 0) {
            setCart(cart.filter((entry) => entry.id !== item.id));
            render();
            return;
          }
        }

        setCart(cart);
        render();
      }
    });

    render();
  };

  const renderCadastroPage = () => {
    const form = document.querySelector('[data-auth-form]');
    if (!form) {
      return;
    }

    const status = document.querySelector('[data-auth-status]');
    const fieldError = (name) =>
      form.querySelector(`[data-error-for="${name}"]`);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      ['nome', 'email', 'perfil', 'senha'].forEach((field) => {
        const node = fieldError(field);
        if (node) {
          node.textContent = '';
        }
      });

      const data = new FormData(form);
      const nome = String(data.get('nome') || '').trim();
      const email = String(data.get('email') || '').trim();
      const perfil = String(data.get('perfil') || 'usuario');
      const senha = String(data.get('senha') || '').trim();

      let hasError = false;

      if (nome.length < 3) {
        fieldError('nome').textContent = 'Informe um nome válido.';
        hasError = true;
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        fieldError('email').textContent = 'Informe um e-mail válido.';
        hasError = true;
      }

      if (!perfil) {
        fieldError('perfil').textContent = 'Selecione um perfil.';
        hasError = true;
      }

      if (senha.length < 4) {
        fieldError('senha').textContent = 'Use pelo menos 4 caracteres.';
        hasError = true;
      }

      if (hasError) {
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'Corrija os campos destacados.';
        }
        return;
      }

      const user = { nome, email, perfil };
      setCurrentUser(user);

      const users = readJSON(storageKeys.users, []);
      users.push({ ...user, criadoEm: new Date().toISOString() });
      writeJSON(storageKeys.users, users);

      if (status) {
        status.className = 'form-status is-success';
        status.textContent =
          perfil === 'admin'
            ? 'Cadastro criado. Redirecionando para o painel administrativo.'
            : 'Cadastro criado. Redirecionando para o cardápio.';
      }

      setTimeout(() => {
        window.location.href =
          perfil === 'admin' ? 'admin.html' : 'cardapio.html';
      }, 700);
    });
  };

  const renderAdminPage = () => {
    const form = document.querySelector('[data-admin-form]');
    const list = document.querySelector('[data-admin-list]');
    const accessStatus = document.querySelector('[data-admin-access-status]');
    if (!form || !list || !accessStatus) {
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.perfil !== 'admin') {
      accessStatus.className = 'admin-status is-error';
      accessStatus.innerHTML =
        'Acesso restrito. Faça cadastro como administrador em <a href="cadastro.html">Cadastro</a>.';
      form
        .querySelectorAll('input, textarea, select, button')
        .forEach((element) => {
          element.disabled = true;
        });
      list.innerHTML =
        '<div class="empty-state"><h2>Painel bloqueado.</h2><p>Somente um usuário com perfil de administrador pode alterar os produtos.</p></div>';
      return;
    }

    accessStatus.className = 'admin-status is-success';
    accessStatus.textContent = `Logado como ${currentUser.nome}. As alterações ficam salvas neste navegador.`;

    const status = document.querySelector('[data-admin-status]');
    const resetButton = document.querySelector('[data-reset-admin-form]');
    const hiddenId = form.querySelector('input[name="id"]');
    const jsonEditor = document.querySelector('[data-catalog-json]');
    const jsonStatus = document.querySelector('[data-json-status]');
    const jsonSaveButton = document.querySelector('[data-json-save]');
    const jsonRefreshButton = document.querySelector('[data-json-refresh]');
    const jsonExportButton = document.querySelector('[data-json-export]');

    const fillForm = (item) => {
      hiddenId.value = item.id;
      form.nome.value = item.nome;
      form.descricao.value = item.descricao;
      form.categoria.value = item.categoria;
      form.preco.value = item.preco;
      form.imagem.value = item.imagem;
      if (status) {
        status.className = 'form-status is-success';
        status.textContent = `Editando ${item.nome}.`;
      }
    };

    const clearForm = () => {
      form.reset();
      hiddenId.value = '';
      if (status) {
        status.className = 'form-status';
        status.textContent = '';
      }
    };

    const render = () => {
      const catalog = getCatalog();
      list.innerHTML = `
        <div class="admin-list__header">
          <h2>Produtos cadastrados</h2>
          <p>${catalog.length} itens no catálogo.</p>
        </div>
        <div class="admin-catalog">
          ${catalog
            .map(
              (item) => `
            <article class="admin-item">
              <img src="${item.imagem}" alt="${item.nome}">
              <div>
                <span class="admin-item__tag">${categoryLabels[item.categoria] || item.categoria}</span>
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                <strong>${currency.format(Number(item.preco))}</strong>
              </div>
              <div class="admin-item__actions">
                <button class="btn btn-secondary btn-small" type="button" data-edit-item="${item.id}">Editar</button>
                <button class="btn btn-primary btn-small" type="button" data-delete-item="${item.id}">Excluir</button>
              </div>
            </article>
          `,
            )
            .join('')}
        </div>
      `;

      if (jsonEditor) {
        jsonEditor.value = JSON.stringify(catalog, null, 2);
      }
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      [
        'produtoNome',
        'produtoDescricao',
        'produtoCategoria',
        'produtoPreco',
        'produtoImagem',
      ].forEach((field) => {
        const node = form.querySelector(`[data-error-for="${field}"]`);
        if (node) {
          node.textContent = '';
        }
      });

      const data = new FormData(form);
      const id = String(data.get('id') || '').trim() || `item-${Date.now()}`;
      const nome = String(data.get('nome') || '').trim();
      const descricao = String(data.get('descricao') || '').trim();
      const categoria = String(data.get('categoria') || '').trim();
      const preco = Number(String(data.get('preco') || '').replace(',', '.'));
      const imagem = String(data.get('imagem') || '').trim();

      let hasError = false;

      if (nome.length < 3) {
        form.querySelector('[data-error-for="produtoNome"]').textContent =
          'Nome obrigatório.';
        hasError = true;
      }

      if (descricao.length < 10) {
        form.querySelector('[data-error-for="produtoDescricao"]').textContent =
          'Descreva melhor o produto.';
        hasError = true;
      }

      if (!categoria) {
        form.querySelector('[data-error-for="produtoCategoria"]').textContent =
          'Escolha uma categoria.';
        hasError = true;
      }

      if (!Number.isFinite(preco) || preco <= 0) {
        form.querySelector('[data-error-for="produtoPreco"]').textContent =
          'Informe um preço válido.';
        hasError = true;
      }

      if (!imagem) {
        form.querySelector('[data-error-for="produtoImagem"]').textContent =
          'Informe uma imagem.';
        hasError = true;
      }

      if (hasError) {
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'Corrija os campos destacados.';
        }
        return;
      }

      const catalog = getCatalog();
      const existingIndex = catalog.findIndex((item) => item.id === id);
      const product = { id, nome, descricao, categoria, preco, imagem };

      if (existingIndex >= 0) {
        catalog[existingIndex] = product;
      } else {
        catalog.push(product);
      }

      setCatalog(catalog);
      render();
      clearForm();

      if (status) {
        status.className = 'form-status is-success';
        status.textContent =
          existingIndex >= 0
            ? 'Produto atualizado com sucesso.'
            : 'Produto cadastrado com sucesso.';
      }
    });

    list.addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-edit-item]');
      const deleteButton = event.target.closest('[data-delete-item]');

      if (editButton) {
        const item = getCatalog().find(
          (entry) => entry.id === editButton.dataset.editItem,
        );
        if (item) {
          fillForm(item);
        }
      }

      if (deleteButton) {
        setCatalog(
          getCatalog().filter(
            (entry) => entry.id !== deleteButton.dataset.deleteItem,
          ),
        );
        render();
      }
    });

    resetButton.addEventListener('click', clearForm);

    const showJsonStatus = (message, type = 'success') => {
      if (!jsonStatus) {
        return;
      }

      jsonStatus.className = `admin-status is-${type}`;
      jsonStatus.textContent = message;
    };

    if (jsonSaveButton && jsonEditor) {
      jsonSaveButton.addEventListener('click', () => {
        try {
          const parsed = JSON.parse(jsonEditor.value);
          if (!Array.isArray(parsed)) {
            throw new Error('O JSON precisa ser um array de produtos.');
          }

          setCatalog(parsed);
          render();
          showJsonStatus('JSON salvo com sucesso.', 'success');
        } catch (error) {
          showJsonStatus(error.message || 'JSON inválido.', 'error');
        }
      });
    }

    if (jsonRefreshButton && jsonEditor) {
      jsonRefreshButton.addEventListener('click', () => {
        clearCatalogOverride();
        activeCatalog = sourceCatalog;
        jsonEditor.value = JSON.stringify(sourceCatalog, null, 2);
        render();
        showJsonStatus(
          'JSON recarregado a partir do arquivo padrão.',
          'success',
        );
      });
    }

    if (jsonExportButton && jsonEditor) {
      jsonExportButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(jsonEditor.value);
          showJsonStatus(
            'JSON copiado para a área de transferência.',
            'success',
          );
        } catch {
          showJsonStatus('Não foi possível copiar automaticamente.', 'error');
        }
      });
    }

    render();
  };

  const contactForm = document.querySelector(
    '[data-contact-form], #contactForm',
  );
  if (contactForm) {
    const successMessage = document.querySelector(
      '[data-form-status], #formSuccess',
    );

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name =
        document.getElementById('name') || document.getElementById('nome');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const errors = {
        name:
          document.querySelector('[data-error-for="name"]') ||
          document.querySelector('[data-error-for="nome"]'),
        email: document.querySelector('[data-error-for="email"]'),
        message:
          document.querySelector('[data-error-for="message"]') ||
          document.querySelector('[data-error-for="mensagem"]'),
      };

      if (!name || !email || !message) {
        return;
      }

      let valid = true;
      Object.values(errors).forEach((element) => {
        if (element) {
          element.textContent = '';
        }
      });

      if (!name.value.trim()) {
        errors.name.textContent = 'Informe seu nome.';
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        errors.email.textContent = 'Informe seu e-mail.';
        valid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        errors.email.textContent = 'Digite um e-mail válido.';
        valid = false;
      }

      if (!message.value.trim()) {
        errors.message.textContent = 'Escreva uma mensagem.';
        valid = false;
      }

      if (valid) {
        if (successMessage) {
          successMessage.textContent =
            'Mensagem enviada com sucesso. Em breve entraremos em contato.';
          successMessage.classList.add('is-success');
        }
        contactForm.reset();
      } else if (successMessage) {
        successMessage.textContent = '';
        successMessage.classList.remove('is-success');
      }
    });
  }

  renderCatalogGrid();
  renderCartPage();
  renderCadastroPage();
  renderAdminPage();
  updateCartBadges();
});
