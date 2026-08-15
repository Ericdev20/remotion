import "./index.css";
import { MyComposition } from "./Composition";
import { FinalCutComposition } from "./FinalCut";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <FinalCutComposition />
    </>
  );
};
