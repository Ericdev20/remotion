import "./index.css";
import { MyComposition } from "./Composition";
import { BudgetKitComposition } from "./projects/budgetKit";
import { OracleComposition } from "./projects/oracle";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <BudgetKitComposition />
      <OracleComposition />
    </>
  );
};
