import { AGE_KEY } from "../constants";

type Props = {
  onConfirm: () => void;
};

export function AgeGate({ onConfirm }: Props) {
  return (
    <div className="gate">
      <div className="card">
        <h1>仅限成人</h1>
        <p>本机生成不审查成人内容，但禁止任何未成年人相关描述。确认你已满 18 岁。</p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(AGE_KEY, "1");
            onConfirm();
          }}
        >
          我已满 18 岁
        </button>
      </div>
    </div>
  );
}
