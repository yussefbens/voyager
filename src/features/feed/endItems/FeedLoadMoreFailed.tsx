import { useTranslation } from "react-i18next";
import { Container } from "./EndPost";

interface FeedLoadMoreFailedProps {
  fetchMore: () => void;
  loading: boolean;
}

export default function FeedLoadMoreFailed({
  fetchMore,
  loading,
}: FeedLoadMoreFailedProps) {

  const { t,i18n } = useTranslation();

  return (
    <Container onClick={fetchMore}>
      Failed to load more posts. {loading ? t("loading") : t("tryAgain")}
    </Container>
  );
}
