export const roles = {
  student: 'student',
  teacher: 'teacher',
  admin: 'admin',
}

export const roleLabels = {
  student: 'Aluno',
  teacher: 'Professor',
  admin: 'Admin',
}

export const mockProfiles = {
  student: {
    id: '11111111-1111-4111-8111-111111111111',
    fullname: 'Anna Regina',
    email: 'anna.regina@progresso.edu',
    role: 'student',
  },
  teacher: {
    id: '22222222-2222-4222-8222-222222222222',
    fullname: 'Marco Nunes',
    email: 'marco.nunes@progresso.edu',
    role: 'teacher',
  },
  admin: {
    id: '33333333-3333-4333-8333-333333333333',
    fullname: 'Admin Progresso',
    email: 'admin@progresso.edu',
    role: 'admin',
  },
}

export const mockCredentials = {
  student: {
    email: 'anna.regina@progresso.edu',
    password: 'aluno123',
  },
  teacher: {
    email: 'marco.nunes@progresso.edu',
    password: 'professor123',
  },
  admin: {
    email: 'admin@progresso.edu',
    password: 'admin123',
  },
}
