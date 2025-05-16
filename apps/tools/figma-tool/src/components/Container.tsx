import { h } from "preact";
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 16,
      }}>
      {children}
    </div>
  );
}
