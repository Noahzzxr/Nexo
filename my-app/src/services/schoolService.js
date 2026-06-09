import { schoolBucket, supabase } from '../lib/supabase'

const makeId = () => crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`

const cleanFileName = (name) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]+/g, '-')
    .toLowerCase()

const requireDatabase = () => {
  if (!supabase) {
    throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar o sistema.')
  }
}

const orderByName = (rows) => [...(rows || [])].sort((a, b) => (a.name || a.fullname || '').localeCompare(b.name || b.fullname || ''))
const isMissingAvailabilityTableError = (error) =>
  error?.code === 'PGRST205' ||
  error?.message?.toLowerCase?.().includes("could not find the table 'public.professor_disponibilidade'") ||
  error?.message?.toLowerCase?.().includes('professor_disponibilidade')

const timeToMinutes = (value) => {
  const [hours, minutes] = String(value || '').split(':').map(Number)
  return hours * 60 + minutes
}

const overlapsAvailability = (current, next) =>
  current.professor_id === next.professor_id &&
  current.dia_semana === next.dia_semana &&
  current.id !== next.id &&
  timeToMinutes(next.horario_inicio) < timeToMinutes(current.horario_fim) &&
  timeToMinutes(next.horario_fim) > timeToMinutes(current.horario_inicio)

const validateAvailabilityPayload = ({ dia_semana, horario_fim, horario_inicio, professor_id }) => {
  if (!professor_id) throw new Error('Professor obrigatorio.')
  if (!dia_semana) throw new Error('Dia da semana obrigatorio.')
  if (!horario_inicio) throw new Error('Horario de inicio obrigatorio.')
  if (!horario_fim) throw new Error('Horario de termino obrigatorio.')
  if (timeToMinutes(horario_fim) <= timeToMinutes(horario_inicio)) {
    throw new Error('Horario de termino deve ser maior que o horario de inicio.')
  }
}

export async function uploadAttachment(file, folder = 'attachments') {
  requireDatabase()
  if (!file) return { path: null, publicUrl: null }

  const path = `${folder}/${Date.now()}-${cleanFileName(file.name)}`
  const { error } = await supabase.storage.from(schoolBucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from(schoolBucket).getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export async function fetchProfile(userId) {
  requireDatabase()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Perfil nao encontrado no banco de dados.')
  return data
}

export async function fetchSchoolData(currentUser) {
  requireDatabase()

  const isAdmin = currentUser.role === 'admin'
  const isTeacher = currentUser.role === 'teacher'

  const [
    profilesResult,
    classesResult,
    subjectsResult,
    enrollmentsResult,
    teacherSubjectsResult,
    assignmentsResult,
    submissionsResult,
    gradesResult,
    attendanceResult,
    eventsResult,
    materialsResult,
    messagesResult,
    messageReactionsResult,
    quizzesResult,
    questionsResult,
    quizAttemptsResult,
    availabilityResult,
  ] = await Promise.all([
    supabase.from('profiles').select('*').order('fullname'),
    supabase.from('classes').select('*').order('name'),
    supabase.from('subjects').select('*').order('name'),
    supabase.from('enrollments').select('*'),
    supabase.from('teacher_subjects').select('*'),
    supabase.from('assignments').select('*').order('created_at', { ascending: false }),
    supabase.from('student_submissions').select('*').order('submitted_at', { ascending: false }),
    supabase.from('grades').select('*'),
    supabase.from('attendance_records').select('*').order('month_label'),
    supabase.from('calendar_events').select('*').order('start_date'),
    supabase.from('posted_materials').select('*').order('created_at', { ascending: false }),
    supabase.from('messages').select('*').order('created_at', { ascending: true }),
    supabase.from('message_reactions').select('*').order('created_at', { ascending: true }),
    supabase.from('quizzes').select('*').order('title'),
    supabase.from('quiz_questions').select('*').order('created_at'),
    supabase.from('quiz_attempts').select('*').order('completed_at', { ascending: false }),
    isAdmin ? supabase.from('professor_disponibilidade').select('*').order('dia_semana').order('horario_inicio') : Promise.resolve({ data: [], error: null }),
  ])

  const results = [
    profilesResult,
    classesResult,
    subjectsResult,
    enrollmentsResult,
    teacherSubjectsResult,
    assignmentsResult,
    submissionsResult,
    gradesResult,
    attendanceResult,
    eventsResult,
    materialsResult,
    messagesResult,
    messageReactionsResult,
    quizzesResult,
    questionsResult,
    quizAttemptsResult,
    availabilityResult,
  ]

  const firstError = results.find((result) => result.error && !isMissingAvailabilityTableError(result.error))?.error
  if (firstError) throw firstError

  const profiles = profilesResult.data || []
  const classes = classesResult.data || []
  const subjects = subjectsResult.data || []
  const enrollments = enrollmentsResult.data || []
  const teacherSubjects = teacherSubjectsResult.data || []
  const submissions = submissionsResult.data || []

  const currentEnrollment = enrollments.find((item) => item.student_id === currentUser.id)
  const visibleClassIds = isAdmin
    ? classes.map((item) => item.id)
    : isTeacher
    ? teacherSubjects.filter((item) => item.teacher_id === currentUser.id).map((item) => item.class_id)
    : currentEnrollment
    ? [currentEnrollment.class_id]
    : []

  const assignments = (assignmentsResult.data || []).filter((item) => isAdmin || isTeacher || visibleClassIds.includes(item.class_id))
  const grades = (gradesResult.data || []).filter((item) => isAdmin || isTeacher || item.student_id === currentUser.id)
  const attendance = (attendanceResult.data || []).filter((item) => isAdmin || isTeacher || item.student_id === currentUser.id)
  const materials = (materialsResult.data || []).filter((item) => isAdmin || isTeacher || visibleClassIds.includes(item.class_id))
  const quizzes = (quizzesResult.data || []).map((quiz) => ({
    ...quiz,
    questions: (questionsResult.data || []).filter((question) => question.quiz_id === quiz.id),
  }))

  return {
    assignments,
    attendance,
    calendarEvents: eventsResult.data || [],
    classes,
    currentEnrollment,
    enrollments,
    grades,
    materials,
    messageReactions: messageReactionsResult.data || [],
    messages: messagesResult.data || [],
    profiles,
    quizAttempts: quizAttemptsResult.data || [],
    quizzes,
    professorAvailability: isMissingAvailabilityTableError(availabilityResult.error) ? [] : availabilityResult.data || [],
    subjects,
    submissions,
    teacherSubjects,
    students: orderByName(profiles.filter((profile) => profile.role === 'student')),
    teachers: orderByName(profiles.filter((profile) => profile.role === 'teacher')),
  }
}

export function getAdminDashboardData(schoolData) {
  const students = schoolData.profiles.filter((profile) => profile.role === 'student')
  const teachers = schoolData.profiles.filter((profile) => profile.role === 'teacher')
  const grades = schoolData.grades.filter((grade) => Number.isFinite(Number(grade.final_grade)))
  const average = (rows) => {
    if (!rows.length) return null
    return rows.reduce((sum, row) => sum + Number(row.final_grade || 0), 0) / rows.length
  }

  const averageByClass = schoolData.classes.map((classItem) => ({
    id: classItem.id,
    name: classItem.name,
    average: average(grades.filter((grade) => grade.class_id === classItem.id)),
  }))

  const averageBySubject = schoolData.subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    average: average(grades.filter((grade) => grade.subject_id === subject.id)),
  }))

  const recentProfiles = [...schoolData.profiles]
    .filter((profile) => profile.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return {
    averageByClass,
    averageBySubject,
    generalAverage: average(grades),
    recentProfiles,
    totals: {
      assignments: schoolData.assignments.length,
      classes: schoolData.classes.length,
      grades: grades.length,
      students: students.length,
      subjects: schoolData.subjects.length,
      teachers: teachers.length,
      users: schoolData.profiles.length,
    },
  }
}

export function listAdminTeachers(schoolData) {
  return orderByName(schoolData.profiles.filter((profile) => profile.role === 'teacher'))
}

export async function fetchProfessorAvailability(professorId) {
  requireDatabase()
  if (!professorId) return []
  const { data, error } = await supabase
    .from('professor_disponibilidade')
    .select('*')
    .eq('professor_id', professorId)
    .order('dia_semana')
    .order('horario_inicio')
  if (isMissingAvailabilityTableError(error)) {
    throw new Error('A tabela professor_disponibilidade ainda nao esta disponivel neste projeto Supabase. Rode o school_schema.sql no projeto configurado no .env e recarregue o schema cache.')
  }
  if (error) throw error
  return data || []
}

export async function createProfessorAvailability(payload, currentRows = []) {
  requireDatabase()
  validateAvailabilityPayload(payload)
  if (currentRows.some((row) => overlapsAvailability(row, payload))) {
    throw new Error('Ja existe disponibilidade conflitante para esse professor nesse dia.')
  }

  const { data, error } = await supabase.from('professor_disponibilidade').insert(payload).select().single()
  if (isMissingAvailabilityTableError(error)) {
    throw new Error('A tabela professor_disponibilidade ainda nao esta disponivel neste projeto Supabase. Rode o school_schema.sql no projeto configurado no .env e recarregue o schema cache.')
  }
  if (error) throw error
  return data
}

export async function updateProfessorAvailability(availabilityId, payload, currentRows = []) {
  requireDatabase()
  validateAvailabilityPayload(payload)
  const nextPayload = { ...payload, id: availabilityId }
  if (currentRows.some((row) => overlapsAvailability(row, nextPayload))) {
    throw new Error('Ja existe disponibilidade conflitante para esse professor nesse dia.')
  }

  const { data, error } = await supabase
    .from('professor_disponibilidade')
    .update({ ...payload, atualizado_em: new Date().toISOString() })
    .eq('id', availabilityId)
    .select()
    .single()
  if (isMissingAvailabilityTableError(error)) {
    throw new Error('A tabela professor_disponibilidade ainda nao esta disponivel neste projeto Supabase. Rode o school_schema.sql no projeto configurado no .env e recarregue o schema cache.')
  }
  if (error) throw error
  return data
}

export async function deleteProfessorAvailability(availabilityId) {
  requireDatabase()
  const { error } = await supabase.from('professor_disponibilidade').delete().eq('id', availabilityId)
  if (isMissingAvailabilityTableError(error)) {
    throw new Error('A tabela professor_disponibilidade ainda nao esta disponivel neste projeto Supabase. Rode o school_schema.sql no projeto configurado no .env e recarregue o schema cache.')
  }
  if (error) throw error
  return true
}

export async function createStudentSubmission({ assignment, file, studentId }) {
  const attachment = await uploadAttachment(file, 'submissions')
  const payload = {
    assignment_id: assignment.id,
    student_id: studentId,
    photo_delivery_url: attachment.publicUrl,
    submitted_at: new Date().toISOString(),
    status: 'completed',
  }

  const { data, error } = await supabase.from('student_submissions').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function createAssignment({ assignment, file }) {
  const attachment = await uploadAttachment(file, 'assignments')
  const payload = {
    class_id: assignment.classId,
    subject_id: assignment.subjectId,
    title: assignment.title,
    description: assignment.description,
    file_attachment_url: attachment.publicUrl,
    due_date: assignment.dueDate,
  }

  const { data, error } = await supabase.from('assignments').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function createPostedMaterial({ file, material }) {
  const attachment = await uploadAttachment(file, 'posted-materials')
  const payload = {
    class_id: material.classId,
    description: material.description,
    file_attachment_url: attachment.publicUrl,
    subject_id: material.subjectId,
    teacher_id: material.teacherId,
    title: material.title,
  }

  const { data, error } = await supabase.from('posted_materials').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function saveGrades(rows) {
  const payload = rows.map((row) => ({
    student_id: row.studentId,
    subject_id: row.subjectId,
    class_id: row.classId,
    note_p1: Number(row.p1),
    note_p2: Number(row.p2),
    note_p3: Number(row.p3),
    final_grade: Number(row.average),
    total_absences: Number(row.absences),
  }))

  const { data, error } = await supabase.from('grades').upsert(payload, { onConflict: 'student_id,subject_id,class_id' }).select()
  if (error) throw error
  return data
}

export async function saveFrequency(rows) {
  const { data, error } = await supabase.from('attendance_records').upsert(rows, { onConflict: 'student_id,class_id,month_label' }).select()
  if (error) throw error
  return data
}

export async function sendMessage({ content, receiverId, senderId }) {
  const payload = {
    content,
    receiver_id: receiverId,
    sender_id: senderId,
  }

  const { data, error } = await supabase.from('messages').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function reactToMessage({ emoji, messageId, studentId }) {
  const payload = {
    emoji,
    message_id: messageId,
    student_id: studentId,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('message_reactions').upsert(payload, { onConflict: 'message_id,student_id' }).select().single()
  if (error) throw error
  return data
}

export async function clearChatMessages(contactId) {
  const { data, error } = await supabase.rpc('clear_chat_messages', { contact_id: contactId })
  if (error) throw error
  return Array.isArray(data) ? data[0] : data
}

export async function createClass(payload) {
  const { data, error } = await supabase.from('classes').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function createSubject(payload) {
  const { data, error } = await supabase.from('subjects').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function assignTeacher(payload) {
  const { data, error } = await supabase.from('teacher_subjects').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function createSchoolAccount(profile) {
  const { data, error } = await supabase.functions.invoke('invite-school-user', {
    body: {
      classId: profile.classId || null,
      cpf: profile.cpf || null,
      email: profile.email,
      fullname: profile.fullname,
      role: profile.role,
    },
  })

  if (error) {
    let message = error.message

    try {
      const responseBody = await error.context?.json?.()
      if (responseBody?.error) message = responseBody.error
    } catch {
      // Keep the original Supabase error when the response body is not JSON.
    }

    throw new Error(message)
  }

  if (data?.error) throw new Error(data.error)
  return data
}

export async function removeProfile(profileId) {
  const { data, error } = await supabase.rpc('remove_school_user', { profile_id: profileId })
  if (error) throw error
  return Array.isArray(data) ? data[0] : data
}

export async function createCalendarEvent(payload) {
  const eventPayload = {
    class_id: payload.class_id || null,
    color: payload.color,
    event_type: payload.event_type,
    start_date: payload.start_date,
    title: payload.title,
  }

  const { data, error } = await supabase.from('calendar_events').insert(eventPayload).select().single()
  if (error) throw error
  return data
}

export async function updateCalendarEvent(eventId, payload) {
  const eventPayload = {
    class_id: payload.class_id || null,
    color: payload.color,
    event_type: payload.event_type,
    start_date: payload.start_date,
    title: payload.title,
  }

  const { data, error } = await supabase.from('calendar_events').update(eventPayload).eq('id', eventId).select().single()
  if (error) throw error
  return data
}

export async function createQuizWithQuestions({ baseXp = 100, questions, subjectId, title }) {
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .insert({ base_xp: Number(baseXp) || 100, subject_id: subjectId, title })
    .select()
    .single()

  if (quizError) throw quizError

  const questionPayload = questions.map((question) => ({
    correct_option: Number(question.correctOption),
    options: question.options,
    question_text: question.text,
    quiz_id: quiz.id,
  }))

  const { data: savedQuestions, error: questionsError } = await supabase.from('quiz_questions').insert(questionPayload).select()
  if (questionsError) throw questionsError

  return { ...quiz, questions: savedQuestions || [] }
}

export async function completeQuizAttempt({ correctAnswers, quizId, totalQuestions }) {
  const { data, error } = await supabase.rpc('complete_quiz_attempt', {
    correct_answers: correctAnswers,
    input_quiz_id: quizId,
    total_questions: totalQuestions,
  })

  if (error) throw error
  return Array.isArray(data) ? data[0] : data
}

export async function updateProfileAvatar({ file, userId }) {
  const attachment = await uploadAttachment(file, 'avatars')
  const { data, error } = await supabase.from('profiles').update({ avatar_url: attachment.publicUrl }).eq('id', userId).select().single()
  if (error) throw error
  return data
}

export async function incrementStudentPoints() {
  return { id: makeId() }
}
