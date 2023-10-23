import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonItem,
  IonList,
  IonInput,
  IonLabel,
  IonIcon,
  IonNavLink,
  useIonRouter,
  IonToggle,
} from "@ionic/react";
import { useEffect, useState } from "react";
import useClient from "../../../helpers/useClient";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Centered, Spinner } from "../../auth/Login";
import { jwtSelector, urlSelector } from "../../auth/authSlice";
import { startCase } from "lodash";
import { css } from "@emotion/react";
import { getHandle, getRemoteHandle, isUrlImage } from "../../../helpers/lemmy";
import { cameraOutline } from "ionicons/icons";
import { PostEditorProps } from "./PostEditor";
import NewPostText from "./NewPostText";
import { useBuildGeneralBrowseLink } from "../../../helpers/routes";
import PhotoPreview from "./PhotoPreview";
import { uploadImage } from "../../../services/lemmy";
import { receivedPosts } from "../postSlice";
import useAppToast from "../../../helpers/useAppToast";

const Container = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
`;

const IonInputTitle = styled(IonInput)`
  .input-bottom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    border: 0;
  }

  .native-wrapper {
    margin-right: 2rem;
  }
`;

const PostingIn = styled.div`
  font-size: 0.875em;
  margin: 0.5rem 0;
  text-align: center;
  color: var(--ion-color-medium);
`;

const CameraIcon = styled(IonIcon)`
  margin: -0.2em 0; // TODO negative margin, bad alex
  font-size: 1.5em;

  margin-right: 0.5rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

type PostType = "photo" | "link" | "text";

