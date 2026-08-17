import { TagsTable } from "./tags-table"

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Administración de Tags
        </h1>

        <p className="text-muted-foreground">
          Gestiona los tags del sistema
        </p>
      </div>

      <TagsTable />
    </div>
  )
}