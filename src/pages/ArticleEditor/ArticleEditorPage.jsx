import AuthGate from '../../components/Auth/AuthGate.jsx'
import ArticleEditor from '../../components/ArticleEditor/ArticleEditor.jsx'

export default function ArticleEditorPage() {
  return (
    <AuthGate>
      <ArticleEditor />
    </AuthGate>
  )
}
