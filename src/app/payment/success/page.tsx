import PaymentSuccessStatus from "./PaymentSuccessStatus";

type PageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;

  return <PaymentSuccessStatus sessionId={sessionId ?? ""} />;
}
