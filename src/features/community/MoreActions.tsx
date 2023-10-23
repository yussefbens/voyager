import { useTranslation } from "react-i18next";
import {
  IonActionSheet,
  IonButton,
  IonIcon,
  useIonActionSheet,
  useIonRouter,
} from "@ionic/react";
import {
  createOutline,
  ellipsisHorizontal,
  heartDislikeOutline,
  heartOutline,
  starOutline,
  starSharp,
  removeCircleOutline,
  tabletPortraitOutline,
  eyeOffOutline,
} from "ionicons/icons";
import { useContext, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  addFavorite,
  blockCommunity,
  followCommunity,
  removeFavorite,
} from "./communitySlice";
import {
  isAdminSelector,
  localUserSelector,
  showNsfw,
} from "../auth/authSlice";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import { checkIsMod } from "../../helpers/lemmy";
import { PageContext } from "../auth/PageContext";
import {
  allNSFWHidden,
  buildBlocked,
  buildProblemSubscribing,
  buildSuccessSubscribing,
} from "../../helpers/toastMessages";
import useHidePosts from "../feed/useHidePosts";
import useAppToast from "../../helpers/useAppToast";

interface MoreActionsProps {
  community: string;
}

export default function MoreActions({ community }: MoreActionsProps) {
  const presentToast = useAppToast();
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const site = useAppSelector((state) => state.auth.site);
  const isAdmin = useAppSelector(isAdminSelector);
  const localUser = useAppSelector(localUserSelector);
  const [presentActionSheet] = useIonActionSheet();
  const { presentPostEditor } = useContext(PageContext);

  const hidePosts = useHidePosts();

  const { presentLoginIfNeeded } = useContext(PageContext);

  const communityByHandle = useAppSelector(
    (state) => state.community.communityByHandle,
  );

  const isSubscribed =
    communityByHandle[community]?.subscribed === "Subscribed" ||
    communityByHandle[community]?.subscribed === "Pending";

  const isBlocked = communityByHandle[community]?.blocked;
  const communityId = communityByHandle[community]?.community.id;

  const favoriteCommunities = useAppSelector(
    (state) => state.community.favorites,
  );

  const isFavorite = useMemo(
    () => favoriteCommunities.includes(community),
    [community, favoriteCommunities],
  );

  const canPost = useMemo(() => {
    const isMod = site ? checkIsMod(community, site) : false;

    const canPost =
      !communityByHandle[community]?.community.posting_restricted_to_mods ||
      isMod ||
      isAdmin;

    return canPost;
  }, [community, communityByHandle, isAdmin, site]);

  const { t,i18n } = useTranslation();

  return (
    <>
      <IonButton
        disabled={!communityByHandle[community]}
        fill="default"
        onClick={() => setOpen(true)}
      >
        <IonIcon icon={ellipsisHorizontal} color="primary" />
      </IonButton>
      <IonActionSheet
        cssClass="left-align-buttons"
        isOpen={open}
        buttons={[
          {
            text: t("submitPost"),
            data: "post",
            icon: createOutline,
          },
          {
            text: t("hidePosts"),
            data: "hide-read",
            icon: eyeOffOutline,
          },
          {
            text: !isSubscribed ? t("subscribe") : t("unsubscribe"),
            data: "subscribe",
            icon: !isSubscribed ? heartOutline : heartDislikeOutline,
          },
          {
            text: !isFavorite ? t("favorite") : t("unfavorite"),
            data: "favorite",
            icon: !isFavorite ? starOutline : starSharp,
          },
          {
            text: t("sidebar"),
            data: "sidebar",
            icon: tabletPortraitOutline,
          },
          {
            text: !isBlocked ? t("blockCommunity") : t("unblockCommunity"),
            role: !isBlocked ? "destructive" : undefined,
            data: "block",
            icon: removeCircleOutline,
          },
          {
            text: t("cancel"),
            role: "cancel",
          },
        ]}
        onDidDismiss={() => setOpen(false)}
        onWillDismiss={async (e) => {
          switch (e.detail.data) {
            case "subscribe": {
              if (presentLoginIfNeeded()) return;

              const communityId = communityByHandle[community]?.community.id;

              if (communityId === undefined)
                throw new Error("community not found");

              try {
                await dispatch(followCommunity(!isSubscribed, communityId));
              } catch (error) {
                presentToast(buildProblemSubscribing(isSubscribed, community));
                throw error;
              }

              presentToast(buildSuccessSubscribing(isSubscribed, community));
              break;
            }
            case "post": {
              if (presentLoginIfNeeded()) return;

              if (!canPost) {
                presentToast({
                  message: t("disabledNewPosts"),
                  color: "warning",
                });
                return;
              }

              presentPostEditor(community);
              break;
            }
            case "hide-read": {
              hidePosts();
              break;
            }
            case "favorite": {
              if (presentLoginIfNeeded()) return;

              if (!isFavorite) {
                dispatch(addFavorite(community));
              } else {
                dispatch(removeFavorite(community));
              }

              presentToast({
                message: `${
                  isFavorite ? t("unfavorited") : t("favorited")
                } c/${community}.`,
                color: "success",
              });

              break;
            }
            case "sidebar": {
              router.push(buildGeneralBrowseLink(`/c/${community}/sidebar`));
              break;
            }
            case "block": {
              if (typeof communityId !== "number") return;

              if (
                !communityByHandle[community]?.blocked &&
                communityByHandle[community]?.community.nsfw &&
                localUser?.show_nsfw
              ) {
                // User wants to block a NSFW community when account is set to show NSFW. Ask them
                // if they want to hide all NSFW instead of blocking on a per community basis
                presentActionSheet({
                  header: t("blockNSFW"),
                  subHeader:
                    t("affectAccount"),
                  cssClass: "left-align-buttons",
                  buttons: [
                    {
                      text: t("blockNSFW"),
                      role: "destructive",
                      handler: () => {
                        (async () => {
                          await dispatch(showNsfw(false));

                          presentToast(allNSFWHidden);
                        })();
                      },
                    },
                    {
                      text: t("onlyThisCommunity"),
                      role: "destructive",
                      handler: () => {
                        (async () => {
                          await dispatch(
                            blockCommunity(!isBlocked, communityId),
                          );

                          presentToast(buildBlocked(!isBlocked, community));
                        })();
                      },
                    },
                    {
                      text: t("cancel"),
                      role: "cancel",
                    },
                  ],
                });
              } else {
                await dispatch(blockCommunity(!isBlocked, communityId));

                presentToast(buildBlocked(!isBlocked, community));
              }
            }
          }
        }}
      />
    </>
  );
}
