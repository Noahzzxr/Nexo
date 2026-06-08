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
    quizzesResult,
    questionsResult,
    quizAttemptsResult,
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
    supabase.from('quizzes').select('*').order('title'),
    supabase.from('quiz_questions').select('*').order('created_at'),
    supabase.from('quiz_attempts').select('*').order('completed_at', { ascending: false }),
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
    quizzesResult,
    questionsResult,
    quizAttemptsResult,
  ]

  const firstError = results.find((result) => result.error)?.error
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
    messages: messagesResult.data || [],
    profiles,
    quizAttempts: quizAttemptsResult.data || [],
    quizzes,
    subjects,
    submissions,
    teacherSubjects,
    students: orderByName(profiles.filter((profile) => profile.role === 'student')),
    teachers: orderByName(profiles.filter((profile) => profile.role === 'teacher')),
  }
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
