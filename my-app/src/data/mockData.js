const image = (id, width = 900, height = 650) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=82`

export const landingImages = {
  hero: image('photo-1562774053-701939374585', 1600, 1000),
  director: image('photo-1551836022-d5d88e9218df', 500, 520),
}

export const schoolValues = [
  {
    title: 'Qualidade',
    text: 'Acompanhamento academico proximo, metas claras e avaliacao continua em cada etapa.',
  },
  {
    title: 'Inovacao',
    text: 'Projetos maker, tecnologia em sala e atividades que conectam teoria e pratica.',
  },
  {
    title: 'Comunidade',
    text: 'Familias, professores e estudantes trabalhando juntos por uma rotina mais acolhedora.',
  },
]

export const testimonials = [
  {
    name: 'Tatiane Rodrigues',
    role: 'Mae do 8o ano',
    avatar: 'https://i.pravatar.cc/160?img=47',
    text: 'O portal aproximou nossa familia da escola. Consigo acompanhar entregas, notas e recados sem perder nenhum prazo importante.',
  },
  {
    name: 'Nora Reis',
    role: 'Mae do Ensino Medio',
    avatar: 'https://i.pravatar.cc/160?img=32',
    text: 'As mensagens dos professores sao objetivas e o calendario deixa a semana muito mais previsivel para os estudos em casa.',
  },
  {
    name: 'Julio Pinheiro',
    role: 'Responsavel',
    avatar: 'https://i.pravatar.cc/160?img=12',
    text: 'A escola combina disciplina e cuidado. O ranking dos jogos tambem motivou bastante a turma do meu filho.',
  },
  {
    name: 'Ana Helena',
    role: 'Mae do 6o ano',
    avatar: 'https://i.pravatar.cc/160?img=49',
    text: 'Gosto da forma como os projetos aparecem para as familias. A gente enxerga o crescimento dos alunos alem das provas.',
  },
  {
    name: 'Paulo Mendonca',
    role: 'Pai do Fundamental',
    avatar: 'https://i.pravatar.cc/160?img=15',
    text: 'A area logada e simples de usar e trouxe mais autonomia para organizar materiais, atividades e revisoes.',
  },
  {
    name: 'Patricia Peres',
    role: 'Mae do 9o ano',
    avatar: 'https://i.pravatar.cc/160?img=44',
    text: 'Os alertas sobre notas e faltas ajudam a agir cedo. E uma escola que comunica bem e acompanha de verdade.',
  },
]

export const highlightPhotos = [
  {
    title: 'Destaques do Semestre',
    subtitle: 'Alunos reconhecidos por colaboracao e desempenho',
    image: image('photo-1523580846011-d3a5bc25702b', 700, 460),
  },
  {
    title: 'Projeto de Ciencias',
    subtitle: 'Experimentos apresentados na mostra escolar',
    image: image('photo-1509062522246-3755977927d7', 700, 460),
  },
  {
    title: 'Equipe de Debate',
    subtitle: 'Preparacao para campeonato regional',
    image: image('photo-1517486808906-6ca8b3f04846', 700, 460),
  },
]

export const schoolProjects = [
  {
    title: 'Robotica Avancada',
    text: 'Desafios semanais com sensores, programacao e apresentacoes em grupo.',
    image: image('photo-1517976547714-720226b864c1', 600, 420),
  },
  {
    title: 'Horta Comunitaria',
    text: 'Cuidado com canteiros, ciencias naturais e sustentabilidade na pratica.',
    image: image('photo-1466692476868-aef1dfb1e735', 600, 420),
  },
  {
    title: 'Clube de Debates',
    text: 'Oratoria, pesquisa e argumentacao para fortalecer pensamento critico.',
    image: image('photo-1551836022-d5d88e9218df', 600, 420),
  },
  {
    title: 'Laboratorio Criativo',
    text: 'Prototipos, artes visuais e resolucao de problemas com metodologia maker.',
    image: image('photo-1581090464777-f3220bbe1b8b', 600, 420),
  },
]

export const courses = [
  {
    title: 'Infantil',
    label: 'Programacao por Crianca',
    image: image('photo-1503676260728-1c00da094a0b', 500, 360),
  },
  {
    title: 'Fundamental',
    label: 'Propriedade ENEM',
    image: image('photo-1513475382585-d06e58bcb0e0', 500, 360),
  },
  {
    title: 'Medio',
    label: 'Musica',
    image: image('photo-1520523839897-bd0b52f945a0', 500, 360),
  },
  {
    title: 'Fundamental',
    label: 'Robotica',
    image: image('photo-1581090464777-f3220bbe1b8b', 500, 360),
  },
  {
    title: 'Medio',
    label: 'Idiomas',
    image: image('photo-1509062522246-3755977927d7', 500, 360),
  },
  {
    title: 'Medio',
    label: 'Ciencias Aplicadas',
    image: image('photo-1532094349884-543bc11b234d', 500, 360),
  },
]

export const studentProfile = {
  name: 'Anna Regina',
  course: '9o ano B',
  email: 'anna.regina@progresso.edu',
  phone: '(11) 98888-2026',
  registration: 'PG-2026-0914',
  avatar: 'https://i.pravatar.cc/180?img=45',
  guardian: 'Helena Regina',
  shift: 'Matutino',
  attendance: '96%',
}

export const teachers = [
  { name: 'Marco Nunes', subject: 'Matematica', avatar: 'https://i.pravatar.cc/120?img=3' },
  { name: 'Elisa Duarte', subject: 'Redacao', avatar: 'https://i.pravatar.cc/120?img=5' },
  { name: 'Rafael Brito', subject: 'Historia', avatar: 'https://i.pravatar.cc/120?img=11' },
  { name: 'Nina Salles', subject: 'Ingles', avatar: 'https://i.pravatar.cc/120?img=20' },
  { name: 'Pedro Ramos', subject: 'Quimica', avatar: 'https://i.pravatar.cc/120?img=33' },
]

export const dashboardStats = [
  { label: 'Progresso do Curso', value: '78%', tone: 'coral', detail: '12 aulas concluidas' },
  { label: 'Mensagens Recebidas', value: '24', tone: 'royal', detail: '3 novas hoje' },
  { label: 'Graficos de Frequencia', value: '96%', tone: 'success', detail: 'Presenca mensal' },
]

export const todaysClasses = [
  { time: '08:00', title: 'Matematica', teacher: 'Marco Nunes', room: 'Sala 12' },
  { time: '10:00', title: 'Redacao', teacher: 'Elisa Duarte', room: 'Lab 2' },
  { time: '13:30', title: 'Historia', teacher: 'Rafael Brito', room: 'Sala 08' },
]

export const pendingTasks = [
  { title: 'Lista de Algebra', subject: 'Matematica', status: 'Pendente', due: '04/06/2026' },
  { title: 'Resenha literaria', subject: 'Redacao', status: 'Atrasado', due: '01/06/2026' },
  { title: 'Mapa mental', subject: 'Historia', status: 'Pendente', due: '06/06/2026' },
]

export const recentMessages = [
  {
    from: 'Marco Nunes',
    preview: 'Revise os exercicios 8 a 12 antes da aula.',
    avatar: 'https://i.pravatar.cc/100?img=3',
  },
  {
    from: 'Elisa Duarte',
    preview: 'Sua introducao ficou mais forte nesta versao.',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    from: 'Nina Salles',
    preview: 'Novo audio liberado para treino de listening.',
    avatar: 'https://i.pravatar.cc/100?img=20',
  },
]

export const subjects = [
  { name: 'Matematica', p1: 7.5, p2: 8.1, p3: 8.6, average: 8.0, absences: 2 },
  { name: 'Redacao', p1: 6.8, p2: 7.4, p3: 8.2, average: 7.5, absences: 1 },
  { name: 'Historia', p1: 8.2, p2: 8.0, p3: 8.8, average: 8.3, absences: 0 },
  { name: 'Ingles', p1: 5.9, p2: 7.1, p3: 7.8, average: 7.0, absences: 3 },
  { name: 'Quimica', p1: 7.2, p2: 7.0, p3: 7.6, average: 7.3, absences: 2 },
  { name: 'Fisica', p1: 6.1, p2: 6.7, p3: 7.5, average: 6.8, absences: 4 },
]

export const gradeHistory = [
  { period: '1o Periodo', Matematica: 7.5, Redacao: 6.8, Historia: 8.2, Ingles: 5.9 },
  { period: '2o Periodo', Matematica: 8.1, Redacao: 7.4, Historia: 8.0, Ingles: 7.1 },
  { period: '3o Periodo', Matematica: 8.6, Redacao: 8.2, Historia: 8.8, Ingles: 7.8 },
  { period: 'Simulado', Matematica: 8.9, Redacao: 8.0, Historia: 9.0, Ingles: 8.1 },
]

export const activities = [
  { course: 'Matematica do Brasil', name: 'Equacoes do segundo grau', due: '06/06/2026', status: 'Pendente' },
  { course: 'Ingles', name: 'Listening checkpoint', due: '07/06/2026', status: 'Concluido' },
  { course: 'Historia', name: 'Linha do tempo republicana', due: '31/05/2026', status: 'Atrasado' },
  { course: 'Quimica', name: 'Relatorio de solucoes', due: '10/06/2026', status: 'Pendente' },
  { course: 'Redacao', name: 'Texto dissertativo', due: '11/06/2026', status: 'Concluido' },
  { course: 'Fisica', name: 'Lista de cinematica', due: '12/06/2026', status: 'Pendente' },
]

export const materials = [
  { title: 'Apostila de Algebra', subject: 'Matematica', type: 'PDF', size: '8.2 MB', updated: '28/05/2026' },
  { title: 'Mapa do Brasil Republicano', subject: 'Historia', type: 'PDF', size: '4.4 MB', updated: '29/05/2026' },
  { title: 'Guia de Redacao ENEM', subject: 'Redacao', type: 'PDF', size: '6.1 MB', updated: '30/05/2026' },
  { title: 'Listening Pack 03', subject: 'Ingles', type: 'Audio', size: '22 MB', updated: '31/05/2026' },
  { title: 'Resumo de Ligacoes Quimicas', subject: 'Quimica', type: 'PDF', size: '3.8 MB', updated: '01/06/2026' },
  { title: 'Simulado Comentado', subject: 'Fisica', type: 'PDF', size: '9.7 MB', updated: '02/06/2026' },
]

export const calendarEvents = [
  { day: 2, title: 'Prova de Matematica', type: 'Prova', time: '08:00' },
  { day: 4, title: 'Entrega de Redacao', type: 'Atividade', time: '10:00' },
  { day: 6, title: 'Mostra de Ciencias', type: 'Evento', time: '09:30' },
  { day: 10, title: 'Simulado Integrado', type: 'Prova', time: '07:30' },
  { day: 13, title: 'Campeonato de Jogos', type: 'Evento', time: '14:00' },
  { day: 18, title: 'Relatorio de Quimica', type: 'Atividade', time: '12:00' },
  { day: 22, title: 'Prova de Ingles', type: 'Prova', time: '10:30' },
  { day: 25, title: 'Reuniao de Projeto', type: 'Evento', time: '15:00' },
]

export const conversations = [
  {
    name: 'Marco Nunes',
    subject: 'Matematica',
    online: true,
    avatar: 'https://i.pravatar.cc/120?img=3',
    messages: [
      { from: 'teacher', text: 'Anna, sua resolucao do desafio ficou muito boa.', time: '09:12' },
      { from: 'student', text: 'Professor, posso refazer a questao 4 para melhorar a nota?', time: '09:20' },
      { from: 'teacher', text: 'Pode sim. Envie ate sexta no card da atividade.', time: '09:22' },
    ],
  },
  {
    name: 'Elisa Duarte',
    subject: 'Redacao',
    online: true,
    avatar: 'https://i.pravatar.cc/120?img=5',
    messages: [
      { from: 'teacher', text: 'Inclui comentarios no seu rascunho.', time: '11:02' },
      { from: 'student', text: 'Obrigada, vou ajustar a conclusao hoje.', time: '11:06' },
    ],
  },
  {
    name: 'Rafael Brito',
    subject: 'Historia',
    online: false,
    avatar: 'https://i.pravatar.cc/120?img=11',
    messages: [{ from: 'teacher', text: 'Nao esqueca a fonte primaria no trabalho.', time: 'Ontem' }],
  },
  {
    name: 'Nina Salles',
    subject: 'Ingles',
    online: false,
    avatar: 'https://i.pravatar.cc/120?img=20',
    messages: [{ from: 'teacher', text: 'O audio 03 ja esta liberado.', time: 'Seg' }],
  },
]

export const badges = [
  { title: 'Ouro em Logica', level: 'Ouro', tone: 'warning' },
  { title: 'Prata em Redacao', level: 'Prata', tone: 'royal' },
  { title: 'Bronze em Ciencias', level: 'Bronze', tone: 'coral' },
  { title: 'Mentoria Ativa', level: 'Especial', tone: 'success' },
]

export const ranking = [
  { position: 1, name: 'Anna Regina', games: 220, points: 370, avatar: 'https://i.pravatar.cc/120?img=45' },
  { position: 2, name: 'Bruno Moraes', games: 190, points: 330, avatar: 'https://i.pravatar.cc/120?img=18' },
  { position: 3, name: 'Kaique Nunes', games: 168, points: 301, avatar: 'https://i.pravatar.cc/120?img=14' },
  { position: 4, name: 'Karen Matos', games: 150, points: 290, avatar: 'https://i.pravatar.cc/120?img=31' },
  { position: 5, name: 'Lucas Freitas', games: 142, points: 270, avatar: 'https://i.pravatar.cc/120?img=8' },
]

export const games = [
  { title: 'Desafio de Logica', subject: 'Matematica', score: '920 pts', image: image('photo-1516321318423-f06f85e504b3', 500, 300) },
  { title: 'Quiz de Ciencias', subject: 'Quimica', score: '840 pts', image: image('photo-1532094349884-543bc11b234d', 500, 300) },
  { title: 'Aventura de Historia', subject: 'Historia', score: '760 pts', image: image('photo-1461360370896-922624d12aa1', 500, 300) },
  { title: 'Trilha de Ingles', subject: 'Idiomas', score: '710 pts', image: image('photo-1503676260728-1c00da094a0b', 500, 300) },
  { title: 'Fisica em Movimento', subject: 'Fisica', score: '680 pts', image: image('photo-1517976547714-720226b864c1', 500, 300) },
  { title: 'Clube de Redacao', subject: 'Redacao', score: '640 pts', image: image('photo-1455390582262-044cdead277a', 500, 300) },
]

export const attendanceMonthly = [
  { month: 'Jan', presenca: 92, meta: 90 },
  { month: 'Fev', presenca: 94, meta: 90 },
  { month: 'Mar', presenca: 91, meta: 90 },
  { month: 'Abr', presenca: 96, meta: 90 },
  { month: 'Mai', presenca: 98, meta: 90 },
  { month: 'Jun', presenca: 96, meta: 90 },
  { month: 'Jul', presenca: 95, meta: 90 },
  { month: 'Ago', presenca: 97, meta: 90 },
  { month: 'Set', presenca: 96, meta: 90 },
  { month: 'Out', presenca: 98, meta: 90 },
  { month: 'Nov', presenca: 99, meta: 90 },
  { month: 'Dez', presenca: 97, meta: 90 },
]

export const attendanceGrid = Array.from({ length: 60 }, (_, index) => {
  const status = index % 17 === 0 ? 'Atraso' : index % 23 === 0 ? 'Falta' : 'Presenca'
  return { day: index + 1, status }
})

export const exams = [
  { subject: 'Matematica', date: '02/06/2026', time: '08:00', room: 'Sala 12', color: 'coral' },
  { subject: 'Historia', date: '05/06/2026', time: '10:00', room: 'Sala 08', color: 'success' },
  { subject: 'Ingles', date: '09/06/2026', time: '09:00', room: 'Lab 1', color: 'royal' },
  { subject: 'Quimica', date: '12/06/2026', time: '13:30', room: 'Lab 3', color: 'warning' },
]

export const examHistory = [
  { subject: 'Matematica', date: '12/05/2026', result: '8.6' },
  { subject: 'Redacao', date: '15/05/2026', result: '8.2' },
  { subject: 'Historia', date: '20/05/2026', result: '8.8' },
]
