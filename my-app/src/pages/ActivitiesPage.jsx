import { useMemo, useState } from 'react'
import { ArrowRight, ClipboardCheck, Clock, ImageUp, ListChecks, PlusCircle } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import Modal from '../components/ui/Modal'
import Table from '../components/ui/Table'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { schoolClasses, subjectsCatalog } from '../data/mockData'

const statusTone = {
  Pendente: 'warning',
  Concluido: 'success',
  Concluído: 'success',
  Atrasado: 'coral',
}

const statusLabel = {
  Pendente: 'Pendente',
  Concluido: 'Concluído',
  Concluído: 'Concluído',
  Atrasado: 'Atrasado',
}

const reviewContentBySubject = {
  'Matemática': {
    summary: 'A Matemática estuda as propriedades e relações dos números, formas geométricas e funções. Nas equações de 2º grau (por exemplo, ax² + bx + c = 0), a fórmula de Bhaskara é utilizada para encontrar as raízes reais que determinam os pontos de interseção da parábola com o eixo das abscissas.',
    recommendations: {
      books: ['"O Homem que Calculava" - Malba Tahan', '"Uma Breve História do Tempo" - Stephen Hawking'],
      movies: ['"Estrelas Além do Tempo" (2016)', '"Uma Mente Brilhante" (2001)']
    }
  },
  'Redação': {
    summary: 'A elaboração de redações no modelo dissertativo-argumentativo exige uma tese explícita, repertório sociocultural legitimado e uma proposta de intervenção social estruturada com agente, ação, meio, efeito e detalhamento.',
    recommendations: {
      books: ['"Como Escrever Bem" - William Zinsser', '"Redação Nota 1000" - Guia Oficial'],
      movies: ['"Sociedade dos Poetas Mortos" (1989)', '"O Jogo da Imitação" (2014)']
    }
  },
  'História': {
    summary: 'A transição da Monarquia para a República no Brasil (1889) marcou uma reorganização federalista inspirada no positivismo e no modelo americano. Compreender os conflitos sociais e os arranjos oligárquicos da República Velha é fundamental para entender o Brasil contemporâneo.',
    recommendations: {
      books: ['"1889" - Laurentino Gomes', '"Era dos Extremos" - Eric Hobsbawm'],
      movies: ['"Guerra de Canudos" (1997)', '"Lincoln" (2012)']
    }
  },
  'Inglês': {
    summary: 'O aprendizado de língua estrangeira baseia-se na consolidação das habilidades de compreensão auditiva (listening), leitura, escrita e conversação, utilizando estruturas gramaticais como modal verbs e passive voice.',
    recommendations: {
      books: ['"Grammar in Use" - Raymond Murphy', '"O Apanhador no Campo de Centeio" (Inglês) - J.D. Salinger'],
      movies: ['"O Discurso do Rei" (2010)', '"Escritores da Liberdade" (2007)']
    }
  },
  'Química': {
    summary: 'O estudo das soluções químicas analisa dispersões homogêneas formadas por soluto e solvente. As propriedades coligativas e as escalas de pH e concentração determinam as reações em laboratório e na natureza.',
    recommendations: {
      books: ['"A Tabela Periódica" - Primo Levi', '"Tio Tungstênio: Memórias de uma infância química" - Oliver Sacks'],
      movies: ['"Radioativo" (2019)', '"O Menino que Descobriu o Vento" (2019)']
    }
  },
  'Física': {
    summary: 'A cinemática estuda o movimento dos corpos sem analisar suas causas físicas. Os conceitos de velocidade média, aceleração e gráficos de movimento retilíneo uniforme (MRU) e uniformemente variado (MRUV) descrevem a mecânica newtoniana clássica.',
    recommendations: {
      books: ['"Física em 12 Lições" - Richard Feynman', '"Interestelar: A Ciência por Trás do Filme" - Kip Thorne'],
      movies: ['"Interestelar" (2014)', '"A Teoria de Tudo" (2014)']
    }
  },
  'Biologia': {
    summary: 'A Biologia estuda a vida celular, a ecologia e as leis da genética mendeliana que explicam a hereditariedade e a seleção natural das espécies.',
    recommendations: {
      books: ['"A Origem das Espécies" - Charles Darwin', '"O Gene: Uma História Íntima" - Siddhartha Mukherjee'],
      movies: ['"Gattaca: Experiência Genética" (1997)', '"Jurassic Park" (1993)']
    }
  }
}

