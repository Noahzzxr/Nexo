import { useMemo, useState } from 'react'
import { Link2, PlusCircle, Trash2, UserPlus } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import Table from '../components/ui/Table'
import { roles, roleLabels } from '../context/roles'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { assignTeacher, createClass, createSchoolAccount, createSubject, removeProfile } from '../services/schoolService'

function AdminPage() {
  const { addToast } = useToast()
  const { isAdmin, refreshSchoolData, schoolData } = useSession()
  const [createdCredential, setCreatedCredential] = useState(null)
  const [userForm, setUserForm] = useState({ classId: '', cpf: '', email: '', fullname: '', role: roles.student })
  const [classForm, setClassForm] = useState({ name: '', school_year: String(new Date().getFullYear()) })
  const [subjectForm, setSubjectForm] = useState({ name: '' })
  const [linkForm, setLinkForm] = useState({ class_id: '', subject_id: '', teacher_id: '' })

  const teachers = schoolData.teachers
  const users = schoolData.profiles

  const classOptions = useMemo(() => schoolData.classes.map((item) => ({ label: item.name, value: item.id })), [schoolData.classes])
  const subjectOptions = useMemo(() => schoolData.subjects.map((item) => ({ label: item.name, value: item.id })), [schoolData.subjects])
  const teacherOptions = useMemo(() => teachers.map((item) => ({ label: item.fullname, value: item.id })), [teachers])

  if (!isAdmin) {
    return (
      <Card>
        <p className="text-sm font-black uppercase text-alert-coral">Acesso restrito</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Ferramentas administrativas</h1>
        <p className="mt-3 text-slate-700">Entre com uma conta administradora para criar alunos, professores, turmas e disciplinas.</p>
      </Card>
    )
  }

  const handleAddUser = async (event) => {
    event.preventDefault()

    try {
      const created = await createSchoolAccount(userForm)
      setCreatedCredential(created)
      setUserForm({ classId: '', cpf: '', email: '', fullname: '', role: roles.student })
      await refreshSchoolData()
      addToast({ title: 'Conta criada', message: `${created.fullname} foi cadastrado.` })
    } catch (error) {
      addToast({ title: 'Erro ao criar conta', message: error.message })
    }
  }

  const handleRemoveUser = async (user) => {
    try {
      await removeProfile(user.id)
      await refreshSchoolData()
      addToast({ title: 'Usuario removido', message: `${user.fullname} foi removido.` })
    } catch (error) {
      addToast({ title: 'Erro ao remover usuario', message: error.message })
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

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Administrador</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Painel de Controle</h1>
        <p className="mt-2 text-muted">Gestao de contas, turmas, disciplinas e vinculos usando dados do banco.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm font-black uppercase text-muted">Alunos</p><p className="mt-2 text-4xl font-black text-brand-ink">{schoolData.students.length}</p></Card>
        <Card><p className="text-sm font-black uppercase text-muted">Professores</p><p className="mt-2 text-4xl font-black text-brand-ink">{teachers.length}</p></Card>
        <Card><p className="text-sm font-black uppercase text-muted">Turmas</p><p className="mt-2 text-4xl font-black text-brand-ink">{schoolData.classes.length}</p></Card>
      </div>

      {createdCredential ? (
        <Card className="border-success bg-success-soft">
          <p className="text-sm font-black uppercase text-success">Credencial gerada</p>
          <p className="mt-2 font-black text-brand-ink">{createdCredential.fullname}</p>
          <p className="text-sm text-copy">E-mail: {createdCredential.email}</p>
          {createdCredential.registration_number ? <p className="text-sm text-copy">Matricula: {createdCredential.registration_number}</p> : null}
          <p className="text-sm font-bold text-copy">Senha inicial: {createdCredential.initial_password}</p>
        </Card>
      ) : null}

      <Card>
        <div className="mb-5">
          <p className="text-sm font-black uppercase text-alert-coral">Contas</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Criar aluno ou professor</h2>
        </div>
        <form className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_150px_1fr_auto]" onSubmit={handleAddUser}>
          <InputField label="Nome" name="fullname" onChange={(event) => setUserForm((current) => ({ ...current, fullname: event.target.value }))} required value={userForm.fullname} />
          <InputField label="E-mail" name="email" onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))} required type="email" value={userForm.email} />
          <InputField as="select" label="Perfil" name="role" onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))} options={[roles.student, roles.teacher].map((role) => ({ label: roleLabels[role], value: role }))} value={userForm.role} />
          <InputField label="CPF" name="cpf" onChange={(event) => setUserForm((current) => ({ ...current, cpf: event.target.value }))} value={userForm.cpf} />
          <Button className="self-end" icon={UserPlus} type="submit" variant="royal">Criar</Button>
          {userForm.role === roles.student ? (
            <InputField as="select" className="md:col-span-2 xl:col-span-5" label="Turma do aluno" name="classId" onChange={(event) => setUserForm((current) => ({ ...current, classId: event.target.value }))} options={[{ label: 'Sem turma', value: '' }, ...classOptions]} value={userForm.classId} />
          ) : null}
        </form>

        <Table columns={['Nome', 'E-mail', 'Perfil', 'Matricula', 'Acao']}>
          {users.map((user) => (
            <tr className="bg-white even:bg-slate-50" key={user.id}>
              <td className="px-4 py-4 font-black text-brand-ink">{user.fullname}</td>
              <td className="px-4 py-4 text-slate-700">{user.email}</td>
              <td className="px-4 py-4"><Badge tone={user.role === roles.admin ? 'dark' : user.role === roles.teacher ? 'royal' : 'success'}>{roleLabels[user.role]}</Badge></td>
              <td className="px-4 py-4 text-slate-700">{user.registration_number || '-'}</td>
              <td className="px-4 py-4"><Button disabled={user.role === roles.admin} icon={Trash2} onClick={() => handleRemoveUser(user)} variant="coral">Remover</Button></td>
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
  )
}

export default AdminPage
