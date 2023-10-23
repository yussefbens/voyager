import { useTranslation } from "react-i18next";
import { CommentView } from "lemmy-js-client";
import { Container, CustomIonItem, PositionedContainer } from "./Comment";
import styled from "@emotion/styled";
import CommentHr from "./CommentHr";
import { useContext, useState } from "react";
import { CommentsContext } from "./CommentsContext";
import useClient from "../../helpers/useClient";
import { IonIcon, IonSpinner } from "@ionic/react";
import { chevronDown } from "ionicons/icons";
import AnimateHeight from "react-animate-height";
import { MAX_DEFAULT_COMMENT_DEPTH } from "../../helpers/lemmy";
import { css } from "@emotion/react";
import useAppToast from "../../helpers/useAppToast";

const MoreRepliesBlock = styled.div<{ hidden: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  color: var(--ion-color-primary);

  ${({ hidden }) =>
    hidden &&
    css`
      opacity: 0;
    `}
`;

const ChevronIcon = styled(IonIcon)`
  font-size: 1rem;
`;

const StyledIonSpinner = styled(IonSpinner)`
  width: 1.25rem;
  opacity: 0.6;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

interface CommentExpanderProps {
  depth: number;
  comment: CommentView;
  missing: number;
  collapsed?: boolean;
}

export default function CommentExpander({
  depth,
  comment,
  missing,
  collapsed,
}: CommentExpanderProps) {
  const presentToast = useAppToast();
  const { appendComments } = useContext(CommentsContext);
  const client = useClient();
  const [loading, setLoading] = useState(false);
  const { t,i18n } = useTranslation();

  async function fetchChildren() {
    if (loading) return;

    setLoading(true);

    let response;

    try {
      response = await client.getComments({
        parent_id: comment.comment.id,
        type_: "All",
        max_depth: Math.max((depth += 2), MAX_DEFAULT_COMMENT_DEPTH),
      });
    } catch (error) {
      presentToast({
        message:t("problemFetchingComments"),
        color: "danger",
      });
      throw error;
    } finally {
      setLoading(false);
    }

    if (response.comments.length === 0) {
      presentToast({
        message: `${t("zeroComments")} ${missing}`,
        color: "danger",
      });
      return;
    }

    appendComments(response.comments);
  }

  return (
    <AnimateHeight duration={200} height={collapsed ? 0 : "auto"}>
      <CommentHr depth={depth - 1} />
      <CustomIonItem href={undefined} onClick={fetchChildren}>
        <PositionedContainer depth={depth || 0} highlighted={false}>
          <Container depth={depth || 0} hidden={loading}>
            <MoreRepliesBlock hidden={loading}>
              {missing} {t('more')} {missing === 1 ? t('replyLower') : t('replies')}
              <ChevronIcon icon={chevronDown} />
            </MoreRepliesBlock>
            {loading && <StyledIonSpinner />}
          </Container>
        </PositionedContainer>
      </CustomIonItem>
    </AnimateHeight>
  );
}
