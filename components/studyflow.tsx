'use client'
import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderNavigation,
  Field,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  OverlayDrawer,
  ProgressBar,
  SearchBox,
  Select,
  Subtitle1,
  Tab,
  TabList,
  Textarea,
  Title1,
  Title3,
  Tooltip,
  tokens,
  makeStyles,
} from '@fluentui/react-components'
import {
  Add24Regular,
  CalendarLtr24Regular,
  Delete24Regular,
  Edit24Regular,
  Flag24Regular,
  Lightbulb24Regular,
  Settings24Regular,
  Sparkle24Regular,
  TaskListSquareLtr24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons'
import { useTheme } from '@/app/providers'
import {
  AppState,
  initialState,
  reducer,
  repository,
  Task,
  Subject,
  Priority,
  priorityLabel,
  dateLabel,
  formatEstimate,
  isToday,
  makeTask,
  parseQuickAdd,
  streak,
  subjectBg,
  subjectFg,
  subjectAccent,
  subjectColors,
} from '@/lib/types'

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  layout: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'row',
  },
  mobileTopBar: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM,
      paddingTop: tokens.spacingVerticalM,
      paddingBottom: tokens.spacingVerticalM,
      backgroundColor: tokens.colorNeutralBackground1,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
  },
  mobileActions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  rail: {
    width: '240px',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    paddingTop: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    flexShrink: 0,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  brandIcon: {
    width: '34px',
    height: '34px',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusLarge,
    color: tokens.colorNeutralForegroundInverted,
  },
  nav: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  main: {
    flex: 1,
    minWidth: 0,
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
    paddingTop: tokens.spacingVerticalXL,
    paddingBottom: tokens.spacingVerticalXL,
    '@media (max-width: 768px)': {
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM,
      paddingTop: tokens.spacingVerticalM,
      paddingBottom: '96px',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    marginBottom: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      marginBottom: tokens.spacingVerticalM,
    },
  },
  headerTitle: {
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase500,
      lineHeight: tokens.lineHeightBase500,
    },
  },
  command: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    marginBottom: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalS,
      marginBottom: tokens.spacingVerticalM,
    },
  },
  quick: {
    flex: '1 1 320px',
    width: '100%',
  },
  filters: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      justifyContent: 'space-between',
      gap: tokens.spacingHorizontalXS,
      marginBottom: tokens.spacingVerticalM,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingVerticalM,
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingVerticalS,
    },
  },
  card: {
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderRadius: tokens.borderRadiusMedium,
    ':hover': { boxShadow: tokens.shadow4 },
    '@media (max-width: 480px)': {
      paddingLeft: tokens.spacingHorizontalS,
      paddingRight: tokens.spacingHorizontalS,
      paddingTop: tokens.spacingVerticalS,
      paddingBottom: tokens.spacingVerticalS,
    },
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
  },
  title: {
    flex: 1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    wordBreak: 'break-word',
  },
  done: {
    textDecorationLine: 'line-through',
    color: tokens.colorNeutralForeground4,
  },
  meta: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    paddingLeft: '28px',
    '@media (max-width: 480px)': {
      paddingLeft: '0',
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '28px',
    '@media (max-width: 480px)': {
      paddingLeft: '0',
    },
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      gap: tokens.spacingHorizontalS,
      marginBottom: tokens.spacingVerticalM,
    },
    '@media (max-width: 480px)': {
      gap: '6px',
    },
  },
  stat: {
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    '@media (max-width: 768px)': {
      paddingLeft: tokens.spacingHorizontalS,
      paddingRight: tokens.spacingHorizontalS,
      paddingTop: tokens.spacingVerticalS,
      paddingBottom: tokens.spacingVerticalS,
      textAlign: 'center',
    },
  },
  number: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    '@media (max-width: 768px)': {
      fontSize: tokens.fontSizeBase600,
    },
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase500,
    },
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
    '@media (max-width: 480px)': {
      fontSize: '11px',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  drawer: {
    width: 'min(460px, 100vw)',
    '@media (max-width: 768px)': {
      width: '100vw',
    },
  },
  mobileNav: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: tokens.colorNeutralBackground1,
      borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
      paddingTop: '6px',
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      paddingLeft: '8px',
      paddingRight: '8px',
      zIndex: 100,
      boxShadow: tokens.shadow8,
    },
  },
  mobileNavItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    paddingTop: '6px',
    paddingBottom: '6px',
    paddingLeft: '4px',
    paddingRight: '4px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: '12px',
    fontWeight: tokens.fontWeightMedium,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    transition: 'all 0.15s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  mobileNavItemActive: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorBrandBackground2,
  },
})

