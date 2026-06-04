export const roles = {
  student: 'aluno',
  teacher: 'professor',
  admin: 'admin',
}

export const roleLabels = {
  aluno: 'Aluno',
  professor: 'Professor',
  admin: 'Admin',
}

export const mockProfiles = {
  aluno: {
    id: '11111111-1111-4111-8111-111111111111',
    fullname: 'Anna Regina',
    email: 'anna.regina@progresso.edu',
    role: 'aluno',
    points: 370,
    xp: 370,
    level: 4,
  },
  professor: {
    id: '22222222-2222-4222-8222-222222222222',
    fullname: 'Marco Nunes',
    email: 'marco.nunes@progresso.edu',
    role: 'professor',
  },
  admin: {
    id: '33333333-3333-4333-8333-333333333333',
    fullname: 'Admin Progresso',
    email: 'admin@progresso.edu',
    role: 'admin',
  },
}

export const mockCredentials = {
  aluno: {
    email: 'anna.regina@progresso.edu',
    password: 'aluno123',
  },
  professor: {
    email: 'marco.nunes@progresso.edu',
    password: 'professor123',
  },
  admin: {
    email: 'admin@progresso.edu',
    password: 'admin123',
  },
}