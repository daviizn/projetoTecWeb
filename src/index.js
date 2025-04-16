const state = {
  currentView: 'cadastro',
  treinos: JSON.parse(localStorage.getItem('treinos')) || [],
  editingId: null
}

const app = document.getElementById('app')

function Container(...children) {
  const div = document.createElement('div')
  children.forEach(child => div.appendChild(child))
  return div
}

function Header(title) {
  const h1 = document.createElement('h1')
  h1.textContent = title
  const header = document.createElement('header')
  header.appendChild(h1)
  return header
}

function Button(text, className, dataView) {
  const button = document.createElement('button')
  button.textContent = text
  if (className) button.classList.add(className)
  if (dataView) button.dataset.view = dataView
  return button
}

function FormGroup(labelText, inputId, inputType, required = false) {
  const label = document.createElement('label')
  label.setAttribute('for', inputId)
  label.textContent = labelText
  
  let input
  if (inputType === 'textarea') {
    input = document.createElement('textarea')
    input.id = inputId
    input.required = required
  } else if (inputType === 'select') {
    input = document.createElement('select')
    input.id = inputId
    input.required = required
    const options = [
      { value: '', text: 'Selecione...' },
      { value: 'Musculação', text: 'Musculação' },
      { value: 'Cardio', text: 'Cardio' },
      { value: 'Funcional', text: 'Funcional' },
      { value: 'Alongamento', text: 'Alongamento' }
    ]
    options.forEach(opt => {
      const option = document.createElement('option')
      option.value = opt.value
      option.textContent = opt.text
      input.appendChild(option)
    })
  } else {
    input = document.createElement('input')
    input.type = inputType
    input.id = inputId
    input.required = required
    if (inputType === 'number') input.min = 5
  }
  
  const div = document.createElement('div')
  div.classList.add('form-group')
  div.appendChild(label)
  div.appendChild(input)
  return div
}

function TreinoItem(treino) {
  const h3 = document.createElement('h3')
  h3.textContent = treino.nome
  
  const tipo = document.createElement('p')
  tipo.innerHTML = `<strong>Tipo:</strong> ${treino.tipo}`
  
  const duracao = document.createElement('p')
  duracao.innerHTML = `<strong>Duração:</strong> ${treino.duracao} minutos`
  
  const exercicios = document.createElement('p')
  exercicios.innerHTML = `<strong>Exercícios:</strong> ${Array.isArray(treino.exercicios) ? treino.exercicios.join(', ') : treino.exercicios}`
  
  const editBtn = Button('Editar', 'btn-edit')
  editBtn.dataset.id = treino.id
  
  const removeBtn = Button('Remover', 'btn-remove')
  removeBtn.dataset.id = treino.id
  
  const li = document.createElement('li')
  li.classList.add('treino-item')
  li.dataset.id = treino.id
  li.append(h3, tipo, duracao, exercicios, editBtn, removeBtn)
  
  return li
}

function ModalEdit() {
  const modal = document.createElement('div')
  modal.id = 'edit-modal'
  modal.classList.add('modal')
  
  const content = document.createElement('div')
  content.classList.add('modal-content')
  
  const header = document.createElement('div')
  header.classList.add('modal-header')
  
  const h2 = document.createElement('h2')
  h2.textContent = 'Editar Treino'
  
  const closeBtn = document.createElement('button')
  closeBtn.classList.add('close-modal')
  closeBtn.innerHTML = '&times;'
  
  header.append(h2, closeBtn)
  
  const form = document.createElement('form')
  form.id = 'edit-form'
  
  form.append(
    FormGroup('Nome do Treino', 'edit-nome', 'text', true),
    FormGroup('Tipo de Treino', 'edit-tipo', 'select', true),
    FormGroup('Duração (minutos)', 'edit-duracao', 'number', true),
    FormGroup('Exercícios (separados por vírgula)', 'edit-exercicios', 'textarea', true)
  )
  
  const submitBtn = Button('Salvar Alterações', null)
  submitBtn.type = 'submit'
  form.appendChild(submitBtn)
  
  content.append(header, form)
  modal.appendChild(content)
  
  return modal
}

function renderCadastro() {
  const section = document.createElement('section')
  section.classList.add('form-section')
  
  const h2 = document.createElement('h2')
  h2.textContent = 'Cadastrar Novo Treino'
  
  const form = document.createElement('form')
  form.id = 'treino-form'
  
  form.append(
    FormGroup('Nome do Treino', 'nome', 'text', true),
    FormGroup('Tipo de Treino', 'tipo', 'select', true),
    FormGroup('Duração (minutos)', 'duracao', 'number', true),
    FormGroup('Exercícios (separados por vírgula)', 'exercicios', 'textarea', true)
  )
  
  const submitBtn = Button('Salvar Treino', null)
  submitBtn.type = 'submit'
  form.appendChild(submitBtn)
  
  section.append(h2, form)
  return section
}