function SubjectChip({ subject }: { subject?: Subject }) {
  return subject ? (
    <Badge
      appearance="tint"
      style={{
        backgroundColor: `var(--${subjectBg(subject.color)})`,
        color: `var(--${subjectFg(subject.color)})`,
      }}
    >
      {subject.name}
    </Badge>
  ) : null
}

function TaskCard({
  task,
  subject,
  toggle,
  edit,
  remove,
}: {
  task: Task
  subject?: Subject
  toggle: () => void
  edit: () => void
  remove: () => void
}) {
  const s = useStyles()
  const subDone = task.subtasks.filter((x) => x.done).length

  return (
    <Card
      className={s.card}
      style={{
        borderLeftColor: `var(--${
          subject ? subjectAccent(subject.color) : 'colorBrandStroke1'
        })`,
      }}
    >
      <div className={s.row}>
        <Checkbox
          shape="circular"
          checked={task.completed}
          onChange={toggle}
          aria-label="Toggle completion"
        />
        <div className={`${s.title} ${task.completed ? s.done : ''}`}>
          {task.title}
        </div>
        <Tooltip content="Edit" relationship="label">
          <Button
            appearance="subtle"
            size="small"
            icon={<Edit24Regular />}
            onClick={edit}
            aria-label="Edit task"
          />
        </Tooltip>
        <Tooltip content="Delete" relationship="label">
          <Button
            appearance="subtle"
            size="small"
            icon={<Delete24Regular />}
            onClick={remove}
            aria-label="Delete task"
          />
        </Tooltip>
      </div>
      <div className={s.meta}>
        <SubjectChip subject={subject} />
        <Badge
          color={
            task.priority === 'high'
              ? 'danger'
              : task.priority === 'medium'
              ? 'warning'
              : 'success'
          }
          icon={<Flag24Regular />}
        >
          {priorityLabel[task.priority]}
        </Badge>
        {task.dueAt && (
          <Badge
            icon={<CalendarLtr24Regular />}
            color={
              !task.completed && new Date(task.dueAt) < new Date()
                ? 'danger'
                : isToday(task.dueAt)
                ? 'warning'
                : 'informative'
            }
          >
            {dateLabel(task.dueAt)}
          </Badge>
        )}
      </div>
      {task.description && <div className={s.meta}>{task.description}</div>}
      <div className={s.footer}>
        {task.subtasks.length > 0 ? (
          <div style={{ minWidth: 110 }}>
            <small>
              {subDone}/{task.subtasks.length} subtasks
            </small>
            <ProgressBar value={subDone / task.subtasks.length} />
          </div>
        ) : (
          <span />
        )}
        {task.estimateMin ? (
          <Badge appearance="outline">{formatEstimate(task.estimateMin)}</Badge>
        ) : null}
      </div>
    </Card>
  )
}

