import { useTranslation } from "react-i18next";
import { IonActionSheet, IonAlert } from "@ionic/react";
import { CommentView, PostView, PrivateMessageView } from "lemmy-js-client";
import { forwardRef, useImperativeHandle, useState } from "react";
import useClient from "../../helpers/useClient";
import { useAppSelector } from "../../store";
import { jwtSelector } from "../auth/authSlice";
import { IonAlertCustomEvent, OverlayEventDetail } from "@ionic/core";
import useAppToast from "../../helpers/useAppToast";

export type ReportableItem = CommentView | PostView | PrivateMessageView;

export type ReportHandle = {
  present: (item: ReportableItem) => void;
};

export const Report = forwardRef<ReportHandle>(function Report(_, ref) {
  const jwt = useAppSelector(jwtSelector);
  const presentToast = useAppToast();
  const [item, setItem] = useState<ReportableItem | undefined>();
  const [reportOptionsOpen, setReportOptionsOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const client = useClient();
  const { t,i18n } = useTranslation();

  const type = (() => {
    if (!item) return;

    if ("comment" in item) return t('comment');
    if ("post" in item) return t('post');
    if ("private_message" in item) return t('privateMessage');
  })();

  useImperativeHandle(ref, () => ({
    present: (item: ReportableItem) => {
      setItem(item);
      setReportOptionsOpen(true);
    },
  }));

  async function submitReport(reason: string) {
    if (!item || !jwt) return;

    try {
      if ("comment" in item) {
        await client.createCommentReport({
          reason,
          comment_id: item.comment.id,
          auth: jwt,
        });
      } else if ("post" in item) {
        await client.createPostReport({
          reason,
          post_id: item.post.id,
          auth: jwt,
        });
      } else if ("private_message" in item) {
        await client.createPrivateMessageReport({
          reason,
          private_message_id: item.private_message.id,
          auth: jwt,
        });
      }
    } catch (error) {
      let errorDetail = t('tryAgain');

      if (error === "couldnt_create_report") {
        errorDetail = t('alreadyReported');
      }

      presentToast({
        message: `${t('failedToReport')} ${type?.toLowerCase()}. ${errorDetail}`,
        color: "danger",
      });

      throw error;
    }

    presentToast({
      message: `${type} reported!`,
    });
  }

  const submitCustomReason = async function (
    e: IonAlertCustomEvent<OverlayEventDetail>,
  ) {
    setCustomOpen(false);

    if (e.detail.role === "cancel" || e.detail.role === "backdrop") return;

    await submitReport(e.detail.data.values.reason);
    setCustomOpen(false);
  };

  return (
    <>
      <IonActionSheet
        cssClass="left-align-buttons"
        isOpen={reportOptionsOpen}
        onDidDismiss={() => setReportOptionsOpen(false)}
        onWillDismiss={async (e) => {
          if (!e.detail.data) return;

          if (e.detail.data === "other") {
            setReportOptionsOpen(false);
            setCustomOpen(true);
            return;
          }

          await submitReport(e.detail.data);
          setReportOptionsOpen(false);
        }}
        header={`${t('report')} ${type}`}
        buttons={[
          {
            text: t('spamOr'),
            data: "Spam or Abuse",
          },
          {
            text: t('customResponse'),
            data: "other",
          },
          {
            text: t('cancel'),
            role: "cancel",
          },
        ]}
      />
      <IonAlert
        isOpen={customOpen}
        header={t('customReportReason')}
        onDidDismiss={submitCustomReason}
        inputs={[
          {
            name: "reason",
            placeholder: t('customReportDetails'),
          },
        ]}
        buttons={[{ text: t('ok') }, { text: t('cancel'), role: "cancel" }]}
      />
    </>
  );
});
