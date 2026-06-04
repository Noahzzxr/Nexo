const image = (id, width = 900, height = 650) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=82`

export const landingImages = {
  hero: image('photo-1562774053-701939374585', 1600, 1000),
  director: image('photo-1551836022-d5d88e9218df', 500, 520),
}

export const schoolValues = [
  {
    title: 'Qualidade',
    text: 'Acompanhamento acadêmico próximo, metas claras e avaliação contínua em cada etapa.',
  },
  {
    title: 'Inovação',
    text: 'Projetos maker, tecnologia em sala de aula e atividades que conectam teoria e prática.',
  },
  {
    title: 'Comunidade',
    text: 'Famílias, professores e estudantes trabalhando juntos por uma rotina mais acolhedora.',
  },
]

export const testimonials = [
  {
    name: 'Tatiane Rodrigues',
    role: 'Mãe do 8º ano',
    avatar: 'https://i.pravatar.cc/160?img=47',
    text: 'O portal aproximou nossa família da escola. Consigo acompanhar entregas, notas e recados sem perder nenhum prazo importante.',
  },
  {
    name: 'Nora Reis',
    role: 'Mãe do Ensino Médio',
    avatar: 'https://i.pravatar.cc/160?img=32',
    text: 'As mensagens dos professores são objetivas e o calendário deixa a semana muito mais previsível para os estudos em casa.',
  },
  {
    name: 'Julio Pinheiro',
    role: 'Responsável',
    avatar: 'https://i.pravatar.cc/160?img=12',
    text: 'A escola combina disciplina e cuidado. O ranking dos jogos também motivou bastante a turma do meu filho.',
  },
  {
    name: 'Ana Helena',
    role: 'Mãe do 6º ano',
    avatar: 'https://i.pravatar.cc/160?img=49',
    text: 'Gosto da forma como os projetos aparecem para as famílias. A gente enxerga o crescimento dos alunos além das provas.',
  },
  {
    name: 'Paulo Mendonça',
    role: 'Pai do Fundamental',
    avatar: 'https://i.pravatar.cc/160?img=15',
    text: 'A área logada é simples de usar e trouxe mais autonomia para organizar materiais, atividades e revisões.',
  },
  {
    name: 'Patricia Peres',
    role: 'Mãe do 9º ano',
    avatar: 'https://i.pravatar.cc/160?img=44',
    text: 'Os alertas sobre notas e faltas ajudam a agir cedo. É uma escola que comunica bem e acompanha de verdade.',
  },
]

export const highlightPhotos = [
  {
    title: 'Destaques do Semestre',
    subtitle: 'Alunos reconhecidos por colaboração e desempenho',
    image: image('photo-1523580846011-d3a5bc25702b', 700, 460),
  },
  {
    title: 'Projeto de Ciências',
    subtitle: 'Experimentos apresentados na mostra escolar',
    image: image('photo-1509062522246-3755977927d7', 700, 460),
  },
  {
    title: 'Equipe de Debate',
    subtitle: 'Preparação para campeonato regional',
    image: image('photo-1517486808906-6ca8b3f04846', 700, 460),
  },
]

export const schoolProjects = [
  {
    title: 'Robótica Avançada',
    text: 'Desafios semanais com sensores, programação e apresentações em grupo.',
    image: image('photo-1517976547714-720226b864c1', 600, 420),
  },
  {
    title: 'Horta Comunitária',
    text: 'Cuidado com canteiros, ciências naturais e sustentabilidade na prática.',
    image: image('photo-1466692476868-aef1dfb1e735', 600, 420),
  },
  {
    title: 'Clube de Debates',
    text: 'Oratória, pesquisa e argumentação para fortalecer o pensamento crítico.',
    image: image('photo-1551836022-d5d88e9218df', 600, 420),
  },
  {
    title: 'Laboratório Criativo',
    text: 'Protótipos, artes visuais e resolução de problemas com metodologia maker.',
    image: image('photo-1581090464777-f3220bbe1b8b', 600, 420),
  },
]

export const courses = [
  {
    title: 'Infantil',
    label: 'Programação para Crianças',
    image: image('photo-1503676260728-1c00da094a0b', 500, 360),
  },
  {
    title: 'Fundamental',
    label: 'Ensino Fundamental Integral',
    image: image('photo-1513475382585-d06e58bcb0e0', 500, 360),
  },
  {
    title: 'Médio',
    label: 'Ensino Médio e Pré-Vestibular',
    image: image('photo-1520523839897-bd0b52f945a0', 500, 360),
  },
  {
    title: 'Fundamental',
    label: 'Robótica',
    image: image('photo-1581090464777-f3220bbe1b8b', 500, 360),
  },
  {
    title: 'Médio',
    label: 'Idiomas',
    image: image('photo-1509062522246-3755977927d7', 500, 360),
  },
  {
    title: 'Médio',
    label: 'Ciências Aplicadas',
    image: image('photo-1532094349884-543bc11b234d', 500, 360),
  },
]

export const studentProfile = {
  name: 'Anna Regina',
  course: '9º ano B',
  email: 'anna.regina@progresso.edu',
  phone: '(11) 98888-2026',
  registration: 'PG-2026-0914',
  avatar: 'https://i.pravatar.cc/180?img=45',
  guardian: 'Helena Regina',
  shift: 'Matutino',
  attendance: '96%',
}

export const teachers = [
  { name: 'Marco Nunes', subject: 'Matemática', avatar: 'https://i.pravatar.cc/120?img=3' },
  { name: 'Elisa Duarte', subject: 'Redação', avatar: 'https://i.pravatar.cc/120?img=5' },
  { name: 'Rafael Brito', subject: 'História', avatar: 'https://i.pravatar.cc/120?img=11' },
  { name: 'Nina Salles', subject: 'Inglês', avatar: 'https://i.pravatar.cc/120?img=20' },
  { name: 'Pedro Ramos', subject: 'Química', avatar: 'https://i.pravatar.cc/120?img=33' },
]

export const dashboardStats = [
  { label: 'Progresso do Curso', value: '78%', tone: 'coral', detail: '12 aulas concluídas' },
  { label: 'Mensagens Recebidas', value: '24', tone: 'royal', detail: '3 novas hoje' },
  { label: 'Gráficos de Frequência', value: '96%', tone: 'success', detail: 'Presença mensal' },
]

export const todaysClasses = [
  { time: '08:00', title: 'Matemática', teacher: 'Marco Nunes', room: 'Sala 12' },
  { time: '10:00', title: 'Redação', teacher: 'Elisa Duarte', room: 'Lab 2' },
  { time: '13:30', title: 'História', teacher: 'Rafael Brito', room: 'Sala 08' },
]

export const pendingTasks = [
  { title: 'Lista de Álgebra', subject: 'Matemática', status: 'Pendente', due: '04/06/2026' },
  { title: 'Resenha literária', subject: 'Redação', status: 'Atrasado', due: '01/06/2026' },
  { title: 'Mapa mental', subject: 'História', status: 'Pendente', due: '06/06/2026' },
]

export const recentMessages = [
  {
    from: 'Marco Nunes',
    preview: 'Revise os exercícios 8 a 12 antes da aula.',
    avatar: 'https://i.pravatar.cc/100?img=3',
  },
  {
    from: 'Elisa Duarte',
    preview: 'Sua introdução ficou mais forte nesta versão.',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    from: 'Nina Salles',
    preview: 'Novo áudio liberado para treino de listening.',
    avatar: 'https://i.pravatar.cc/100?img=20',
  },
]

export const subjects = [
  { name: 'Matemática', p1: 7.5, p2: 8.1, p3: 8.6, average: 8.0, absences: 2 },
  { name: 'Redação', p1: 6.8, p2: 7.4, p3: 8.2, average: 7.5, absences: 1 },
  { name: 'História', p1: 8.2, p2: 8.0, p3: 8.8, average: 8.3, absences: 0 },
  { name: 'Inglês', p1: 5.9, p2: 7.1, p3: 7.8, average: 7.0, absences: 3 },
  { name: 'Química', p1: 7.2, p2: 7.0, p3: 7.6, average: 7.3, absences: 2 },
  { name: 'Física', p1: 6.1, p2: 6.7, p3: 7.5, average: 6.8, absences: 4 },
]

export const gradeHistory = [
  { period: '1º Período', Matemática: 7.5, Redação: 6.8, História: 8.2, Inglês: 5.9 },
  { period: '2º Período', Matemática: 8.1, Redação: 7.4, História: 8.0, Inglês: 7.1 },
  { period: '3º Período', Matemática: 8.6, Redação: 8.2, História: 8.8, Inglês: 7.8 },
  { period: 'Simulado', Matemática: 8.9, Redação: 8.0, História: 9.0, Inglês: 8.1 },
]

export const activities = [
  {
    id: 'aaaaaaaa-0001-4000-8000-000000000001',
    classId: '99999999-0001-4000-8000-000000000001',
    subjectId: '88888888-0001-4000-8000-000000000001',
    course: 'Matemática',
    name: 'Equações do segundo grau',
    due: '06/06/2026',
    status: 'Pendente',
  },
  {
    id: 'aaaaaaaa-0002-4000-8000-000000000002',
    classId: '99999999-0001-4000-8000-000000000002',
    subjectId: '88888888-0004-4000-8000-000000000004',
    course: 'Inglês',
    name: 'Listening checkpoint',
    due: '07/06/2026',
    status: 'Concluído',
  },
  {
    id: 'aaaaaaaa-0003-4000-8000-000000000003',
    classId: '99999999-0001-4000-8000-000000000001',
    subjectId: '88888888-0003-4000-8000-000000000003',
    course: 'História',
    name: 'Linha do tempo republicana',
    due: '31/05/2026',
    status: 'Atrasado',
  },
  {
    id: 'aaaaaaaa-0004-4000-8000-000000000004',
    classId: '99999999-0001-4000-8000-000000000001',
    subjectId: '88888888-0005-4000-8000-000000000005',
    course: 'Química',
    name: 'Relatório de soluções',
    due: '10/06/2026',
    status: 'Pendente',
  },
  {
    id: 'aaaaaaaa-0005-4000-8000-000000000005',
    classId: '99999999-0001-4000-8000-000000000001',
    subjectId: '88888888-0002-4000-8000-000000000002',
    course: 'Redação',
    name: 'Texto dissertativo',
    due: '11/06/2026',
    status: 'Concluído',
  },
  {
    id: 'aaaaaaaa-0006-4000-8000-000000000006',
    classId: '99999999-0001-4000-8000-000000000001',
    subjectId: '88888888-0006-4000-8000-000000000006',
    course: 'Física',
    name: 'Lista de cinemática',
    due: '12/06/2026',
    status: 'Pendente',
  },
]

export const materials = [
  { title: 'Apostila de Álgebra', subject: 'Matemática', type: 'PDF', size: '8.2 MB', updated: '28/05/2026' },
  { title: 'Mapa do Brasil Republicano', subject: 'História', type: 'PDF', size: '4.4 MB', updated: '29/05/2026' },
  { title: 'Guia de Redação Fundamental/Médio', subject: 'Redação', type: 'PDF', size: '6.1 MB', updated: '30/05/2026' },
  { title: 'Listening Pack 03', subject: 'Inglês', type: 'Áudio', size: '22 MB', updated: '31/05/2026' },
  { title: 'Resumo de Ligações Químicas', subject: 'Química', type: 'PDF', size: '3.8 MB', updated: '01/06/2026' },
  { title: 'Simulado Comentado', subject: 'Física', type: 'PDF', size: '9.7 MB', updated: '02/06/2026' },
]

export const postedMaterials = [
  {
    id: 'bbbbbbbb-0001-4000-8000-000000000001',
    class_id: '99999999-0001-4000-8000-000000000001',
    created_at: '2026-06-02T12:00:00.000Z',
    description: 'Lista comentada de funções quadráticas para revisar antes da avaliação.',
    file_attachment_url: null,
    subject_id: '88888888-0001-4000-8000-000000000001',
    teacher_id: '22222222-2222-4222-8222-222222222222',
    title: 'Revisão de Matemática',
  },
  {
    id: 'bbbbbbbb-0002-4000-8000-000000000002',
    class_id: '99999999-0001-4000-8000-000000000001',
    created_at: '2026-06-01T16:00:00.000Z',
    description: 'Roteiro de leitura e perguntas orientadoras sobre Brasil Republicano.',
    file_attachment_url: null,
    subject_id: '88888888-0003-4000-8000-000000000003',
    teacher_id: '22222222-2222-4222-8222-222222222222',
    title: 'Roteiro de História',
  },
]

export const calendarEvents = [
  { day: 2, title: 'Prova de Matemática', type: 'Prova', time: '08:00' },
  { day: 4, title: 'Entrega de Redação', type: 'Atividade', time: '10:00' },
  { day: 6, title: 'Mostra de Ciências', type: 'Evento', time: '09:30' },
  { day: 10, title: 'Simulado Integrado', type: 'Prova', time: '07:30' },
  { day: 13, title: 'Campeonato de Jogos', type: 'Evento', time: '14:00' },
  { day: 18, title: 'Relatório de Química', type: 'Atividade', time: '12:00' },
  { day: 22, title: 'Prova de Inglês', type: 'Prova', time: '10:30' },
  { day: 25, title: 'Reunião de Projeto', type: 'Evento', time: '15:00' },
]

export const conversations = [
  {
    name: 'Marco Nunes',
    subject: 'Matemática',
    online: true,
    avatar: 'https://i.pravatar.cc/120?img=3',
    messages: [
      { from: 'teacher', text: 'Anna, sua resolução do desafio ficou muito boa.', time: '09:12' },
      { from: 'student', text: 'Professor, posso refazer a questão 4 para melhorar a nota?', time: '09:20' },
      { from: 'teacher', text: 'Pode sim. Envie até sexta no card da atividade.', time: '09:22' },
    ],
  },
  {
    name: 'Elisa Duarte',
    subject: 'Redação',
    online: true,
    avatar: 'https://i.pravatar.cc/120?img=5',
    messages: [
      { from: 'teacher', text: 'Incluí comentários no seu rascunho.', time: '11:02' },
      { from: 'student', text: 'Obrigada, vou ajustar a conclusão hoje.', time: '11:06' },
    ],
  },
  {
    name: 'Rafael Brito',
    subject: 'História',
    online: false,
    avatar: 'https://i.pravatar.cc/120?img=11',
    messages: [{ from: 'teacher', text: 'Não esqueça a fonte primária no trabalho.', time: 'Ontem' }],
  },
  {
    name: 'Nina Salles',
    subject: 'Inglês',
    online: false,
    avatar: 'https://i.pravatar.cc/120?img=20',
    messages: [{ from: 'teacher', text: 'O áudio 03 já está liberado.', time: 'Seg' }],
  },
]

export const badges = [
  { title: 'Ouro em Lógica', level: 'Ouro', tone: 'warning' },
  { title: 'Prata em Redação', level: 'Prata', tone: 'royal' },
  { title: 'Bronze em Ciências', level: 'Bronze', tone: 'coral' },
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
  { id: 'quiz-matematica', title: 'Desafio de Lógica', subject: 'Matemática', score: '920 pts', image: image('photo-1516321318423-f06f85e504b3', 500, 300) },
  { id: 'quiz-quimica', title: 'Quiz de Ciências', subject: 'Química', score: '840 pts', image: image('photo-1532094349884-543bc11b234d', 500, 300) },
  { id: 'quiz-historia', title: 'Aventura de História', subject: 'História', score: '760 pts', image: image('photo-1461360370896-922624d12aa1', 500, 300) },
  { id: 'quiz-ingles', title: 'Trilha de Inglês', subject: 'Idiomas', score: '710 pts', image: image('photo-1503676260728-1c00da094a0b', 500, 300) },
  { id: 'quiz-fisica', title: 'Física em Movimento', subject: 'Física', score: '680 pts', image: image('photo-1517976547714-720226b864c1', 500, 300) },
  { id: 'quiz-redacao', title: 'Clube de Redação', subject: 'Redação', score: '640 pts', image: image('photo-1455390582262-044cdead277a', 500, 300) },
]

export const quizzes = [
  {
    id: 'quiz-matematica',
    subject_id: '88888888-0001-4000-8000-000000000001',
    title: 'Quiz de Matemática',
    questions: [
      {
        id: 'q-mat-1',
        question_text: 'Qual é o resultado de 3x + 5 = 20?',
        options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
        correct_option: 1,
      },
      {
        id: 'q-mat-2',
        question_text: 'Em uma função quadrática, o gráfico recebe o nome de:',
        options: ['Reta', 'Parábola', 'Circunferência', 'Tangente'],
        correct_option: 1,
      },
      {
        id: 'q-mat-3',
        question_text: 'Quanto é 12% de 200?',
        options: ['12', '18', '24', '32'],
        correct_option: 2,
      },
    ],
  },
  {
    id: 'quiz-quimica',
    subject_id: '88888888-0005-4000-8000-000000000005',
    title: 'Quiz de Química',
    questions: [
      {
        id: 'q-qui-1',
        question_text: 'Qual partícula possui carga negativa?',
        options: ['Próton', 'Nêutron', 'Elétron', 'Núcleo'],
        correct_option: 2,
      },
      {
        id: 'q-qui-2',
        question_text: 'A água é representada por:',
        options: ['CO2', 'H2O', 'NaCl', 'O2'],
        correct_option: 1,
      },
    ],
  },
  {
    id: 'quiz-historia',
    subject_id: '88888888-0003-4000-8000-000000000003',
    title: 'Quiz de História',
    questions: [
      {
        id: 'q-his-1',
        question_text: 'A Proclamação da República no Brasil aconteceu em:',
        options: ['1822', '1888', '1889', '1930'],
        correct_option: 2,
      },
      {
        id: 'q-his-2',
        question_text: 'Qual período veio logo após o Império no Brasil?',
        options: ['República Velha', 'Estado Novo', 'Regência', 'Nova República'],
        correct_option: 0,
      },
    ],
  },
  {
    id: 'quiz-ingles',
    subject_id: '88888888-0004-4000-8000-000000000004',
    title: 'Quiz de Inglês',
    questions: [
      {
        id: 'q-ing-1',
        question_text: 'Qual alternativa traduz "school"?',
        options: ['Livro', 'Escola', 'Casa', 'Janela'],
        correct_option: 1,
      },
      {
        id: 'q-ing-2',
        question_text: 'Complete: I ___ studying now.',
        options: ['am', 'is', 'are', 'be'],
        correct_option: 0,
      },
    ],
  },
  {
    id: 'quiz-fisica',
    subject_id: '88888888-0006-4000-8000-000000000006',
    title: 'Quiz de Física',
    questions: [
      {
        id: 'q-fis-1',
        question_text: 'A unidade de velocidade no SI é:',
        options: ['m/s', 'kg', 'N', 'J'],
        correct_option: 0,
      },
      {
        id: 'q-fis-2',
        question_text: 'Força é massa vezes:',
        options: ['Tempo', 'Aceleração', 'Distância', 'Volume'],
        correct_option: 1,
      },
    ],
  },
  {
    id: 'quiz-redacao',
    subject_id: '88888888-0002-4000-8000-000000000002',
    title: 'Quiz de Redação',
    questions: [
      {
        id: 'q-red-1',
        question_text: 'A tese de um texto dissertativo apresenta:',
        options: ['A conclusão final', 'O ponto de vista defendido', 'A bibliografia', 'A citação direta'],
        correct_option: 1,
      },
      {
        id: 'q-red-2',
        question_text: 'Conectivos ajudam principalmente na:',
        options: ['Coesão', 'Pontuação estética', 'Contagem de linhas', 'Capa do texto'],
        correct_option: 0,
      },
    ],
  },
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
  { subject: 'Matemática', date: '02/06/2026', time: '08:00', room: 'Sala 12', color: 'coral' },
  { subject: 'História', date: '05/06/2026', time: '10:00', room: 'Sala 08', color: 'success' },
  { subject: 'Inglês', date: '09/06/2026', time: '09:00', room: 'Lab 1', color: 'royal' },
  { subject: 'Química', date: '12/06/2026', time: '13:30', room: 'Lab 3', color: 'warning' },
]

export const examHistory = [
  { subject: 'Matemática', date: '12/05/2026', result: '8.6' },
  { subject: 'Redação', date: '15/05/2026', result: '8.2' },
  { subject: 'História', date: '20/05/2026', result: '8.8' },
]

export const schoolClasses = [
  { id: '99999999-0001-4000-8000-000000000001', name: '9º ano B', school_year: '2026' },
  { id: '99999999-0002-4000-8000-000000000002', name: '8º ano A', school_year: '2026' },
  { id: '99999999-0003-4000-8000-000000000003', name: '2º Médio B', school_year: '2026' },
]

export const subjectsCatalog = [
  { id: '88888888-0001-4000-8000-000000000001', name: 'Matemática' },
  { id: '88888888-0002-4000-8000-000000000002', name: 'Redação' },
  { id: '88888888-0003-4000-8000-000000000003', name: 'História' },
  { id: '88888888-0004-4000-8000-000000000004', name: 'Inglês' },
  { id: '88888888-0005-4000-8000-000000000005', name: 'Química' },
  { id: '88888888-0006-4000-8000-000000000006', name: 'Física' },
]

export const adminUsers = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    fullname: 'Anna Regina',
    email: 'anna.regina@progresso.edu',
    role: 'aluno',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    fullname: 'Marco Nunes',
    email: 'marco.nunes@progresso.edu',
    role: 'professor',
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    fullname: 'Elisa Duarte',
    email: 'elisa.duarte@progresso.edu',
    role: 'professor',
  },
]

export const inscriptionLeads = [
  {
    id: '77777777-0001-4000-8000-000000000001',
    full_name: 'Lívia Carvalho',
    email: 'livia.carvalho@email.com',
    cpf: '123.456.789-00',
    desired_course: 'Fundamental',
    status: 'pending',
  },
  {
    id: '77777777-0002-4000-8000-000000000002',
    full_name: 'Caio Fernandes',
    email: 'caio.fernandes@email.com',
    cpf: '987.654.321-00',
    desired_course: 'Médio',
    status: 'pending',
  },
]