function renderLista() {
  const section = document.createElement('section')
  section.classList.add('form-section')
  
  const h2 = document.createElement('h2')
  h2.textContent = 'Lista de Treinos'
  
  if (state.treinos.length === 0) {
    const p = document.createElement('p')
    p.textContent = 'Nenhum treino cadastrado ainda.'
    section.append(h2, p)
    return section
  }
  
  const ul = document.createElement('ul')
  ul.classList.add('treino-list')
  
  state.treinos.forEach(treino => {
    ul.appendChild(TreinoItem(treino))
  })
  
  section.append(h2, ul)
  return section
}

function renderApp() {
  app.innerHTML = ''
  
  const header = Header('Web Treinos')
  
  const nav = document.createElement('nav')
  const cadastroBtn = Button('Cadastrar Treino', state.currentView === 'cadastro' ? 'active' : '', 'cadastro')
  const listaBtn = Button(`Lista de Treinos (${state.treinos.length})`, state.currentView === 'lista' ? 'active' : '', 'lista')
  nav.append(cadastroBtn, listaBtn)
  
  const main = document.createElement('main')
  main.appendChild(state.currentView === 'cadastro' ? renderCadastro() : renderLista())
  
  const modal = ModalEdit()
  
  app.append(header, nav, main, modal)
  setupEvents()
}

function setupEvents() {
 
  document.querySelectorAll('nav button').forEach(button => {
    button.addEventListener('click', (e) => {
      state.currentView = e.target.dataset.view
      renderApp()
    })
  })

  const form = document.getElementById('treino-form')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      handleFormSubmit()
    })
  }

  const editForm = document.getElementById('edit-form')
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault()
      handleEditSubmit()
    })
  }

  document.querySelectorAll('.btn-remove').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.id)
      removeTreino(id)
    })
  })

  document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.id)
      openEditModal(id)
    })
  })

  const closeModal = document.querySelector('.close-modal')
  if (closeModal) {
    closeModal.addEventListener('click', closeEditModal)
  }
}

function handleFormSubmit() {
  const nome = document.getElementById('nome').value.trim()
  const tipo = document.getElementById('tipo').value
  const duracao = document.getElementById('duracao').value
  const exercicios = document.getElementById('exercicios').value.trim()

  if (!nome || !tipo || !duracao || !exercicios) {
    alert('Preencha todos os campos obrigatórios!')
    return
  }

  const novoTreino = {
    id: Date.now(),
    nome,
    tipo,
    duracao,
    exercicios: exercicios.split(',').map(e => e.trim()),
    createdAt: new Date().toISOString()
  }

  state.treinos.push(novoTreino)
  saveTreinos()
  
  if (state.currentView === 'lista') {
    renderApp()
  } else {
    state.currentView = 'lista'
    renderApp()
  }
}

function removeTreino(id) {
  if (confirm('Tem certeza que deseja remover este treino?')) {
    state.treinos = state.treinos.filter(treino => treino.id !== id)
    saveTreinos()
    renderApp()
  }
}

function openEditModal(id) {
  const treino = state.treinos.find(t => t.id === id)
  if (!treino) return

  state.editingId = id
  
  document.getElementById('edit-nome').value = treino.nome
  document.getElementById('edit-tipo').value = treino.tipo
  document.getElementById('edit-duracao').value = treino.duracao
  document.getElementById('edit-exercicios').value = Array.isArray(treino.exercicios) 
    ? treino.exercicios.join(', ') 
    : treino.exercicios
  
  document.getElementById('edit-modal').style.display = 'flex'
}

function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none'
  state.editingId = null
}

function handleEditSubmit() {
  const nome = document.getElementById('edit-nome').value.trim()
  const tipo = document.getElementById('edit-tipo').value
  const duracao = document.getElementById('edit-duracao').value
  const exercicios = document.getElementById('edit-exercicios').value.trim()

  if (!nome || !tipo || !duracao || !exercicios) {
    alert('Preencha todos os campos obrigatórios!')
    return
  }

  const treinoIndex = state.treinos.findIndex(t => t.id === state.editingId)
  if (treinoIndex === -1) return

  state.treinos[treinoIndex] = {
    ...state.treinos[treinoIndex],
    nome,
    tipo,
    duracao,
    exercicios: exercicios.split(',').map(e => e.trim())
  }

  saveTreinos()
  closeEditModal()
  renderApp()
}

function saveTreinos() {
  localStorage.setItem('treinos', JSON.stringify(state.treinos))
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp()
})