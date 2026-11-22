
/**
 * IssueFlow Dashboard
 *
 * This page allows users to create and view bug reports.
 * Issues are saved in the DeepSpace database.
 * The dashboard updates automatically when records change.
 */

// Import React tools for form state and form submission.
import { useState, type FormEvent } from 'react'

// Import authentication and database hooks from DeepSpace.
import {
  useAuthProfileReady,
  useQuery,
  useMutations,
} from 'deepspace'

// Define the three possible issue statuses.
type IssueStatus = 'To Do' | 'In Progress' | 'Done'

// Define the three possible priority levels.
type IssuePriority = 'Low' | 'Medium' | 'High'

// Describe the information stored inside an issue.
type Issue = {
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  createdBy: string
}

// Define the columns displayed on our dashboard.
const statuses: IssueStatus[] = [
  'To Do',
  'In Progress',
  'Done',
]

// Main React component for the dashboard.
export default function HomePage() {
  // Get the currently authenticated user.
  const { isSignedIn, user } = useAuthProfileReady({
    requireUser: true,
  })

  // Read issues from the DeepSpace database.
  // Each record contains recordId, data, and metadata.
  const {
    records: issues,
    status: queryStatus,
    error: queryError,
  } = useQuery<Issue>('issues')

  // Get the database function for saving new issues.
  // ready tells us whether the connection can accept writes.
  // Get functions for creating and updating issues.
  // Get the functions needed to create, update, and delete issues.
  const {
  createConfirmed, // Creates a new issue.
  putConfirmed,    // Updates an existing issue.
  removeConfirmed, // Deletes an existing issue.
  ready,           // Checks whether the database is ready.
  } = useMutations<Issue>('issues')

  // Store the values entered into the issue form.
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [priority, setPriority] =
    useState<IssuePriority>('Medium')

  const [issueStatus, setIssueStatus] =
    useState<IssueStatus>('To Do')

  // Track whether the creation form is visible.
  const [showForm, setShowForm] = useState(false)

  // Track whether an issue is currently being saved.
  const [isSaving, setIsSaving] = useState(false)

  // Store error messages to display to the user.
  const [formError, setFormError] = useState('')

  // Store the ID of the issue currently being edited.
// null means no issue is being edited.
const [editingIssueId, setEditingIssueId] =
  useState<string | null>(null)

// Store the updated issue information.
const [editTitle, setEditTitle] = useState('')
const [editDescription, setEditDescription] = useState('')
const [editPriority, setEditPriority] =
  useState<IssuePriority>('Medium')


  /**
   * Save a new issue when the user submits the form.
   */
  async function handleCreateIssue(
    event: FormEvent<HTMLFormElement>
  ) {
    // Prevent the browser from refreshing the page.
    event.preventDefault()

    // Reject an empty issue title.
    if (!title.trim()) {
      setFormError('Please enter an issue title.')
      return
    }

    // Require authentication and a ready database connection.
    if (!ready || !isSignedIn || !user) {
      setFormError('Please sign in and wait for the database.')
      return
    }

    // Show the saving state.
    setIsSaving(true)
    setFormError('')

    try {
      // Save the issue and wait for server confirmation.
      await createConfirmed({
        title: title.trim(),
        description: description.trim(),
        status: issueStatus,
        priority: priority,
        createdBy: user.id,
      })

      // Clear the form after a successful save.
      setTitle('')
      setDescription('')
      setPriority('Medium')
      setIssueStatus('To Do')

      // Close the form.
      setShowForm(false)
    } catch (error) {
      // Display an error if the database rejects the write.
      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to save the issue.'
      )
    } finally {
      // Re-enable the save button.
      setIsSaving(false)
    }
  }
/**
 * Update an existing issue's status.
 *
 * recordId identifies which issue we want to update.
 * newStatus is the status selected by the user.
 */
