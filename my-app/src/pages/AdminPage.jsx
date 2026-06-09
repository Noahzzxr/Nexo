import { useMemo, useState } from 'react'
import { BarChart3, CalendarClock, Edit3, Link2, PlusCircle, Save, Trash2, UserPlus, Users } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import Modal from '../components/ui/Modal'
import Table from '../components/ui/Table'
import { roles, roleLabels } from '../context/roles'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import {
  assignTeacher,
  createClass,
  createProfessorAvailability,
  createSchoolAccount,
  createSubject,
  deleteProfessorAvailability,
  getAdminDashboardData,
  listAdminTeachers,
  removeProfile,
  updateProfessorAvailability,
} from '../services/schoolService'

const dayOptions = [
  { label: 'Segunda-feira', value: 'segunda' },
  { label: 'Terca-feira', value: 'terca' },
  { label: 'Quarta-feira', value: 'quarta' },
  { label: 'Quinta-feira', value: 'quinta' },
  { label: 'Sexta-feira', value: 'sexta' },
  { label: 'Sabado', value: 'sabado' },
  { label: 'Domingo', value: 'domingo' },
]

const dayLabels = dayOptions.reduce((labels, day) => ({ ...labels, [day.value]: day.label }), {})

const emptyAvailabilityForm = {
  dia_semana: 'segunda',
  horario_fim: '',
  horario_inicio: '',
  id: '',
  professor_id: '',
}

const timeToMinutes = (value) => {
  const [hours, minutes] = String(value || '').split(':').map(Number)
  return hours * 60 + minutes
}

const formatAverage = (value) => (value === null || value === undefined ? '-' : value.toFixed(1))

