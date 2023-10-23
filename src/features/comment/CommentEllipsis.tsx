import styled from "@emotion/styled";
import { IonIcon, useIonActionSheet, useIonRouter } from "@ionic/react";
import {
  arrowDownOutline,
  arrowUndoOutline,
  arrowUpOutline,
  bookmarkOutline,
  chevronCollapseOutline,
  ellipsisHorizontal,
  flagOutline,
  pencilOutline,
  personOutline,
  shareOutline,
  textOutline,
  trashOutline,
} from "ionicons/icons";
import { CommentView } from "lemmy-js-client";
import { useContext } from "react";
import { notEmpty } from "../../helpers/array";
import {
  getHandle,
  getRemoteHandle,
  canModify as isCommentMutable,
  share,
} from "../../helpers/lemmy";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import { saveError, voteError } from "../../helpers/toastMessages";
import { useAppDispatch, useAppSelector } from "../../store";
import { PageContext } from "../auth/PageContext";
import { handleSelector, isDownvoteEnabledSelector } from "../auth/authSlice";
import { CommentsContext } from "./CommentsContext";
import { deleteComment, saveComment, voteOnComment } from "./commentSlice";
import useCollapseRootComment from "./useCollapseRootComment";
import useAppToast from "../../helpers/useAppToast";
import { useTranslation } from "react-i18next";

const StyledIonIcon = styled(IonIcon)`
  padding: 8px 12px;
  margin: -8px -12px;

  font-size: 1.2em;
`;

interface MoreActionsProps {
  comment: CommentView;
  rootIndex: number | undefined;
}

export default function MoreActions({
  comment: commentView,
  rootIndex,
}: MoreActionsProps) {
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const dispatch = useAppDispatch();
  const { prependComments } = useContext(CommentsContext);
  const myHandle = useAppSelector(handleSelector);
  const presentToast = useAppToast();
  const [presentActionSheet] = useIonActionSheet();
  const [presentSecondaryActionSheet] = useIonActionSheet();
  const collapseRootComment = useCollapseRootComment(commentView, rootIndex);
  const { t,i18n } = useTranslation();

  const commentById = useAppSelector((state) => state.comment.commentById);

  const router = useIonRouter();

  // Comment from slice might be more up to date, e.g. edits
  const comment = commentById[commentView.comment.id] ?? commentView.comment;

  const {
    presentLoginIfNeeded,
    presentCommentReply,
    presentCommentEdit,
    presentReport,
    presentSelectText,
  } = useContext(PageContext);

  const commentVotesById = useAppSelector(
    (state) => state.comment.commentVotesById,
  );
  const commentSavedById = useAppSelector(
    (state) => state.comment.commentSavedById,
  );

  const myVote = commentVotesById[comment.id] ?? commentView.my_vote;
  const mySaved = commentSavedById[comment.id] ?? commentView.saved;

  const downvoteAllowed = useAppSelector(isDownvoteEnabledSelector);
  const isMyComment = getRemoteHandle(commentView.creator) === myHandle;
  const commentExists = !comment.deleted && !comment.removed;

  function onClick() {
    presentActionSheet({
      cssClass: "left-align-buttons",
      buttons: [
        {
          text: myVote !== 1 ? t('upvote') : t('undoUpvote'),
          icon: arrowUpOutline,
          handler: () => {
            (async () => {
              if (presentLoginIfNeeded()) return;

              try {
                await dispatch(voteOnComment(comment.id, myVote === 1 ? 0 : 1));
              } catch (error) {
                presentToast(voteError);
              }
            })();
          },
        },
        downvoteAllowed
          ? {
              text: myVote !== -1 ? t('downvote') : t('undo-downvote'),
              icon: arrowDownOutline,
              handler: () => {
                (async () => {
                  if (presentLoginIfNeeded()) return;

                  try {
                    await dispatch(
                      voteOnComment(comment.id, myVote === -1 ? 0 : -1),
                    );
                  } catch (error) {
                    presentToast(voteError);
                  }
                })();
              },
            }
          : undefined,
        {
          text: !mySaved ? t('save') : t('unsave'),
          icon: bookmarkOutline,
          handler: () => {
            (async () => {
              if (presentLoginIfNeeded()) return;

              try {
                await dispatch(saveComment(comment.id, !mySaved));
              } catch (error) {
                presentToast(saveError);
              }
            })();
          },
        },
        isMyComment && isCommentMutable(comment)
          ? {
              text: t('edit'),
              icon: pencilOutline,
              handler: () => {
                presentCommentEdit(comment);
              },
            }
          : undefined,
        isMyComment && isCommentMutable(comment)
          ? {
              text: t('delete'),
              icon: trashOutline,
              handler: () => {
                presentSecondaryActionSheet({
                  buttons: [
                    {
                      text: t('delete-comment'),
                      role: "destructive",
                      handler: () => {
                        (async () => {
                          try {
                            await dispatch(deleteComment(comment.id));
                          } catch (error) {
                            presentToast({
                              message:
                                t('problem-deleting-comment-please-try-again'),
                              color: "danger",
                            });

                            throw error;
                          }

                          presentToast({
                            message: t('comment-deleted'),
                            color: "primary",
                          });
                        })();
                      },
                    },
                    {
                      text: t('cancel'),
                      role: "cancel",
                    },
                  ],
                });
              },
            }
          : undefined,
        {
          text: t('reply'),
          icon: arrowUndoOutline,
          handler: () => {
            (async () => {
              if (presentLoginIfNeeded()) return;

              const reply = await presentCommentReply(commentView);

              if (reply) prependComments([reply]);
            })();
          },
        },
        commentExists && comment.content
          ? {
              text: t('selectText'),
              icon: textOutline,
              handler: () => {
                presentSelectText(comment.content);
              },
            }
          : undefined,
        {
          text: getHandle(commentView.creator),
          icon: personOutline,
          handler: () => {
            router.push(
              buildGeneralBrowseLink(`/u/${getHandle(commentView.creator)}`),
            );
          },
        },
        {
          text: t('share'),
          icon: shareOutline,
          handler: () => {
            share(comment);
          },
        },
        rootIndex !== undefined
          ? {
              text: t('collapse'),
              icon: chevronCollapseOutline,
              handler: () => {
                collapseRootComment();
              },
            }
          : undefined,
        {
          text: t('report'),
          role: "report",
          icon: flagOutline,
          handler: () => {
            presentReport(commentView);
          },
        },
        {
          text: t('cancel'),
          role: "cancel",
        },
      ].filter(notEmpty),
    });
  }

  return (
    <StyledIonIcon
      icon={ellipsisHorizontal}
      onClick={(e) => {
        onClick();
        e.stopPropagation();
      }}
    />
  );
}
