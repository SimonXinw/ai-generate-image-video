type Props = {
  imageUrl: string;
  error: string;
};

export function ResultView({ imageUrl, error }: Props) {
  if (error) {
    return <p className="err card">{error}</p>;
  }
  if (!imageUrl) {
    return <p className="muted card">还没有图。提交提示词后会显示在这里。</p>;
  }
  return (
    <figure className="card result">
      <img src={imageUrl} alt="生成结果" />
      <a href={imageUrl} download>
        下载
      </a>
    </figure>
  );
}