function AdminPage() {
  const { addToast } = useToast()
  const { isAdmin, refreshSchoolData, schoolData } = useSession()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [createdCredential, setCreatedCredential] = useState(null)
  const [userForm, setUserForm] = useState({ classId: '', cpf: '', email: '', fullname: '', role: roles.student })
  const [classForm, setClassForm] = useState({ name: '', school_year: String(new Date().getFullYear()) })
  const [subjectForm, setSubjectForm] = useState({ name: '' })
  const [linkForm, setLinkForm] = useState({ class_id: '', subject_id: '', teacher_id: '' })
  const [availabilityForm, setAvailabilityForm] = useState(emptyAvailabilityForm)
  const [profileToRemove, setProfileToRemove] = useState(null)
  const [removedProfileIds, setRemovedProfileIds] = useState([])
  const [removingProfileId, setRemovingProfileId] = useState('')
  const [savingAvailability, setSavingAvailability] = useState(false)
  const [deletingAvailabilityId, setDeletingAvailabilityId] = useState('')

  const visibleUsers = schoolData.profiles.filter((user) => !removedProfileIds.includes(user.id))
  const visibleStudents = visibleUsers.filter((user) => user.role === roles.student)
  const visibleTeachers = visibleUsers.filter((user) => user.role === roles.teacher)
  const dashboardData = useMemo(() => getAdminDashboardData({ ...schoolData, profiles: visibleUsers }), [schoolData, visibleUsers])
  const adminTeachers = useMemo(() => listAdminTeachers({ ...schoolData, profiles: visibleUsers }), [schoolData, visibleUsers])

  const classOptions = useMemo(() => schoolData.classes.map((item) => ({ label: item.name, value: item.id })), [schoolData.classes])
  const subjectOptions = useMemo(() => schoolData.subjects.map((item) => ({ label: item.name, value: item.id })), [schoolData.subjects])
  const teacherOptions = useMemo(() => adminTeachers.map((item) => ({ label: item.fullname, value: item.id })), [adminTeachers])
  const availabilityRows = useMemo(
    () => schoolData.professorAvailability.filter((item) => item.professor_id === availabilityForm.professor_id),
    [availabilityForm.professor_id, schoolData.professorAvailability],
  )

  if (!isAdmin) {
    return (
      <Card>
        <p className="text-sm font-black uppercase text-alert-coral">Acesso restrito</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Ferramentas administrativas</h1>
        <p className="mt-3 text-slate-700">Entre com uma conta administradora para criar alunos, professores, turmas e disciplinas.</p>
      </Card>
    )
  }

  const validateAvailabilityForm = () => {
    if (!availabilityForm.professor_id) throw new Error('Professor obrigatorio.')
    if (!availabilityForm.dia_semana) throw new Error('Dia da semana obrigatorio.')
    if (!availabilityForm.horario_inicio) throw new Error('Horario de inicio obrigatorio.')
    if (!availabilityForm.horario_fim) throw new Error('Horario de termino obrigatorio.')
    if (timeToMinutes(availabilityForm.horario_fim) <= timeToMinutes(availabilityForm.horario_inicio)) {
      throw new Error('Horario de termino deve ser maior que o horario de inicio.')
    }
  }

  const handleAddUser = async (event) => {
    event.preventDefault()

    try {
      const created = await createSchoolAccount(userForm)
      setCreatedCredential(created)
      setUserForm({ classId: '', cpf: '', email: '', fullname: '', role: roles.student })
      await refreshSchoolData()
      addToast({ title: 'Convite enviado', message: `${created.fullname} recebeu o convite por e-mail.` })
    } catch (error) {
      addToast({ title: 'Erro ao criar conta', message: error.message })
    }
  }

  const handleRemoveUser = async () => {
    if (!profileToRemove) return

    setRemovingProfileId(profileToRemove.id)

    try {
      await removeProfile(profileToRemove.id)
      setRemovedProfileIds((current) => (current.includes(profileToRemove.id) ? current : [...current, profileToRemove.id]))
      setProfileToRemove(null)
      await refreshSchoolData()
      setRemovedProfileIds((current) => current.filter((id) => id !== profileToRemove.id))
      addToast({ title: 'Usuario removido', message: `${profileToRemove.fullname} foi removido.` })
    } catch (error) {
      addToast({ title: 'Erro ao remover usuario', message: error.message })
    } finally {
      setRemovingProfileId('')
    }
  }

  const handleCreateClass = async (event) => {
    event.preventDefault()
    try {
      await createClass(classForm)
      setClassForm({ name: '', school_year: String(new Date().getFullYear()) })
      await refreshSchoolData()
      addToast({ title: 'Turma criada', message: 'Turma salva no banco.' })
    } catch (error) {
      addToast({ title: 'Erro ao criar turma', message: error.message })
    }
  }

  const handleCreateSubject = async (event) => {
    event.preventDefault()
    try {
      await createSubject(subjectForm)
      setSubjectForm({ name: '' })
      await refreshSchoolData()
      addToast({ title: 'Disciplina criada', message: 'Disciplina salva no banco.' })
    } catch (error) {
      addToast({ title: 'Erro ao criar disciplina', message: error.message })
    }
  }

  const handleAssignTeacher = async (event) => {
    event.preventDefault()
    try {
      await assignTeacher(linkForm)
      setLinkForm({ class_id: '', subject_id: '', teacher_id: '' })
      await refreshSchoolData()
      addToast({ title: 'Vinculo criado', message: 'Professor, turma e disciplina vinculados.' })
    } catch (error) {
      addToast({ title: 'Erro ao criar vinculo', message: error.message })
    }
  }

  const handleSaveAvailability = async (event) => {
    event.preventDefault()
    setSavingAvailability(true)

    try {
      validateAvailabilityForm()
      const payload = {
        dia_semana: availabilityForm.dia_semana,
        horario_fim: availabilityForm.horario_fim,
        horario_inicio: availabilityForm.horario_inicio,
        professor_id: availabilityForm.professor_id,
      }

      if (availabilityForm.id) {
        await updateProfessorAvailability(availabilityForm.id, payload, schoolData.professorAvailability)
      } else {
        await createProfessorAvailability(payload, schoolData.professorAvailability)
      }

      await refreshSchoolData()
      setAvailabilityForm((current) => ({ ...emptyAvailabilityForm, professor_id: current.professor_id }))
      addToast({ title: 'Disponibilidade salva', message: 'Horario atualizado no banco.' })
    } catch (error) {
      addToast({ title: 'Erro na disponibilidade', message: error.message })
    } finally {
      setSavingAvailability(false)
    }
  }

  const handleEditAvailability = (row) => {
    setAvailabilityForm({
      dia_semana: row.dia_semana,
      horario_fim: row.horario_fim?.slice(0, 5) || '',
      horario_inicio: row.horario_inicio?.slice(0, 5) || '',
      id: row.id,
      professor_id: row.professor_id,
    })
  }

  const handleDeleteAvailability = async (row) => {
    setDeletingAvailabilityId(row.id)
    try {
      await deleteProfessorAvailability(row.id)
      await refreshSchoolData()
      addToast({ title: 'Disponibilidade removida', message: 'Horario excluido do banco.' })
      if (availabilityForm.id === row.id) {
        setAvailabilityForm((current) => ({ ...emptyAvailabilityForm, professor_id: current.professor_id }))
      }
    } catch (error) {
      addToast({ title: 'Erro ao excluir', message: error.message })
    } finally {
      setDeletingAvailabilityId('')
    }
  }

  const sectionButtonClass = (section) => (activeSection === section ? 'royal' : 'ghost')

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Administrador</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Painel de Controle</h1>
        <p className="mt-2 text-muted">Gestao escolar, indicadores e disponibilidade de professores usando dados do banco.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button icon={BarChart3} onClick={() => setActiveSection('dashboard')} variant={sectionButtonClass('dashboard')}>Dashboard</Button>
        <Button icon={CalendarClock} onClick={() => setActiveSection('availability')} variant={sectionButtonClass('availability')}>Disponibilidade dos Professores</Button>
        <Button icon={Users} onClick={() => setActiveSection('management')} variant={sectionButtonClass('management')}>Gestao</Button>
      </div>

      {activeSection === 'dashboard' ? (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card><p className="text-sm font-black uppercase text-muted">Alunos</p><p className="mt-2 text-4xl font-black text-brand-ink">{dashboardData.totals.students}</p></Card>
            <Card><p className="text-sm font-black uppercase text-muted">Professores</p><p className="mt-2 text-4xl font-black text-brand-ink">{dashboardData.totals.teachers}</p></Card>
            <Card><p className="text-sm font-black uppercase text-muted">Turmas</p><p className="mt-2 text-4xl font-black text-brand-ink">{dashboardData.totals.classes}</p></Card>
            <Card><p className="text-sm font-black uppercase text-muted">Disciplinas</p><p className="mt-2 text-4xl font-black text-brand-ink">{dashboardData.totals.subjects}</p></Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
            <Card>
              <p className="text-sm font-black uppercase text-alert-coral">Media geral</p>
              <p className="mt-3 text-5xl font-black text-brand-ink">{formatAverage(dashboardData.generalAverage)}</p>
              <p className="mt-2 text-sm text-muted">{dashboardData.totals.grades} notas registradas no banco.</p>
            </Card>

            <Card>
              <p className="text-sm font-black uppercase text-alert-coral">Cadastros recentes</p>
              <Table className="mt-4" columns={['Nome', 'Perfil', 'E-mail']}>
                {dashboardData.recentProfiles.length ? dashboardData.recentProfiles.map((profile) => (
                  <tr className="bg-white even:bg-slate-50" key={profile.id}>
                    <td className="px-4 py-4 font-black text-brand-ink">{profile.fullname}</td>
                    <td className="px-4 py-4"><Badge tone={profile.role === roles.admin ? 'dark' : profile.role === roles.teacher ? 'royal' : 'success'}>{roleLabels[profile.role]}</Badge></td>
                    <td className="px-4 py-4 text-slate-700">{profile.email}</td>
                  </tr>
                )) : (
                  <tr><td className="px-4 py-4 text-muted" colSpan={3}>Nenhum cadastro encontrado.</td></tr>
                )}
              </Table>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <p className="text-sm font-black uppercase text-alert-coral">Media por turma</p>
              <Table className="mt-4" columns={['Turma', 'Media']}>
                {dashboardData.averageByClass.length ? dashboardData.averageByClass.map((item) => (
                  <tr className="bg-white even:bg-slate-50" key={item.id}>
                    <td className="px-4 py-4 font-black text-brand-ink">{item.name}</td>
                    <td className="px-4 py-4 text-slate-700">{formatAverage(item.average)}</td>
                  </tr>
                )) : (
                  <tr><td className="px-4 py-4 text-muted" colSpan={2}>Nenhuma turma encontrada.</td></tr>
                )}
              </Table>
            </Card>

            <Card>
              <p className="text-sm font-black uppercase text-alert-coral">Media por disciplina</p>
              <Table className="mt-4" columns={['Disciplina', 'Media']}>
                {dashboardData.averageBySubject.length ? dashboardData.averageBySubject.map((item) => (
                  <tr className="bg-white even:bg-slate-50" key={item.id}>
                    <td className="px-4 py-4 font-black text-brand-ink">{item.name}</td>
                    <td className="px-4 py-4 text-slate-700">{formatAverage(item.average)}</td>
                  </tr>
                )) : (
                  <tr><td className="px-4 py-4 text-muted" colSpan={2}>Nenhuma disciplina encontrada.</td></tr>
                )}
              </Table>
            </Card>
          </div>
        </div>
      ) : null}

      {activeSection === 'availability' ? (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <Card>
            <p className="text-sm font-black uppercase text-alert-coral">Horarios</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Disponibilidade dos professores</h2>
            <form className="mt-5 grid gap-4" onSubmit={handleSaveAvailability}>
              <InputField as="select" label="Professor" name="availabilityTeacher" onChange={(event) => setAvailabilityForm((current) => ({ ...current, id: '', professor_id: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...teacherOptions]} required value={availabilityForm.professor_id} />
              <InputField as="select" label="Dia da semana" name="availabilityDay" onChange={(event) => setAvailabilityForm((current) => ({ ...current, dia_semana: event.target.value }))} options={dayOptions} required value={availabilityForm.dia_semana} />
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Inicio" name="startTime" onChange={(event) => setAvailabilityForm((current) => ({ ...current, horario_inicio: event.target.value }))} required type="time" value={availabilityForm.horario_inicio} />
                <InputField label="Termino" name="endTime" onChange={(event) => setAvailabilityForm((current) => ({ ...current, horario_fim: event.target.value }))} required type="time" value={availabilityForm.horario_fim} />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled={savingAvailability || !teacherOptions.length} icon={availabilityForm.id ? Save : PlusCircle} type="submit" variant="royal">
                  {savingAvailability ? 'Salvando' : availabilityForm.id ? 'Salvar edicao' : 'Adicionar horario'}
                </Button>
                {availabilityForm.id ? (
                  <Button onClick={() => setAvailabilityForm((current) => ({ ...emptyAvailabilityForm, professor_id: current.professor_id }))} variant="ghost">Cancelar</Button>
                ) : null}
              </div>
            </form>
          </Card>

          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Disponibilidade atual</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">{teacherOptions.find((item) => item.value === availabilityForm.professor_id)?.label || 'Selecione um professor'}</h2>
              </div>
              <Badge tone="royal">{availabilityRows.length} horarios</Badge>
            </div>
            <Table columns={['Dia', 'Inicio', 'Termino', 'Acoes']}>
              {availabilityRows.length ? availabilityRows.map((row) => (
                <tr className="bg-white even:bg-slate-50" key={row.id}>
                  <td className="px-4 py-4 font-black text-brand-ink">{dayLabels[row.dia_semana] || row.dia_semana}</td>
                  <td className="px-4 py-4 text-slate-700">{row.horario_inicio?.slice(0, 5)}</td>
                  <td className="px-4 py-4 text-slate-700">{row.horario_fim?.slice(0, 5)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button icon={Edit3} onClick={() => handleEditAvailability(row)} variant="soft">Editar</Button>
                      <Button disabled={deletingAvailabilityId === row.id} icon={Trash2} onClick={() => handleDeleteAvailability(row)} variant="coral">
                        {deletingAvailabilityId === row.id ? 'Excluindo' : 'Excluir'}
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="px-4 py-4 text-muted" colSpan={4}>Nenhum horario cadastrado para este professor.</td></tr>
              )}
            </Table>
          </Card>
        </div>
      ) : null}

      {activeSection === 'management' ? (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><p className="text-sm font-black uppercase text-muted">Alunos</p><p className="mt-2 text-4xl font-black text-brand-ink">{visibleStudents.length}</p></Card>
            <Card><p className="text-sm font-black uppercase text-muted">Professores</p><p className="mt-2 text-4xl font-black text-brand-ink">{visibleTeachers.length}</p></Card>
            <Card><p className="text-sm font-black uppercase text-muted">Turmas</p><p className="mt-2 text-4xl font-black text-brand-ink">{schoolData.classes.length}</p></Card>
          </div>

          {createdCredential ? (
            <Card className="border-success bg-success-soft">
              <p className="text-sm font-black uppercase text-success">Convite enviado</p>
              <p className="mt-2 font-black text-brand-ink">{createdCredential.fullname}</p>
              <p className="text-sm text-copy">E-mail: {createdCredential.email}</p>
              {createdCredential.registration_number ? <p className="text-sm text-copy">Matricula: {createdCredential.registration_number}</p> : null}
              <p className="text-sm font-bold text-copy">O usuario recebeu um e-mail para aceitar o convite e acessar a conta.</p>
            </Card>
          ) : null}

          <Card>
            <div className="mb-5">
              <p className="text-sm font-black uppercase text-alert-coral">Contas</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Convidar aluno ou professor</h2>
            </div>
            <form className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_150px_1fr_auto]" onSubmit={handleAddUser}>
              <InputField label="Nome" name="fullname" onChange={(event) => setUserForm((current) => ({ ...current, fullname: event.target.value }))} required value={userForm.fullname} />
              <InputField label="E-mail" name="email" onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))} required type="email" value={userForm.email} />
              <InputField as="select" label="Perfil" name="role" onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))} options={[roles.student, roles.teacher].map((role) => ({ label: roleLabels[role], value: role }))} value={userForm.role} />
              <InputField label="CPF" name="cpf" onChange={(event) => setUserForm((current) => ({ ...current, cpf: event.target.value }))} value={userForm.cpf} />
              <Button className="self-end" icon={UserPlus} type="submit" variant="royal">Enviar convite</Button>
              {userForm.role === roles.student ? (
                <InputField as="select" className="md:col-span-2 xl:col-span-5" label="Turma do aluno" name="classId" onChange={(event) => setUserForm((current) => ({ ...current, classId: event.target.value }))} options={[{ label: 'Sem turma', value: '' }, ...classOptions]} value={userForm.classId} />
              ) : null}
            </form>

            <Table columns={['Nome', 'E-mail', 'Perfil', 'Matricula', 'Acao']}>
              {visibleUsers.map((user) => (
                <tr className="bg-white even:bg-slate-50" key={user.id}>
                  <td className="px-4 py-4 font-black text-brand-ink">{user.fullname}</td>
                  <td className="px-4 py-4 text-slate-700">{user.email}</td>
                  <td className="px-4 py-4"><Badge tone={user.role === roles.admin ? 'dark' : user.role === roles.teacher ? 'royal' : 'success'}>{roleLabels[user.role]}</Badge></td>
                  <td className="px-4 py-4 text-slate-700">{user.registration_number || '-'}</td>
                  <td className="px-4 py-4"><Button disabled={user.role === roles.admin || removingProfileId === user.id} icon={Trash2} onClick={() => setProfileToRemove(user)} variant="coral">{removingProfileId === user.id ? 'Removendo' : 'Remover'}</Button></td>
                </tr>
              ))}
            </Table>
          </Card>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card>
              <p className="text-sm font-black uppercase text-alert-coral">Turmas</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Adicionar turma</h2>
              <form className="mt-5 grid gap-4" onSubmit={handleCreateClass}>
                <InputField label="Nome da turma" name="className" onChange={(event) => setClassForm((current) => ({ ...current, name: event.target.value }))} required value={classForm.name} />
                <InputField label="Ano letivo" name="schoolYear" onChange={(event) => setClassForm((current) => ({ ...current, school_year: event.target.value }))} value={classForm.school_year} />
                <Button icon={PlusCircle} type="submit" variant="primary">Criar turma</Button>
              </form>
            </Card>

            <Card>
              <p className="text-sm font-black uppercase text-alert-coral">Disciplinas</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Criar disciplina</h2>
              <form className="mt-5 grid gap-4" onSubmit={handleCreateSubject}>
                <InputField label="Nome da disciplina" name="subjectName" onChange={(event) => setSubjectForm({ name: event.target.value })} required value={subjectForm.name} />
                <Button icon={PlusCircle} type="submit" variant="primary">Criar disciplina</Button>
              </form>
            </Card>

            <Card>
              <p className="text-sm font-black uppercase text-alert-coral">Vinculos</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Vincular professor</h2>
              <form className="mt-5 grid gap-4" onSubmit={handleAssignTeacher}>
                <InputField as="select" label="Professor" name="teacher" onChange={(event) => setLinkForm((current) => ({ ...current, teacher_id: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...teacherOptions]} value={linkForm.teacher_id} />
                <InputField as="select" label="Turma" name="class" onChange={(event) => setLinkForm((current) => ({ ...current, class_id: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...classOptions]} value={linkForm.class_id} />
                <InputField as="select" label="Disciplina" name="subject" onChange={(event) => setLinkForm((current) => ({ ...current, subject_id: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...subjectOptions]} value={linkForm.subject_id} />
                <Button icon={Link2} type="submit" variant="royal">Criar vinculo</Button>
              </form>
            </Card>
          </div>
        </div>
      ) : null}

      {profileToRemove ? (
        <Modal onClose={() => setProfileToRemove(null)} title="Remover usuario">
          <div className="grid gap-5">
            <p className="text-slate-700">Confirme a exclusao de {profileToRemove.fullname}. Esta acao remove o perfil e os registros vinculados no banco.</p>
            <div className="flex flex-wrap justify-end gap-3">
              <Button disabled={Boolean(removingProfileId)} onClick={() => setProfileToRemove(null)} variant="ghost">Cancelar</Button>
              <Button disabled={Boolean(removingProfileId)} icon={Trash2} onClick={handleRemoveUser} variant="coral">
                {removingProfileId ? 'Removendo' : 'Confirmar remocao'}
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

export default AdminPage
