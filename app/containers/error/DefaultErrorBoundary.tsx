import { Container, Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

export function DefaultErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <main>
        <Container size="sm">
          <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
            Something terrible happened! {error.message}
          </Alert>
        </Container>
      </main>
    </>
  );
}
