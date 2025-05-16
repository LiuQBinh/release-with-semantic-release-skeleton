import { Button } from '@sec/gui-seconder/components/shadcn/button'
import { ToastDemo } from '@/components/pages/ToastDemo'

async function withDelay<T>(
  promise: Promise<T>,
  delay: number
): Promise<T> {
  // Ensure we throw if this throws
  const ret = await promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ret)
    }, delay)
  })
}

export async function DynamicContent() {
  const content = await withDelay(
    fetch('https://jsonplaceholder.typicode.com/posts/1', {
      cache: 'no-store'
    }).then(res => res.json()),
    500
  )

  return (
    <div>
      <div className="p-4 border rounded-lg w-[600px] h-[300px]">
        <div className="space-y-4">
          <div className="prose dark:prose-invert">
            {content?.title || 'No content'}
          </div>
          <Button variant="outline">
            Edit Content
          </Button>
        </div>
      </div>
      <ToastDemo />
    </div>
  )
}