async function handleStatusChange(
  recordId: string,
  newStatus: IssueStatus
) {
  // Make sure the database is ready.
  if (!ready) {
    alert('Database is not ready. Please try again.')
    return
  }

  try {
    // Update only the status field of the existing issue.
    // Wait until DeepSpace confirms the change.
    await putConfirmed(recordId, {
      status: newStatus,
    })
  } catch (error) {
    // Show a message if updating the issue fails.
    alert(
      error instanceof Error
        ? error.message
        : 'Unable to update issue status.'
    )
  }
}

/**
 * Start editing an existing issue.
 *
 * This copies the current issue information into
 * our edit form so users can modify it.
 */
function handleStartEdit(
  recordId: string,
  issue: Issue
) {
  // Remember which database record is being edited.
  setEditingIssueId(recordId)

  // Fill the edit fields with the existing values.
  setEditTitle(issue.title)
  setEditDescription(issue.description)
  setEditPriority(issue.priority)
}

/**
 * Save the edited issue to the DeepSpace database.
 */
async function handleSaveEdit() {
  // Make sure an issue is selected and the database is ready.
  if (!editingIssueId || !ready) {
    return
  }

  // Prevent saving an issue without a title.
  if (!editTitle.trim()) {
    alert('Issue title cannot be empty.')
    return
  }

  try {
    // Update the existing issue.
    // Only these fields change; status remains unchanged.
    await putConfirmed(editingIssueId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
    })

    // Close the edit form after a successful save.
    setEditingIssueId(null)
  } catch (error) {
    // Display an error if the update fails.
    alert(
      error instanceof Error
        ? error.message
        : 'Unable to update the issue.'
    )
  }
}

/**
 * Delete an existing issue from DeepSpace.
 *
 * recordId identifies the issue being deleted.
 */
async function handleDeleteIssue(recordId: string) {
  // Ask the user to confirm before deleting.
  const confirmed = window.confirm(
    'Are you sure you want to delete this issue?'
  )

  // If the user clicks Cancel, stop.
  if (!confirmed) {
    return
  }

  // Check whether the database is ready.
  if (!ready) {
    alert('Database is not ready. Please try again.')
    return
  }

  try {
    // Delete the record and wait for server confirmation.
    await removeConfirmed(recordId)

    // Close the edit form if the deleted issue was being edited.
    if (editingIssueId === recordId) {
      setEditingIssueId(null)
    }
  } catch (error) {
    // Show an error if deletion is not permitted or fails.
    alert(
      error instanceof Error
        ? error.message
        : 'Unable to delete the issue.'
    )
  }
}


  return (
    <main className="min-h-screen bg-background p-6 text-foreground">

      {/* Dashboard heading and Create Issue button. */}
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold">
            IssueFlow Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Track issues and manage development tasks.
          </p>

          {/* Show the signed-in user's information. */}
          {isSignedIn && user && (
            <p className="mt-3 text-sm text-muted-foreground">
              Welcome, {user.name ?? user.email}
            </p>
          )}
        </div>

        {/* Open or close the Create Issue form. */}
        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm)
            setFormError('')
          }}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
        >
          {showForm ? 'Cancel' : '+ Create Issue'}
        </button>

      </header>

      {/* Display the form only when showForm is true. */}
      {showForm && (
        <form
          onSubmit={handleCreateIssue}
          className="mb-8 space-y-4 rounded-xl border border-border bg-card p-5"
        >

          <h2 className="text-xl font-semibold">
            Create New Issue
          </h2>

          {/* Issue title field. */}
          <div>
            <label
              htmlFor="issue-title"
              className="mb-1 block text-sm"
            >
              Title
            </label>

            <input
              id="issue-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Fix login page error"
              required
              maxLength={150}
              className="w-full rounded-lg border border-input bg-background p-3"
            />
          </div>

          {/* Issue description field. */}
          <div>
            <label
              htmlFor="issue-description"
              className="mb-1 block text-sm"
            >
              Description
            </label>

            <textarea
              id="issue-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the bug or development task..."
              rows={3}
              className="w-full rounded-lg border border-input bg-background p-3"
            />
          </div>

          {/* Priority selection field. */}
          <div>
            <label
              htmlFor="issue-priority"
              className="mb-1 block text-sm"
            >
              Priority
            </label>

            <select
              id="issue-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as IssuePriority)
              }
              className="w-full rounded-lg border border-input bg-background p-3"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status selection field. */}
          <div>
            <label
              htmlFor="issue-status"
              className="mb-1 block text-sm"
            >
              Status
            </label>

            <select
              id="issue-status"
              value={issueStatus}
              onChange={(event) =>
                setIssueStatus(event.target.value as IssueStatus)
              }
              className="w-full rounded-lg border border-input bg-background p-3"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Display errors when an issue cannot be saved. */}
          {formError && (
            <p role="alert" className="text-sm text-red-500">
              {formError}
            </p>
          )}

          {/* Submit the new issue to the database. */}
          <button
            type="submit"
            disabled={!ready || isSaving || !isSignedIn}
            className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground disabled:opacity-50"
          >
            {isSaving
              ? 'Saving...'
              : !ready
                ? 'Connecting...'
                : 'Save Issue'}
          </button>

        </form>
      )}

      {/* Show a message while issues are loading. */}
      {queryStatus === 'loading' && (
        <p className="mb-4 text-muted-foreground">
          Loading issues...
        </p>
      )}

      {/* Display any database reading errors. */}
      {queryStatus === 'error' && (
        <p role="alert" className="mb-4 text-red-500">
          Unable to load issues: {queryError ?? 'Unknown error'}
        </p>
      )}


