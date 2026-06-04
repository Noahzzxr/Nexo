import { useState } from 'react'
import { CheckCircle2, Link2, PlusCircle, Trash2, UserPlus } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import Table from '../components/ui/Table'
import { roles, roleLabels } from '../context/roles'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'

const statStyles = {
  royal: {
    badge: 'bg-brand-royal text-white',
  },
}
import {
  approveLead,
  assignTeacher,
  createClass,
  createProfile,
  createSubject,
  removeProfile,
} from '../services/schoolService'
import { adminUsers, inscriptionLeads, schoolClasses, subjectsCatalog } from '../data/mockData'

function AdminPage() {
  const { addToast } = useToast()
  const { isAdmin } = useSession()
  const [leads, setLeads] = useState(inscriptionLeads)
  const [users, setUsers] = useState(adminUsers)
  const [classes, setClasses] = useState(schoolClasses)
  const [subjects, setSubjects] = useState(subjectsCatalog)
  const [links, setLinks] = useState([])
  const [userForm, setUserForm] = useState({ email: '', fullname: '', role: roles.student })
  const [classForm, setClassForm] = useState({ name: '', school_year: '2026' })
  const [subjectForm, setSubjectForm] = useState({ name: '' })
  const [linkForm, setLinkForm] = useState({
    class_id: schoolClasses[0].id,
    subject_id: subjectsCatalog[0].id,
    teacher_id: adminUsers.find((user) => user.role === roles.teacher)?.id || adminUsers[1].id,
  })

  const teachers = users.filter((user) => user.role === roles.teacher)

  if (!isAdmin) {
    return (
      <Card>
        <p className="text-sm font-black uppercase text-alert-coral">Acesso restrito</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Ferramentas administrativas</h1>
        <p className="mt-3 text-slate-700">Entre com o e-mail e senha de administrador para liberar as ferramentas de gestão.</p>
      </Card>
    )
  }

  const handleApproveLead = async (lead) => {
    try {
      const approved = await approveLead(lead)
      setLeads((current) =>
        current.map((item) =>
          item.id === lead.id
            ? {
                ...item,
                auth_user_id: approved.auth_user_id,
                initial_password: approved.initial_password,
                status: 'approved',
                institutional_email: approved.institutional_email,
                registration_number: approved.registration_number,
              }
            : item,
        ),
      )
      setUsers((current) => [
        {
          email: approved.institutional_email,
          fullname: lead.full_name,
          id: approved.auth_user_id || lead.id,
          registration_number: approved.registration_number,
          role: roles.student,
        },
        ...current,
      ])
      addToast({
        title: 'Inscrição aprovada',
        message: `${lead.full_name} recebeu matrícula ${approved.registration_number}.`,
      })
    } catch (error) {
      addToast({ title: 'Erro ao aprovar lead', message: error.message })
    }
  }

  const handleAddUser = async (event) => {
    event.preventDefault()

    try {
      const created = await createProfile(userForm)
      setUsers((current) => [created, ...current])
      setUserForm({ email: '', fullname: '', role: roles.student })
      addToast({ title: 'Usuário criado', message: `${created.fullname} foi adicionado ao sistema.` })
    } catch (error) {
      addToast({ title: 'Erro ao criar usuário', message: error.message })
    }
  }

  const handleRemoveUser = async (user) => {
    try {
      await removeProfile(user.id)
      setUsers((current) => current.filter((item) => item.id !== user.id))
      addToast({ title: 'Usuário removido', message: `${user.fullname} foi removido do cadastro.` })
    } catch (error) {
      addToast({ title: 'Erro ao remover usuário', message: error.message })
    }
  }

  const handleCreateClass = async (event) => {
    event.preventDefault()

    try {
      const created = await createClass(classForm)
      setClasses((current) => [created, ...current])
      setClassForm({ name: '', school_year: '2026' })
      addToast({ title: 'Turma criada', message: `${created.name} foi adicionada.` })
    } catch (error) {
      addToast({ title: 'Erro ao criar turma', message: error.message })
    }
  }

  const handleCreateSubject = async (event) => {
    event.preventDefault()

    try {
      const created = await createSubject(subjectForm)
      setSubjects((current) => [created, ...current])
      setSubjectForm({ name: '' })
      addToast({ title: 'Disciplina criada', message: `${created.name} foi adicionada.` })
    } catch (error) {
      addToast({ title: 'Erro ao criar disciplina', message: error.message })
    }
  }

  const handleAssignTeacher = async (event) => {
    event.preventDefault()

    try {
      const created = await assignTeacher(linkForm)
      setLinks((current) => [created, ...current])
      addToast({ title: 'Vínculo criado', message: 'Professor, disciplina e turma foram vinculados com sucesso.' })
    } catch (error) {
      addToast({ title: 'Erro ao criar vínculo', message: error.message })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 grid gap-6">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Administrador</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Painel de Controle do Administrador</h1>
          <p className="mt-2 text-muted">Gestão geral do sistema, matrículas e turmas.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-brand-royal/20 bg-brand-royal-soft overflow-hidden">
            <p className="text-sm font-black uppercase text-brand-royal">Total de Alunos</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="text-4xl font-black text-brand-ink">{users.filter((user) => user.role === roles.student).length}</span>
              <Badge className={statStyles.royal.badge}>Ativos</Badge>
            </div>
          </Card>
          <Card className="border-brand-royal/20 bg-brand-royal-soft overflow-hidden">
            <p className="text-sm font-black uppercase text-brand-royal">Professores Ativos</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="text-4xl font-black text-brand-ink">{users.filter((user) => user.role === roles.teacher).length}</span>
              <Badge className={statStyles.royal.badge}>Cadastrados</Badge>
            </div>
          </Card>
          <Card className="border-brand-royal/20 bg-brand-royal-soft overflow-hidden">
            <p className="text-sm font-black uppercase text-brand-royal">Solicitações Pendentes</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="text-4xl font-black text-brand-ink">{leads.filter((lead) => lead.status !== 'approved').length}</span>
              <Badge className={statStyles.royal.badge}>Em análise</Badge>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-5">
            <p className="text-sm font-black uppercase text-alert-coral">Inscrições</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Gerenciamento de Inscrições</h2>
          </div>
          <Table columns={['Nome', 'Curso', 'Status', 'Credenciais', 'Ação']}>
            {leads.map((lead) => (
              <tr className="bg-white even:bg-slate-50" key={lead.id}>
                <td className="px-4 py-4">
                  <p className="font-black text-brand-ink">{lead.full_name}</p>
                  <p className="text-sm text-slate-700">{lead.email}</p>
                </td>
                <td className="px-4 py-4 text-copy">{lead.desired_course}</td>
                <td className="px-4 py-4">
                  <Badge tone={lead.status === 'approved' ? 'success' : 'warning'}>{lead.status}</Badge>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {lead.registration_number ? (
                    <>
                      <p className="font-bold text-brand-ink">{lead.registration_number}</p>
                      <p>{lead.institutional_email}</p>
                      {lead.initial_password ? <p>Senha inicial: {lead.initial_password}</p> : null}
                    </>
                  ) : (
                    'Aguardando aprovação'
                  )}
                </td>
                <td className="px-4 py-4">
                  <Button
                    disabled={lead.status === 'approved'}
                    icon={CheckCircle2}
                    onClick={() => handleApproveLead(lead)}
                    variant="success"
                  >
                    Aprovar Inscrição
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card>
          <div className="mb-5">
            <p className="text-sm font-black uppercase text-alert-coral">Usuários</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Controle de Alunos e Professores</h2>
          </div>
          <form className="mb-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_180px_auto]" onSubmit={handleAddUser}>
            <InputField
              label="Nome"
              name="fullname"
              onChange={(event) => setUserForm((current) => ({ ...current, fullname: event.target.value }))}
              placeholder="Nome completo"
              required
              value={userForm.fullname}
            />
            <InputField
              label="Email"
              name="email"
              onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="usuario@progresso.edu"
              required
              type="email"
              value={userForm.email}
            />
            <InputField
              as="select"
              label="Perfil"
              name="role"
              onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}
              options={Object.values(roles).map((role) => ({ label: roleLabels[role], value: role }))}
              value={userForm.role}
            />
            <Button className="self-end" icon={UserPlus} type="submit" variant="royal">
              Adicionar
            </Button>
          </form>
          <Table columns={['Nome', 'Email', 'Perfil', 'Ação']}>
            {users.map((user) => (
              <tr className="bg-white even:bg-slate-50" key={user.id}>
                <td className="px-4 py-4 font-black text-brand-ink">{user.fullname}</td>
                <td className="px-4 py-4 text-slate-700">{user.email}</td>
                <td className="px-4 py-4">
                  <Badge tone={user.role === roles.teacher ? 'royal' : user.role === roles.admin ? 'dark' : 'success'}>{roleLabels[user.role]}</Badge>
                </td>
                <td className="px-4 py-4">
                  <Button icon={Trash2} onClick={() => handleRemoveUser(user)} variant="coral">
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>

      <aside className="grid gap-6">
        <Card>
          <p className="text-sm font-black uppercase text-alert-coral">Turmas</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Adicionar nova turma</h2>
          <form className="mt-5 grid gap-4" onSubmit={handleCreateClass}>
            <InputField
              label="Nome da turma"
              name="className"
              onChange={(event) => setClassForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Sala 2º B"
              required
              value={classForm.name}
            />
            <InputField
              label="Ano letivo"
              name="schoolYear"
              onChange={(event) => setClassForm((current) => ({ ...current, school_year: event.target.value }))}
              value={classForm.school_year}
            />
            <Button icon={PlusCircle} type="submit" variant="primary">
              Criar turma
            </Button>
          </form>
        </Card>

        <Card>
          <p className="text-sm font-black uppercase text-alert-coral">Disciplinas</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Criar disciplina</h2>
          <form className="mt-5 grid gap-4" onSubmit={handleCreateSubject}>
            <InputField
              label="Nome da disciplina"
              name="subjectName"
              onChange={(event) => setSubjectForm({ name: event.target.value })}
              placeholder="Biologia"
              required
              value={subjectForm.name}
            />
            <Button icon={PlusCircle} type="submit" variant="primary">
              Criar disciplina
            </Button>
          </form>
        </Card>

        <Card>
          <p className="text-sm font-black uppercase text-alert-coral">Infraestrutura</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Vincular professor</h2>
          <form className="mt-5 grid gap-4" onSubmit={handleAssignTeacher}>
            <InputField
              as="select"
              label="Professor"
              name="teacher"
              onChange={(event) => setLinkForm((current) => ({ ...current, teacher_id: event.target.value }))}
              options={teachers.map((teacher) => ({ label: teacher.fullname, value: teacher.id }))}
              value={linkForm.teacher_id}
            />
            <InputField
              as="select"
              label="Turma"
              name="class"
              onChange={(event) => setLinkForm((current) => ({ ...current, class_id: event.target.value }))}
              options={classes.map((schoolClass) => ({ label: schoolClass.name, value: schoolClass.id }))}
              value={linkForm.class_id}
            />
            <InputField
              as="select"
              label="Disciplina"
              name="subject"
              onChange={(event) => setLinkForm((current) => ({ ...current, subject_id: event.target.value }))}
              options={subjects.map((subject) => ({ label: subject.name, value: subject.id }))}
              value={linkForm.subject_id}
            />
            <Button icon={Link2} type="submit" variant="royal">
              Criar vínculo
            </Button>
          </form>
        </Card>

        <Card>
          <p className="text-sm font-black uppercase text-alert-coral">Vínculos ativos</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Professor por turma e disciplina</h2>
          <div className="mt-4 grid gap-3">
            {links.length ? (
              links.map((link) => (
                <div className="rounded-lg border border-line p-4 text-slate-800" key={link.id || `${link.teacher_id}-${link.subject_id}`}>
                  {teachers.find((teacher) => teacher.id === link.teacher_id)?.fullname} -{' '}
                  {subjects.find((subject) => subject.id === link.subject_id)?.name} -{' '}
                  {classes.find((schoolClass) => schoolClass.id === link.class_id)?.name}
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-page p-4 text-sm text-slate-700">Nenhum vínculo criado nesta sessão.</p>
            )}
          </div>
        </Card>
      </aside>
    </div>
  )
}

export default AdminPage
