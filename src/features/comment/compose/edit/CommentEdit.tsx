import { useTranslation } from "react-i18next";
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import { Comment } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Centered, Spinner } from "../../../auth/Login";
import { jwtSelector } from "../../../auth/authSlice";
import { editComment } from "../../commentSlice";
import { DismissableProps } from "../../../shared/DynamicDismissableModal";
import CommentContent from "../shared";
import useAppToast from "../../../../helpers/useAppToast";

type CommentEditingProps = DismissableProps & {
  item: Comment;
};

export default function CommentEdit({
  item,
  setCanDismiss,
  dismiss,
}: CommentEditingProps) {
  const dispatch = useAppDispatch();
  const [replyContent, setReplyContent] = useState(item.content);
  const jwt = useAppSelector(jwtSelector);
  const presentToast = useAppToast();
  const [loading, setLoading] = useState(false);
  const isSubmitDisabled =
    !replyContent.trim() || item.content === replyContent || loading;

  useEffect(() => {
    setCanDismiss(item.content === replyContent);
  }, [replyContent, item, setCanDismiss]);

  async function submit() {
    if (isSubmitDisabled) return;
    if (!jwt) return;

    setLoading(true);

    try {
      await dispatch(editComment(item.id, replyContent));
    } catch (error) {
      presentToast({
        message: t("problemSaving"),
        color: "danger",
        fullscreen: true,
      });

      throw error;
    } finally {
      setLoading(false);
    }

    presentToast({
      message: t("commentEdited"),
      color: "success",
    });

    setCanDismiss(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    dismiss();
  }

  const { t,i18n } = useTranslation();

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss()}>
              {t('cancel')}
            </IonButton>
          </IonButtons>
          <IonTitle>
            <Centered>
              {t('editComment')}
              {loading && <Spinner color="dark" />}
            </Centered>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              strong={true}
              type="submit"
              disabled={isSubmitDisabled}
              onClick={submit}
            >
              {t('save')}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <CommentContent
        text={replyContent}
        setText={setReplyContent}
        onSubmit={submit}
      />
    </>
  );
}