function ActivitiesPage() {
  const { addToast } = useToast()
  const { activities, addActivity, updateActivityStatus, isStudent, isTeacher, roleLabel } = useSession()
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [revisingActivity, setRevisingActivity] = useState(null)
  const [submissionFile, setSubmissionFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignmentFile, setAssignmentFile] = useState(null)
  const [assignmentForm, setAssignmentForm] = useState({
    classId: schoolClasses[0].id,
    description: '',
    dueDate: '2026-06-14T12:00',
    subjectId: subjectsCatalog[0].id,
    title: '',
  })

  const completed = activities.filter((activity) => activity.status === 'Concluido' || activity.status === 'Concluído').length
  const late = activities.filter((activity) => activity.status === 'Atrasado').length
  const canCreateAssignments = isTeacher // Form of creating assignments is exclusively for the teacher account

  const selectedClassName = useMemo(
    () => schoolClasses.find((item) => item.id === assignmentForm.classId)?.name || schoolClasses[0].name,
    [assignmentForm.classId],
  )

  const selectedSubjectName = useMemo(
    () => subjectsCatalog.find((item) => item.id === assignmentForm.subjectId)?.name || subjectsCatalog[0].name,
    [assignmentForm.subjectId],
  )

  const handleSubmission = async (event) => {
    event.preventDefault()

    if (!selectedActivity || !submissionFile) {
      addToast({ title: 'Arquivo obrigatório', message: 'Selecione uma foto antes de confirmar a entrega.' })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate submission globally
      updateActivityStatus(selectedActivity.id, 'Concluído')
      
      setSelectedActivity(null)
      setSubmissionFile(null)
      addToast({
        title: 'Entrega confirmada',
        message: 'Entrega simulada localmente com sucesso.',
      })
    } catch (error) {
      addToast({ title: 'Falha na entrega', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateAssignment = (event) => {
    event.preventDefault()

    if (!assignmentForm.title.trim()) {
      addToast({ title: 'Título obrigatório', message: 'Informe o título da atividade antes de postar.' })
      return
    }

    try {
      const newActivity = {
        id: `act-${Date.now()}`,
        classId: assignmentForm.classId,
        subjectId: assignmentForm.subjectId,
        course: selectedSubjectName,
        due: new Date(assignmentForm.dueDate).toLocaleDateString('pt-BR'),
        name: assignmentForm.title,
        description: assignmentForm.description,
        status: 'Pendente',
      }
      addActivity(newActivity)
      setAssignmentForm({
        classId: schoolClasses[0].id,
        description: '',
        dueDate: '2026-06-14T12:00',
        subjectId: subjectsCatalog[0].id,
        title: '',
      })
      setAssignmentFile(null)
      addToast({ title: 'Atividade postada', message: `${selectedSubjectName} foi liberada para ${selectedClassName}.` })
    } catch (error) {
      addToast({ title: 'Erro ao postar', message: error.message })
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Minhas atividades</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Tarefas e Avaliações</h1>
        <p className="mt-2 text-muted">Prazos, status e acessos rápidos para cada disciplina. Perfil ativo: {roleLabel}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <ListChecks aria-hidden="true" className="h-6 w-6 text-brand-royal" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Total de tarefas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{activities.length}</p>
        </Card>
        <Card>
          <ClipboardCheck aria-hidden="true" className="h-6 w-6 text-success" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Concluídas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{completed}</p>
        </Card>
        <Card>
          <Clock aria-hidden="true" className="h-6 w-6 text-alert-coral" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Atrasadas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{late}</p>
        </Card>
      </div>

      {canCreateAssignments ? (
        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-alert-coral">Professor</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Adicionar Atividade</h2>
            </div>
            <Badge tone="dark">Nova atividade letiva</Badge>
          </div>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={handleCreateAssignment}>
            <InputField
              as="select"
              label="Turma"
              name="classId"
              onChange={(event) => {
                const schoolClass = schoolClasses.find((item) => item.name === event.target.value)
                setAssignmentForm((current) => ({ ...current, classId: schoolClass.id }))
              }}
              options={schoolClasses.map((item) => item.name)}
              value={selectedClassName}
            />
            <InputField
              as="select"
              label="Disciplina"
              name="subjectId"
              onChange={(event) => {
                const subject = subjectsCatalog.find((item) => item.name === event.target.value)
                setAssignmentForm((current) => ({ ...current, subjectId: subject.id }))
              }}
              options={subjectsCatalog.map((item) => item.name)}
              value={selectedSubjectName}
            />
            <InputField
              label="Título"
              name="title"
              onChange={(event) => setAssignmentForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Enunciado curto"
              value={assignmentForm.title}
            />
            <InputField
              label="Prazo"
              name="dueDate"
              onChange={(event) => setAssignmentForm((current) => ({ ...current, dueDate: event.target.value }))}
              type="datetime-local"
              value={assignmentForm.dueDate}
            />
            <label className="block text-sm font-semibold text-brand-ink">
              <span>Foto/enunciado</span>
              <input
                accept="image/*,.pdf"
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-brand-royal file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white"
                onChange={(event) => setAssignmentFile(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
            <InputField
              as="textarea"
              className="md:col-span-2 xl:col-span-4"
              label="Descrição"
              name="description"
              onChange={(event) => setAssignmentForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Detalhes da atividade"
              value={assignmentForm.description}
            />
            <Button className="self-end" icon={PlusCircle} type="submit" variant="royal">
              Postar
            </Button>
          </form>
        </Card>
      ) : null}

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Lista robusta</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Atividades por curso</h2>
          </div>
          <Badge tone="royal">Atualizado hoje</Badge>
        </div>
        <Table columns={['Curso', 'Atividade', 'Data limite', 'Status', 'Ação']}>
          {activities.map((activity) => (
            <tr className="bg-white even:bg-slate-50" key={activity.id || activity.name}>
              <td className="px-4 py-4 font-black text-brand-ink">{activity.course}</td>
              <td className="px-4 py-4 text-copy">{activity.name}</td>
              <td className="px-4 py-4 text-muted">{activity.due}</td>
              <td className="px-4 py-4">
                <Badge tone={statusTone[activity.status] || 'warning'}>{statusLabel[activity.status] || activity.status}</Badge>
              </td>
              <td className="px-4 py-4">
                <Button
                  disabled={!isStudent}
                  icon={(activity.status === 'Concluido' || activity.status === 'Concluído') ? ClipboardCheck : ArrowRight}
                  onClick={() => {
                    if (activity.status === 'Concluido' || activity.status === 'Concluído') {
                      setRevisingActivity(activity)
                    } else {
                      setSelectedActivity(activity)
                    }
                  }}
                  variant={activity.status === 'Atrasado' ? 'coral' : (activity.status === 'Concluido' || activity.status === 'Concluído') ? 'success' : 'royal'}
                >
                  {(activity.status === 'Concluido' || activity.status === 'Concluído') ? 'Revisar' : 'Acessar Avaliação'}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Submission Modal */}
      {selectedActivity ? (
        <Modal onClose={() => setSelectedActivity(null)} title="Enviar atividade resolvida">
          <form className="grid gap-4" onSubmit={handleSubmission}>
            <div className="rounded-lg bg-page p-4">
              <p className="font-black text-brand-ink">{selectedActivity.name}</p>
              <p className="mt-1 text-sm text-slate-700">
                {selectedActivity.course} - entrega até {selectedActivity.due}
              </p>
            </div>
            <label className="block text-sm font-semibold text-brand-ink">
              <span>Foto da atividade resolvida</span>
              <input
                accept="image/*"
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-brand-royal file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white"
                onChange={(event) => setSubmissionFile(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
            <Button disabled={isSubmitting} icon={ImageUp} type="submit" variant="coral">
              {isSubmitting ? 'Enviando...' : 'Confirmar Entrega'}
            </Button>
          </form>
        </Modal>
      ) : null}

      {/* Review Modal */}
      {revisingActivity ? (
        <Modal onClose={() => setRevisingActivity(null)} title="Revisão de Conteúdo">
          <div className="grid gap-4">
            <div className="rounded-lg bg-page p-4">
              <p className="text-xs font-black uppercase text-alert-coral">{revisingActivity.course}</p>
              <h3 className="text-lg font-black text-brand-ink">{revisingActivity.name}</h3>
            </div>
            
            <div>
              <h4 className="font-bold text-brand-ink">Resumo Conceitual</h4>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {reviewContentBySubject[revisingActivity.course]?.summary || 
                  'Este tópico aborda a consolidação dos conteúdos programáticos da disciplina, preparando o estudante para a aplicação prática dos conceitos analisados em sala.'}
              </p>
            </div>
            
            <div className="border-t border-line pt-4">
              <h4 className="font-bold text-brand-ink">Recomendações Culturais e Acadêmicas</h4>
              
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-brand-royal-soft/40 p-3">
                  <p className="text-xs font-black uppercase text-brand-royal">Livros Recomendados</p>
                  <ul className="mt-2 list-inside list-disc text-xs font-semibold text-slate-800 space-y-1">
                    {(reviewContentBySubject[revisingActivity.course]?.recommendations?.books || [
                      '"O Homem que Calculava" - Malba Tahan',
                      '"Como Estudar Melhor" - Coleção Escolar'
                    ]).map((book) => (
                      <li key={book}>{book}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="rounded-lg bg-alert-soft/40 p-3">
                  <p className="text-xs font-black uppercase text-alert-coral">Filmes Recomendados</p>
                  <ul className="mt-2 list-inside list-disc text-xs font-semibold text-slate-800 space-y-1">
                    {(reviewContentBySubject[revisingActivity.course]?.recommendations?.movies || [
                      '"Uma Mente Brilhante" (2001)',
                      '"O Menino que Descobriu o Vento" (2019)'
                    ]).map((movie) => (
                      <li key={movie}>{movie}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <Button className="mt-2" onClick={() => setRevisingActivity(null)} variant="soft">
              Fechar Revisão
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

export default ActivitiesPage