function Editor({
  task,
  subjects,
  close,
  save,
}: {
  task?: Task
  subjects: Subject[]
  close: () => void
  save: (task: Task) => void
}) {
  const s = useStyles()
  const [draft, setDraft] = React.useState(task || makeTask(''))
  const subject = subjects.find((x) => x.id === draft.subjectId)

  return (
    <OverlayDrawer
      open
      position="end"
      className={s.drawer}
      onOpenChange={(_, d) => !d.open && close()}
    >
      <DrawerHeader>
        <DrawerHeaderNavigation>
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={close}
            aria-label="Close"
          />
        </DrawerHeaderNavigation>
        <Title3>{task ? 'Edit task' : 'New task'}</Title3>
      </DrawerHeader>
      <DrawerBody>
        <div className={s.form}>
          <Field
            label="Title"
            required
            validationState={draft.title.trim() ? 'none' : 'error'}
            validationMessage={draft.title.trim() ? '' : 'A title is required'}
          >
            <Input
              value={draft.title}
              maxLength={120}
              onChange={(_, d) => setDraft({ ...draft, title: d.value })}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={draft.description || ''}
              maxLength={500}
              onChange={(_, d) => setDraft({ ...draft, description: d.value })}
            />
            <small>{(draft.description || '').length}/500</small>
          </Field>
          <Field label="Subject">
            <Select
              value={subject?.id || ''}
              onChange={(_, d) =>
                setDraft({ ...draft, subjectId: d.value || undefined })
              }
            >
              <option value="">No subject</option>
              {subjects.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Due date">
            <Input
              type="datetime-local"
              value={
                draft.dueAt
                  ? new Date(draft.dueAt).toISOString().slice(0, 16)
                  : ''
              }
              onChange={(_, d) =>
                setDraft({
                  ...draft,
                  dueAt: d.value ? new Date(d.value).toISOString() : undefined,
                })
              }
            />
          </Field>
          <Field label="Priority">
            <Select
              value={draft.priority}
              onChange={(_, d) =>
                setDraft({ ...draft, priority: d.value as Priority })
              }
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </Field>
          <Button
            appearance="primary"
            disabled={!draft.title.trim()}
            onClick={() =>
              save({ ...draft, updatedAt: new Date().toISOString() })
            }
          >
            Save task
          </Button>
        </div>
      </DrawerBody>
    </OverlayDrawer>
  )
}

function Insights({ state }: { state: AppState }) {
  const s = useStyles()
  const complete = state.tasks.filter((x) => x.completed).length
  const overdue = state.tasks.filter(
    (x) => !x.completed && x.dueAt && new Date(x.dueAt) < new Date()
  ).length

  return (
    <>
      <div className={s.stats}>
        <div className={s.stat}>
          <div className={s.number}>
            {state.tasks.length
              ? Math.round((complete / state.tasks.length) * 100)
              : 0}
            %
          </div>
          <div className={s.statLabel}>Today's progress</div>
          <ProgressBar
            value={state.tasks.length ? complete / state.tasks.length : 0}
          />
        </div>
        <div className={s.stat}>
          <div className={s.number}>{streak(state.tasks)}</div>
          <div className={s.statLabel}>Completion streak</div>
        </div>
        <div className={s.stat}>
          <div className={s.number}>
            {formatEstimate(
              state.tasks.reduce((a, x) => a + (x.estimateMin || 0), 0)
            )}
          </div>
          <div className={s.statLabel}>Total planned</div>
        </div>
      </div>
      {overdue > 0 && (
        <MessageBar intent="warning">
          {overdue} overdue tasks need attention.{' '}
          <Button appearance="transparent">Move to today</Button>
        </MessageBar>
      )}
      <Title3 style={{ marginTop: tokens.spacingVerticalL, display: 'block' }}>
        Workload by priority
      </Title3>
      <Card className={s.card}>
        {(['high', 'medium', 'low'] as Priority[]).map((p) => (
          <div className={s.row} key={p}>
            <Badge
              color={
                p === 'high'
                  ? 'danger'
                  : p === 'medium'
                  ? 'warning'
                  : 'success'
              }
            >
              {priorityLabel[p]}
            </Badge>
            <ProgressBar
              style={{ flex: 1 }}
              value={
                state.tasks.length
                  ? state.tasks.filter((x) => x.priority === p).length /
                    state.tasks.length
                  : 0
              }
            />
          </div>
        ))}
      </Card>
    </>
  )
}

export function StudyFlow() {
  const s = useStyles()
  const theme = useTheme()
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [view, setView] = React.useState<'today' | 'tasks' | 'insights'>('today')
  const [status, setStatus] = React.useState('all')
  const [priority, setPriority] = React.useState('all')
  const [query, setQuery] = React.useState('')
  const [sort, setSort] = React.useState('due')
  const [quick, setQuick] = React.useState('')
  const [editor, setEditor] = React.useState<Task>()
  const [subjectDialog, setSubjectDialog] = React.useState(false)
  const [newSubject, setNewSubject] = React.useState('')
  const [nameDialog, setNameDialog] = React.useState(false)
  const [tempName, setTempName] = React.useState('')
  const [undo, setUndo] = React.useState<Task>()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const loaded = repository.load()
    dispatch({ type: 'hydrate', state: loaded })
    if (!loaded.userName || !loaded.userName.trim()) {
      setNameDialog(true)
    }
  }, [])

  React.useEffect(() => {
    if (mounted) repository.save(state)
  }, [state, mounted])

  const add = () => {
    const p = parseQuickAdd(quick, state.subjects)
    if (p.title) {
      dispatch({ type: 'upsert', task: makeTask(p.title, p) })
      setQuick('')
    }
  }

  const list = state.tasks
    .filter(
      (t) =>
        (status === 'all' ||
          (status === 'completed' ? t.completed : !t.completed)) &&
        (priority === 'all' || t.priority === priority) &&
        (!query || t.title.toLowerCase().includes(query.toLowerCase())) &&
        (view !== 'today' ||
          isToday(t.dueAt) ||
          (!t.dueAt && !t.completed))
    )
    .sort((a, b) =>
      sort === 'priority'
        ? { high: 0, medium: 1, low: 2 }[a.priority] -
          { high: 0, medium: 1, low: 2 }[b.priority]
        : sort === 'newest'
        ? b.createdAt.localeCompare(a.createdAt)
        : (a.dueAt ? new Date(a.dueAt).getTime() : Infinity) -
          (b.dueAt ? new Date(b.dueAt).getTime() : Infinity)
    )

  const active = state.tasks.filter((x) => !x.completed).length

  const settingsMenu = (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          className={s.nav}
          appearance="subtle"
          icon={<Settings24Regular />}
          aria-label="Settings"
        >
          Settings
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem onClick={() => theme.setMode('light')}>Light theme</MenuItem>
          <MenuItem onClick={() => theme.setMode('dark')}>Dark theme</MenuItem>
          <MenuItem onClick={() => theme.setMode('system')}>System theme</MenuItem>
          <MenuItem
            onClick={() =>
              theme.setPalette(theme.palette === 'indigo' ? 'teal' : 'indigo')
            }
          >
            Switch palette
          </MenuItem>
          <MenuItem
            onClick={() => {
              setTempName(state.userName || '')
              setNameDialog(true)
            }}
          >
            Change name
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  )

  return (
    <div className={s.root}>
      {/* Mobile Top App Bar */}
      <div className={s.mobileTopBar}>
        <div className={s.brand}>
          <div className={s.brandIcon}>
            <Sparkle24Regular />
          </div>
          <Title3>StudyFlow</Title3>
        </div>
        <div className={s.mobileActions}>
          <Button
            appearance="subtle"
            size="small"
            icon={<TaskListSquareLtr24Regular />}
            onClick={() => setSubjectDialog(true)}
            aria-label="Manage subjects"
          >
            Subjects
          </Button>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                size="small"
                icon={<Settings24Regular />}
                aria-label="Settings"
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => theme.setMode('light')}>Light</MenuItem>
                <MenuItem onClick={() => theme.setMode('dark')}>Dark</MenuItem>
                <MenuItem onClick={() => theme.setMode('system')}>System</MenuItem>
                <MenuItem
                  onClick={() =>
                    theme.setPalette(
                      theme.palette === 'indigo' ? 'teal' : 'indigo'
                    )
                  }
                >
                  Switch palette
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setTempName(state.userName || '')
                    setNameDialog(true)
                  }}
                >
                  Change name
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>

      <div className={s.layout}>
        {/* Desktop Sidebar Rail */}
        <aside className={s.rail}>
          <div className={s.brand}>
            <div className={s.brandIcon}>
              <Sparkle24Regular />
            </div>
            <Title3>StudyFlow</Title3>
          </div>
          <Button
            className={s.nav}
            appearance={view === 'today' ? 'primary' : 'subtle'}
            icon={<CalendarLtr24Regular />}
            onClick={() => setView('today')}
          >
            Today
          </Button>
          <Button
            className={s.nav}
            appearance={view === 'tasks' ? 'primary' : 'subtle'}
            icon={<TaskListSquareLtr24Regular />}
            onClick={() => setView('tasks')}
          >
            All tasks <Badge style={{ marginLeft: 'auto' }}>{active}</Badge>
          </Button>
          <Button
            className={s.nav}
            appearance={view === 'insights' ? 'primary' : 'subtle'}
            icon={<Lightbulb24Regular />}
            onClick={() => setView('insights')}
          >
            Insights
          </Button>
          <Button
            className={s.nav}
            appearance="subtle"
            icon={<TaskListSquareLtr24Regular />}
            onClick={() => setSubjectDialog(true)}
          >
            Subjects
          </Button>
          <div style={{ flex: 1 }} />
          {settingsMenu}
        </aside>

        {/* Main Content Area */}
        <main className={s.main}>
          <header className={s.header}>
            <div>
              <Title1 className={s.headerTitle}>
                {view === 'today'
                  ? `Good evening, ${state.userName?.trim() || 'Alex'}`
                  : view === 'tasks'
                  ? 'All tasks'
                  : 'Insights'}
              </Title1>
              <Subtitle1>
                {view === 'today'
                  ? 'A clear plan for your next study block.'
                  : 'Keep momentum across every course.'}
              </Subtitle1>
            </div>
            <Button
              appearance="primary"
              icon={<Add24Regular />}
              onClick={() => setEditor(makeTask(''))}
            >
              New task
            </Button>
          </header>

          {view === 'insights' ? (
            <Insights state={state} />
          ) : (
            <>
              <div className={s.command}>
                <Input
                  className={s.quick}
                  value={quick}
                  placeholder="Quick Add — fri 5pm !high #DBMS ~2h"
                  onChange={(_, d) => setQuick(d.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') add()
                  }}
                  contentAfter={
                    <Button appearance="transparent" onClick={add}>
                      Add
                    </Button>
                  }
                />
                <SearchBox
                  placeholder="Search"
                  value={query}
                  onChange={(_, d) => setQuery(d.value)}
                  style={{ flex: '1 1 180px' }}
                />
                <Select
                  value={sort}
                  onChange={(_, d) => setSort(d.value)}
                  style={{ minWidth: '130px' }}
                >
                  <option value="due">Due date</option>
                  <option value="priority">Priority</option>
                  <option value="newest">Newest</option>
                </Select>
              </div>

              <div className={s.filters}>
                <TabList
                  selectedValue={status}
                  onTabSelect={(_, d) => setStatus(String(d.value))}
                  size="small"
                >
                  <Tab value="all">All</Tab>
                  <Tab value="active">Active</Tab>
                  <Tab value="completed">Done</Tab>
                </TabList>
                <Select
                  value={priority}
                  onChange={(_, d) => setPriority(d.value)}
                  size="small"
                  style={{ maxWidth: '140px' }}
                >
                  <option value="all">All priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </div>

              <div className={s.stats}>
                <div className={s.stat}>
                  <div className={s.number}>{active}</div>
                  <div className={s.statLabel}>Active tasks</div>
                </div>
                <div className={s.stat}>
                  <div className={s.number}>
                    {formatEstimate(
                      state.tasks
                        .filter((x) => isToday(x.dueAt))
                        .reduce((a, x) => a + (x.estimateMin || 0), 0)
                    )}
                  </div>
                  <div className={s.statLabel}>Planned today</div>
                </div>
                <div className={s.stat}>
                  <div className={s.number}>{streak(state.tasks)}</div>
                  <div className={s.statLabel}>Day streak</div>
                </div>
              </div>

              {mounted ? (
                <div className={s.grid}>
                  {list.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      subject={state.subjects.find((x) => x.id === t.subjectId)}
                      toggle={() => dispatch({ type: 'toggle', id: t.id })}
                      edit={() => setEditor(t)}
                      remove={() => {
                        dispatch({ type: 'delete', id: t.id })
                        setUndo(t)
                        setTimeout(() => setUndo(undefined), 8000)
                      }}
                    />
                  ))}
                </div>
              ) : (
                <ProgressBar />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className={s.mobileNav} aria-label="Mobile Navigation">
        <button
          className={`${s.mobileNavItem} ${
            view === 'today' ? s.mobileNavItemActive : ''
          }`}
          onClick={() => setView('today')}
        >
          <CalendarLtr24Regular />
          <span>Today</span>
        </button>
        <button
          className={`${s.mobileNavItem} ${
            view === 'tasks' ? s.mobileNavItemActive : ''
          }`}
          onClick={() => setView('tasks')}
        >
          <TaskListSquareLtr24Regular />
          <span>Tasks ({active})</span>
        </button>
        <button
          className={`${s.mobileNavItem} ${
            view === 'insights' ? s.mobileNavItemActive : ''
          }`}
          onClick={() => setView('insights')}
        >
          <Lightbulb24Regular />
          <span>Insights</span>
        </button>
      </nav>

      {/* Task Editor Drawer */}
      {editor && (
        <Editor
          task={editor.id ? editor : undefined}
          subjects={state.subjects}
          close={() => setEditor(undefined)}
          save={(t) => {
            dispatch({ type: 'upsert', task: t })
            setEditor(undefined)
          }}
        />
      )}

      {/* Subject Management Dialog */}
      <Dialog
        open={subjectDialog}
        onOpenChange={(_, d) => setSubjectDialog(d.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Subjects</DialogTitle>
            <DialogContent
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacingVerticalM,
              }}
            >
              <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
                <Input
                  style={{ flex: 1 }}
                  value={newSubject}
                  placeholder="New subject"
                  onChange={(_, d) => setNewSubject(d.value)}
                />
                <Button
                  appearance="primary"
                  onClick={() => {
                    if (newSubject.trim()) {
                      dispatch({
                        type: 'addSubject',
                        subject: {
                          id: Math.random().toString(36),
                          name: newSubject.trim(),
                          color:
                            subjectColors[
                              state.subjects.length % subjectColors.length
                            ],
                        },
                      })
                      setNewSubject('')
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: tokens.spacingHorizontalS,
                  flexWrap: 'wrap',
                }}
              >
                {state.subjects.map((x) => (
                  <div key={x.id}>
                    <SubjectChip subject={x} />
                  </div>
                ))}
              </div>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Name Customization Dialog */}
      <Dialog
        open={nameDialog}
        onOpenChange={(_, d) => {
          if (!state.userName && !d.open) return
          setNameDialog(d.open)
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              {state.userName ? 'Change Name' : 'Welcome to StudyFlow'}
            </DialogTitle>
            <DialogContent
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacingVerticalM,
                paddingTop: tokens.spacingVerticalS,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: tokens.colorNeutralForeground2,
                }}
              >
                {state.userName
                  ? 'Update the name shown on your dashboard:'
                  : 'Please enter your name to personalize your study dashboard:'}
              </p>
              <Input
                autoFocus
                value={tempName}
                placeholder="Enter your name"
                onChange={(_, d) => setTempName(d.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tempName.trim()) {
                    dispatch({
                      type: 'setUserName',
                      name: tempName.trim(),
                    })
                    setNameDialog(false)
                  }
                }}
                contentAfter={
                  <Button
                    appearance="transparent"
                    disabled={!tempName.trim()}
                    onClick={() => {
                      if (tempName.trim()) {
                        dispatch({
                          type: 'setUserName',
                          name: tempName.trim(),
                        })
                        setNameDialog(false)
                      }
                    }}
                  >
                    Save
                  </Button>
                }
              />
              <Button
                appearance="primary"
                disabled={!tempName.trim()}
                onClick={() => {
                  if (tempName.trim()) {
                    dispatch({
                      type: 'setUserName',
                      name: tempName.trim(),
                    })
                    setNameDialog(false)
                  }
                }}
              >
                {state.userName ? 'Save' : 'Continue'}
              </Button>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Undo Notification */}
      {undo && (
        <MessageBar
          intent="info"
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '90vw',
            zIndex: 101,
          }}
        >
          Task deleted{' '}
          <Button
            appearance="transparent"
            onClick={() => {
              dispatch({ type: 'restore', task: undo })
              setUndo(undefined)
            }}
          >
            Undo
          </Button>
        </MessageBar>
      )}
    </div>
  )
}
