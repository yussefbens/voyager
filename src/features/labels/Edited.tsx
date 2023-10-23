import { CommentView, PostView } from "lemmy-js-client";
import { IonIcon, useIonAlert } from "@ionic/react";
import { pencil } from "ionicons/icons";
import { MouseEvent, useMemo } from "react";
import { formatRelative } from "./Ago";
import styled from "@emotion/styled";
import { fixLemmyDateString } from "../../helpers/date";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: inherit;

  margin: -3px;
  padding: 3px;
`;

interface EditedProps {
  item: PostView | CommentView;
  showDate?: true;
  className?: string;
}

export default function Edited({ item, showDate, className }: EditedProps) {
  const [present] = useIonAlert();
  const { t,i18n } = useTranslation();

  const edited = "comment" in item ? item.comment.updated : item.post.updated;

  const editedLabelIfNeeded = useMemo(() => {
    if (!edited) return;
    if (!showDate) return;

    const createdLabel = formatRelative(item.counts.published);
    const editedLabel = formatRelative(edited);

    if (createdLabel === editedLabel) return;

    return editedLabel;
  }, [edited, item.counts.published, showDate]);

  if (!edited) return;

  function presentEdited(e: MouseEvent) {
    e.stopPropagation();

    if (!edited) return;

    present({
      header: `${t('edited')} ${formatRelative(edited)} ${t('ago')}`,
      message: `${t('lastEdited')} ${new Date(
        fixLemmyDateString(edited),
      ).toLocaleTimeString()}`,
      buttons: [t('ok')],
    });
  }

  return (
    <Container onClick={presentEdited}>
      <IonIcon icon={pencil} className={className} />
      {editedLabelIfNeeded}
    </Container>
  );
}
