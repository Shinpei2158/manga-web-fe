import { redirect } from "next/navigation";

export default async function ModerationChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;

  redirect(
    `/admin/moderation/workspace?chapterId=${encodeURIComponent(chapterId)}`,
  );
}
