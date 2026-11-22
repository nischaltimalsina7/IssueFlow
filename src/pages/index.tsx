
/**
 * IssueFlow public landing page.
 *
 * This page introduces the application.
 * It stays outside the authenticated app because
 * visitors should be able to see it without logging in.
 */

// Link allows navigation between React pages.
import { Link } from 'react-router-dom'

// Seo manages the page's search engine metadata.
import { Seo } from '../components/Seo'
import { seo } from '../seo'

// This function defines our landing page.
export default function Landing() {
  return (
    <>
      {/* Add search engine metadata for the homepage. */}
      <Seo {...seo} path="/" />

      {/* Main container that centers the page content. */}
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">

        {/* Display the application name. */}
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
          IssueFlow
        </p>

        {/* Main heading visible to visitors. */}
        <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Track bugs. Collaborate better. Ship faster.
        </h1>

        {/* Explain what IssueFlow does. */}
        <p className="mb-8 max-w-xl text-lg text-muted-foreground">
          IssueFlow helps development teams organize projects,
          report bugs, assign tasks, and track progress in one place.
        </p>

        {/* Navigate to the main application. */}
        <Link
          to="/home"
          className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open IssueFlow
        </Link>

        {/* Small footer describing the application. */}
        <p className="mt-12 text-sm text-muted-foreground">
          Built with DeepSpace
        </p>
      </main>
    </>
  )
}

