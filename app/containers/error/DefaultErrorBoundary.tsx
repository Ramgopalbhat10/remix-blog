import { Container, Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import { Header } from "~/layouts/Header";

export function DefaultErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <Header title="MRGB" />
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