{/* Dashboard statistics calculated from saved issues. */}
<section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

  {/* Total number of issues. */}
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="text-sm text-muted-foreground">
      Total Issues
    </p>
    <p className="mt-2 text-3xl font-bold">
      {issues.length}
    </p>
  </div>

  {/* Issues that have not been started. */}
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="text-sm text-muted-foreground">
      To Do
    </p>
    <p className="mt-2 text-3xl font-bold">
      {issues.filter((issue) => issue.data.status === 'To Do').length}
    </p>
  </div>

  {/* Issues currently being worked on. */}
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="text-sm text-muted-foreground">
      In Progress
    </p>
    <p className="mt-2 text-3xl font-bold">
      {issues.filter((issue) => issue.data.status === 'In Progress').length}
    </p>
  </div>

  {/* Issues that have been completed. */}
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="text-sm text-muted-foreground">
      Completed
    </p>
    <p className="mt-2 text-3xl font-bold">
      {issues.filter((issue) => issue.data.status === 'Done').length}
    </p>
  </div>

</section>


      {/* Create the three issue board columns. */}
      <section className="grid gap-6 md:grid-cols-3">

        {statuses.map((status) => {

          // Filter records by their status.
          // DeepSpace stores issue fields inside record.data.
          const columnIssues = issues.filter(
            (issue) => issue.data.status === status
          )

          return (
            <div
              key={status}
              className="rounded-xl border border-border bg-card p-4"
            >

              {/* Display the status and number of issues. */}
              <h2 className="mb-4 text-lg font-semibold">
                {status} ({columnIssues.length})
              </h2>

              {/* Display a message if this column is empty. */}
              {queryStatus === 'ready' && columnIssues.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No issues yet.
                </p>
              )}

              {/* Display each issue inside this column. */}
              <div className="space-y-3">

                {columnIssues.map((issue) => (
                  <article
                    // recordId uniquely identifies the database record.
                    key={issue.recordId}
                    className="rounded-lg border border-border bg-background p-4"
                  >

                    {/* Read the issue title from its data object. */}
                    <h3 className="font-medium">
                      {issue.data.title}
                    </h3>

                    {/* Show the description if one exists. */}
                    {issue.data.description && (
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                        {issue.data.description}
                      </p>
                    )}

                    
                  {/* Display priority using a colored badge. */}
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        issue.data.priority === 'High'
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                          : issue.data.priority === 'Medium'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                            : 'bg-green-500/15 text-green-700 dark:text-green-400'
                      }`}
                    >
                      {issue.data.priority} Priority
                    </span>
                  </div>



{/* Show the Edit button when this issue is not being edited. */}
{editingIssueId !== issue.recordId && (
  <button
    type="button"
    onClick={() => {
      // Load this issue's existing data into the edit form.
      handleStartEdit(issue.recordId, issue.data)
    }}
    className="mt-3 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
  >
    Edit Issue
  </button>
)}


{/* Delete button for the current issue. */}
<button
  type="button"
  // Call the delete function using this issue's unique ID.
  onClick={() => void handleDeleteIssue(issue.recordId)}

  // Disable the button when the database is not ready.
  disabled={!ready}

  // Use red text to indicate a destructive action.
  className="ml-2 mt-3 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 disabled:opacity-50"
>
  Delete Issue
</button>


{/* Show the edit form only for the selected issue. */}
{editingIssueId === issue.recordId && (
  <div className="mt-4 space-y-3 rounded-lg border border-border p-3">

    <h4 className="font-semibold">Edit Issue</h4>

    {/* Edit the issue title. */}
    <div>
      <label
        htmlFor={`edit-title-${issue.recordId}`}
        className="mb-1 block text-sm"
      >
        Title
      </label>
      <input
        id={`edit-title-${issue.recordId}`}
        value={editTitle}
        onChange={(event) => setEditTitle(event.target.value)}
        className="w-full rounded-lg border border-input bg-background p-2 text-sm"
      />
    </div>

    {/* Edit the issue description. */}
    <div>
      <label
        htmlFor={`edit-description-${issue.recordId}`}
        className="mb-1 block text-sm"
      >
        Description
      </label>
      <textarea
        id={`edit-description-${issue.recordId}`}
        value={editDescription}
        onChange={(event) => setEditDescription(event.target.value)}
        rows={3}
        className="w-full rounded-lg border border-input bg-background p-2 text-sm"
      />
    </div>

    {/* Edit the priority level. */}
    <div>
      <label
        htmlFor={`edit-priority-${issue.recordId}`}
        className="mb-1 block text-sm"
      >
        Priority
      </label>
      <select
        id={`edit-priority-${issue.recordId}`}
        value={editPriority}
        onChange={(event) =>
          setEditPriority(event.target.value as IssuePriority)
        }
        className="w-full rounded-lg border border-input bg-background p-2 text-sm"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>

    {/* Save or cancel the edit. */}
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => void handleSaveEdit()}
        disabled={!ready}
        className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        Save Changes
      </button>

      <button
        type="button"
        onClick={() => setEditingIssueId(null)}
        className="rounded-lg border border-border px-3 py-2 text-sm"
      >
        Cancel
      </button>
    </div>
  </div>
)}



{/* Allow users to change an issue's status. */}
<div className="mt-4">
  {/* Label for the status dropdown. */}
  <label
    htmlFor={`status-${issue.recordId}`}
    className="mb-2 block text-sm font-medium"
  >
    Change Status
  </label>

  {/* Display the current status and available options. */}
  <select
    id={`status-${issue.recordId}`}
    value={issue.data.status}
    disabled={!ready}
    onChange={(event) => {
      // Get the status selected by the user.
      const newStatus = event.target.value as IssueStatus

      // Save the new status to the DeepSpace database.
      void handleStatusChange(issue.recordId, newStatus)
    }}
    className="w-full rounded-lg border border-input bg-background p-2 text-sm disabled:opacity-50"
  >
    {/* Generate one option for each allowed status. */}
    {statuses.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>


                  </article>
                ))}

              </div>
            </div>
          )
        })}

      </section>
    </main>
  )
}
