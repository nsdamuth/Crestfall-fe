import StoryChatPage from "./StoryChatPage";

export default async function StoryChatV2Page({ params }) {
  const { id } = await params;

  return <StoryChatPage id={id} />;
}
