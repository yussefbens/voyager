import { IonIcon, useIonActionSheet, useIonRouter } from "@ionic/react";
import {
  bookmarkOutline,
  copyOutline,
  downloadOutline,
  earthOutline,
  ellipsisHorizontal,
  peopleOutline,
  personOutline,
  shareOutline,
} from "ionicons/icons";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import { getHandle } from "../../helpers/lemmy";
import { PostView } from "lemmy-js-client";
import { PageContext } from "../auth/PageContext";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { savePost } from "../post/postSlice";
import { saveError } from "../../helpers/toastMessages";
import { Browser } from "@capacitor/browser";
import { ActionButton } from "../post/actions/ActionButton";
import { StashMedia } from "capacitor-stash-media";
import { isNative } from "../../helpers/device";
import { Share } from "@capacitor/share";
import useAppToast from "../../helpers/useAppToast";
import { useTranslation } from "react-i18next";

interface GalleryMoreActionsProps {
  post: PostView;
  imgSrc: string;
}

export default function GalleryMoreActions({
  post,
  imgSrc,
}: GalleryMoreActionsProps) {
  const router = useIonRouter();
  const [presentActionSheet] = useIonActionSheet();
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const { t,i18n } = useTranslation();

  const { presentLoginIfNeeded } = useContext(PageContext);
  const presentToast = useAppToast();
  const dispatch = useAppDispatch();

  const postSavedById = useAppSelector((state) => state.post.postSavedById);
  const mySaved = postSavedById[post.post.id] ?? post.saved;

  function openActions() {
    presentActionSheet({
      cssClass: "left-align-buttons",
      buttons: [
        {
          text: t('share'),
          icon: shareOutline,
          handler: () => {
            (async () => {
              if (!isNative()) {
                Share.share({ url: imgSrc });
                return;
              }

              try {
                await StashMedia.shareImage({
                  url: imgSrc,
                  title: post.post.name,
                });
              } catch (error) {
                presentToast({
                  message: t('error-sharing-photo'),
                  color: "danger",
                  position: "top",
                  fullscreen: true,
                });

                throw error;
              }
            })();
          },
        },
        {
          text: t('save-image'),
          icon: downloadOutline,
          handler: () => {
            (async () => {
              try {
                await StashMedia.savePhoto({ url: imgSrc });
              } catch (error) {
                presentToast({
                  message: t('error-saving-photo-to-device'),
                  color: "danger",
                  position: "top",
                  fullscreen: true,
                });

                throw error;
              }

              presentToast({
                message: t('photo-saved'),
                color: "success",
                position: "top",
                fullscreen: true,
              });
            })();
          },
        },
        {
          text: t('copy-image'),
          icon: copyOutline,
          handler: () => {
            (async () => {
              try {
                await StashMedia.copyPhotoToClipboard({ url: imgSrc });
              } catch (error) {
                presentToast({
                  message: t('error-copying-photo-to-clipboard'),
                  color: "danger",
                  position: "top",
                  fullscreen: true,
                });

                throw error;
              }

              presentToast({
                message: t('photo-copied-to-clipboard'),
                color: "success",
                position: "top",
                fullscreen: true,
              });
            })();
          },
        },
        {
          text: t('open-in-browser'),
          icon: earthOutline,
          handler: () => {
            Browser.open({ url: post.post.ap_id });
          },
        },
        {
          text: t('save'),
          icon: bookmarkOutline,
          handler: () => {
            (async () => {
              if (presentLoginIfNeeded()) return;

              try {
                await dispatch(savePost(post.post.id, !mySaved));
              } catch (error) {
                presentToast(saveError);

                throw error;
              }
            })();
          },
        },
        {
          text: getHandle(post.creator),
          icon: personOutline,
          handler: () => {
            router.push(
              buildGeneralBrowseLink(`/u/${getHandle(post.creator)}`),
            );
          },
        },
        {
          text: getHandle(post.community),
          icon: peopleOutline,
          handler: () => {
            router.push(
              buildGeneralBrowseLink(`/c/${getHandle(post.community)}`),
            );
          },
        },
        {
          text: t('cancel'),
          role: "cancel",
        },
      ],
    });
  }

  return (
    <ActionButton onClick={openActions}>
      <IonIcon icon={ellipsisHorizontal} />
    </ActionButton>
  );
}