export default function PostEditorRoot({
  setCanDismiss,
  dismiss,
  ...props
}: PostEditorProps) {
  const community =
    "existingPost" in props
      ? props.existingPost.community
      : props.community?.community;

  if (!community) throw new Error("community must be defined");

  const existingPost = "existingPost" in props ? props.existingPost : undefined;

  const dispatch = useAppDispatch();

  const initialImage =
    existingPost?.post.url && isUrlImage(existingPost.post.url)
      ? existingPost.post.url
      : undefined;

  const initialPostType = (() => {
    if (!existingPost) return "photo";

    if (initialImage) return "photo";

    if (existingPost.post.url) return "link";

    return "text";
  })();

  const initialTitle = existingPost?.post.name ?? "";

  const initialUrl = initialImage ? "" : existingPost?.post.url ?? "";

  const initialText = existingPost?.post.body ?? "";

  const initialNsfw = existingPost?.post.nsfw ?? false;

  const [postType, setPostType] = useState<PostType>(initialPostType);
  const client = useClient();
  const jwt = useAppSelector(jwtSelector);
  const presentToast = useAppToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [nsfw, setNsfw] = useState(initialNsfw);

  const [photoUrl, setPhotoUrl] = useState(initialImage ?? "");
  const [photoPreviewURL, setPhotoPreviewURL] = useState<string | undefined>(
    initialImage,
  );
  const [photoUploading, setPhotoUploading] = useState(false);

  const instanceUrl = useAppSelector(urlSelector);

  const router = useIonRouter();
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();

  const showNsfwToggle = !!(
    (postType === "photo" && photoPreviewURL) ||
    (postType === "link" && url)
  );

  useEffect(() => {
    setCanDismiss(
      initialPostType === postType &&
        text === initialText &&
        title === initialTitle &&
        url === initialUrl &&
        photoPreviewURL === initialImage &&
        initialNsfw === (showNsfwToggle && nsfw), // if not showing toggle, it's not nsfw
    );
  }, [
    initialPostType,
    postType,
    setCanDismiss,
    text,
    title,
    url,
    photoPreviewURL,
    initialText,
    initialTitle,
    initialUrl,
    initialImage,
    initialNsfw,
    showNsfwToggle,
    nsfw,
  ]);

  function canSubmit() {
    if (!title) return false;

    switch (postType) {
      case "link":
        if (!url) return false;
        break;

      case "photo":
        if (!photoUrl) return false;
        break;
    }

    return true;
  }

  async function submit() {
    if (!jwt || !community) return;

    // super hacky, I know... but current value submitted
    // from child is needed for submit
    const text = await new Promise<string>((resolve) =>
      setText((text) => {
        resolve(text);
        return text;
      }),
    );

    const postUrl = (() => {
      switch (postType) {
        case "link":
          return url || undefined;
        case "photo":
          return photoUrl || undefined;
        default:
          return;
      }
    })();

    let errorMessage: string | undefined;

    if (!title) {
      errorMessage = t('pleaseAddTitle');
    } else if (postType === "link" && (!url || !validUrl(url))) {
      errorMessage =
        t('pleaseAddUrl');
    } else if (postType === "photo" && !photoUrl) {
      errorMessage = t('PleaseAddPhoto');
    } else if (!canSubmit()) {
      errorMessage =
        t('doubleCheck');
    }

    if (errorMessage) {
      presentToast({
        // TODO more helpful msg
        message: errorMessage,
        fullscreen: true,
      });

      return;
    }

    setLoading(true);

    let postResponse;

    const payload = {
      name: title,
      url: postUrl,
      body: text || undefined,
      nsfw: showNsfwToggle && nsfw,

      auth: jwt,
    };

    try {
      if (existingPost) {
        postResponse = await client.editPost({
          post_id: existingPost.post.id,
          ...payload,
        });
      } else {
        postResponse = await client.createPost({
          community_id: community.id,
          ...payload,
        });
      }
    } catch (error) {
      presentToast({
        message: t('problemSubmitting'),
        color: "danger",
        fullscreen: true,
      });

      throw error;
    } finally {
      setLoading(false);
    }

    dispatch(receivedPosts([postResponse.post_view]));

    presentToast({
      message: existingPost ? t('postEdited') : t('postCreated'),
      color: "success",
      fullscreen: true,
    });

    setCanDismiss(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    dismiss();

    if (!existingPost)
      router.push(
        buildGeneralBrowseLink(
          `/c/${getHandle(community)}/comments/${
            postResponse.post_view.post.id
          }`,
        ),
      );
  }

  async function receivedImage(image: File) {
    if (!jwt) return;

    setPhotoPreviewURL(URL.createObjectURL(image));
    setPhotoUploading(true);

    let imageUrl;

    try {
      imageUrl = await uploadImage(instanceUrl, jwt, image);
    } catch (error) {
      presentToast({
        message: t('problemUploading'),
        color: "danger",
        fullscreen: true,
      });
      clearImage();

      throw error;
    } finally {
      setPhotoUploading(false);
    }

    setPhotoUrl(imageUrl);
  }

  function clearImage() {
    setPhotoUrl("");
    setPhotoPreviewURL(undefined);
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
              <IonText>
                {existingPost ? t('editPost') : <>{startCase(postType)} {t("post")}</>}
              </IonText>
              {loading && <Spinner color="dark" />}
            </Centered>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              strong={true}
              type="submit"
              disabled={loading || !canSubmit()}
              onClick={submit}
            >
              {t('post')}
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            css={css`
              width: 100%;
            `}
            value={postType}
            onIonChange={(e) => setPostType(e.target.value as PostType)}
          >
            <IonSegmentButton value="photo">{t('photo')}</IonSegmentButton>
            <IonSegmentButton value="link">{t('link')}</IonSegmentButton>
            <IonSegmentButton value="text">{t('text')}</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Container>
          <IonList>
            <IonItem>
              <IonInputTitle
                value={title}
                onIonInput={(e) => setTitle(e.detail.value ?? "")}
                placeholder={t('title')}
                counter
                maxlength={200}
                counterFormatter={(inputLength, maxLength) =>
                  `${maxLength - inputLength}`
                }
              />
            </IonItem>
            {postType === "photo" && (
              <>
                <label htmlFor="photo-upload">
                  <IonItem>
                    <IonLabel color="primary">
                      <CameraIcon icon={cameraOutline} /> {t('choosePhoto')}
                    </IonLabel>

                    <HiddenInput
                      type="file"
                      accept="image/*"
                      id="photo-upload"
                      onInput={(e) => {
                        const image = (e.target as HTMLInputElement).files?.[0];
                        if (!image) return;

                        receivedImage(image);
                      }}
                    />
                  </IonItem>
                </label>
                {photoPreviewURL && (
                  <IonItem>
                    <PhotoPreview
                      src={photoPreviewURL}
                      loading={photoUploading}
                    />
                  </IonItem>
                )}
              </>
            )}
            {postType === "link" && (
              <IonItem>
                <IonInput
                  placeholder="https://aspca.org"
                  clearInput
                  value={url}
                  onIonInput={(e) => setUrl(e.detail.value ?? "")}
                />
              </IonItem>
            )}
            {showNsfwToggle && (
              <IonItem>
                <IonText color="medium">{t('nsfw')}</IonText>{" "}
                <IonToggle
                  slot="end"
                  checked={nsfw}
                  onIonChange={(e) => setNsfw(e.detail.checked)}
                />
              </IonItem>
            )}
            <IonNavLink
              routerDirection="forward"
              component={() => (
                <NewPostText
                  value={text}
                  setValue={setText}
                  onSubmit={submit}
                  editing={"existingPost" in props}
                />
              )}
            >
              <IonItem detail>
                <IonLabel color={!text ? "medium" : undefined}>
                  {!text ? t('textOptional') : text}
                </IonLabel>
              </IonItem>
            </IonNavLink>
          </IonList>

          <PostingIn>{t('postingIn')} {getRemoteHandle(community)}</PostingIn>
        </Container>
      </IonContent>
    </>
  );
}

function validUrl(url: string): boolean {
  try {
    new URL(url);
  } catch (e) {
    return false;
  }

  return true;
}
