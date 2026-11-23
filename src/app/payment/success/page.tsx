import { Suspense } from "react";
import PaymentSuccessStatus from "./PaymentSuccessStatus";

type PageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

async function PaymentSuccessContent({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;

  return <PaymentSuccessStatus sessionId={sessionId ?? ""} />;
}

export default function PaymentSuccessPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <main
          role="status"
          className="flex min-h-[75vh] items-center justify-center bg-background px-4"
        >
          <div className="w-full max-w-lg rounded-2xl border bg-card p-10 text-center shadow-sm">
            <p className="text-muted-foreground">Loading payment status…</p>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent searchParams={props.searchParams} />
    </Suspense>
  );
}
