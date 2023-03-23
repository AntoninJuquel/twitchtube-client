type TwitchClipProps = {
  clip: string;
};

function TwitchClip({ clip }: TwitchClipProps) {
  return (
    <iframe
      title={clip}
      src={`${clip}&parent=${window.location.hostname}`}
      width={448}
      height={252}
      allowFullScreen
    />
  );
}

export default TwitchClip;
